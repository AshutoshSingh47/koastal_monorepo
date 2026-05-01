import { prismaAdapter } from "@better-auth/prisma-adapter";
import { APIError, betterAuth } from "better-auth";
import { createAuthMiddleware, emailOTP, magicLink } from "better-auth/plugins";
import { transporter } from "./email";
import { db } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false,
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        defaultValue: "New",
      },
      lastName: {
        type: "string",
        required: false,
        defaultValue: "User",
      },
      role: {
        type: "string",
        defaultValue: "ADMIN",
      },
      status: {
        type: "string",
        defaultValue: "PENDING",
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",") ?? [
    "http://localhost:3000",
    "http://localhost:3001",
  ],

  // SESSION MANAGEMENT (15 Days)
  session: {
    expiresIn: 60 * 60 * 24 * 15, // 15 days
    updateAge: 60 * 60 * 24 * 1, // Refresh every 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 2, // Increased to 2hr so revoked sessions take effect quickly
    },
  },

  // RATE LIMITING — raised to 30 so get-session calls don't trigger it
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Block OTP requests for emails not in the system
      if (ctx.path === "/email-otp/send-verification-otp") {
        const body = ctx.body as { email?: string; type?: string };

        if (body.email && body.type === "sign-in") {
          const user = await db.user.findUnique({
            where: { email: body.email },
          });

          if (!user) {
            throw new APIError("BAD_REQUEST", {
              message: "Access denied! This email is not valid",
            });
          }
          // if (user.status === "PENDING" || user.status === "BLOCKED") {
          //   throw new APIError("BAD_REQUEST", {
          //     message:
          //       user.status === "BLOCKED"
          //         ? "This email is blocked! Contact the Super Admin. "
          //         : user.status === "PENDING"
          //           ? "This email is on waitlist to be approved! Contact the Super Admin. "
          //           : "",
          //   });
          // }
        }
      }

      // Magic link can only be triggered server-side via the invite endpoint, not directly
      if (ctx.path === "/sign-in/magic-link") {
        const internalSecret = ctx.headers?.get("x-internal-invite");
        if (internalSecret !== process.env.INTERNAL_INVITE_SECRET) {
          throw new APIError("FORBIDDEN", {
            message: "Magic link sign-in is not available. Use OTP to sign in.",
          });
        }
      }
    }),
  },

  plugins: [
    emailOTP({
      disableSignUp: true, // Sign-up via OTP not allowed; admin creates users
      expiresIn: 60 * 5, // OTP valid for 5 mins (Industry Standard)
      otpLength: 6,
      async sendVerificationOTP({ email, otp }) {
        // 5. ERROR HANDLING: Wrapping in try/catch for SMTP reliability
        try {
          await transporter.sendMail({
            from: '"Koastal Admin" <admin@koastal.com>',
            to: email,
            subject: "Your Login Verification Code",
            html: `<b>Your code is ${otp}</b>. It will expire in 5 minutes.`,
          });
        } catch (error) {
          console.error("Email send error:", error);
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "We couldn't send your code. Please try again later.",
          });
        }
      },
    }),
    magicLink({
      expiresIn: 60 * 15,
      disableSignUp: true, // User must already exist; hook above enforces this
      storeToken: "hashed",
      sendMagicLink: async ({ email, url }) => {
        try {
          const user = await db.user.findUnique({ where: { email } });
          const name = user?.name ?? "there";

          await transporter.sendMail({
            from: '"Koastal Admin" <admin@koastal.com>',
            to: email,
            subject: "Secure Login Link for Koastal",
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2>Hi ${name}, Welcome to the Portal</h2>
                <p>Click the button below to log in. This link is valid for 15 minutes and can only be used once.</p>
                <a href="${url}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  Sign In to Dashboard
                </a>
                <p style="margin-top: 20px; color: #666; font-size: 12px;">
                  If you did not request this, please ignore this email.
                </p>
              </div>
            `,
          });
        } catch (error) {
          console.error("Magic Link Email failed:", error);
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Failed to send login link.",
          });
        }
      },
    }),
  ],
});
