import type { SVGAttributes } from "react";
import { cn } from "@workspace/ui/lib/utils";

const baseDimensions = "w-4 h-4";

type SocialLogoProps = SVGAttributes<SVGSVGElement>;

export function FacebookLogo({ className = "", ...props }: SocialLogoProps) {
  return (
    <svg
      className={cn("base-svg-icon base-facebook-alt2-svg", baseDimensions, className)}
      fill="currentColor"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 28"
      {...props}
    >
      <title>Facebook</title>
      <path d="M14.984 0.187v4.125h-2.453c-1.922 0-2.281 0.922-2.281 2.25v2.953h4.578l-0.609 4.625h-3.969v11.859h-4.781v-11.859h-3.984v-4.625h3.984v-3.406c0-3.953 2.422-6.109 5.953-6.109 1.687 0 3.141 0.125 3.563 0.187z"></path>
    </svg>
  );
}

export function YoutubeLogo({ className = "", ...props }: SocialLogoProps) {
  return (
    <svg
      className={cn("base-svg-icon base-youtube-svg", baseDimensions, className)}
      fill="currentColor"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      {...props}
    >
      <title>YouTube</title>
      <path d="M11.109 17.625l7.562-3.906-7.562-3.953v7.859zM14 4.156c5.891 0 9.797 0.281 9.797 0.281 0.547 0.063 1.75 0.063 2.812 1.188 0 0 0.859 0.844 1.109 2.781 0.297 2.266 0.281 4.531 0.281 4.531v2.125s0.016 2.266-0.281 4.531c-0.25 1.922-1.109 2.781-1.109 2.781-1.062 1.109-2.266 1.109-2.812 1.172 0 0-3.906 0.297-9.797 0.297v0c-7.281-0.063-9.516-0.281-9.516-0.281-0.625-0.109-2.031-0.078-3.094-1.188 0 0-0.859-0.859-1.109-2.781-0.297-2.266-0.281-4.531-0.281-4.531v-2.125s-0.016-2.266 0.281-4.531c0.25-1.937 1.109-2.781 1.109-2.781 1.062-1.125 2.266-1.125 2.812-1.188 0 0 3.906-0.281 9.797-0.281v0z"></path>
    </svg>
  );
}

export function TwitterLogo({ className = "", ...props }: SocialLogoProps) {
  return (
    <svg
      className={cn("base-svg-icon base-twitter-x-svg", baseDimensions, className)}
      fill="currentColor"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 23 24"
      {...props}
    >
      <title>X</title>
      <path d="M13.969 10.157l8.738-10.157h-2.071l-7.587 8.819-6.060-8.819h-6.989l9.164 13.336-9.164 10.651h2.071l8.012-9.313 6.4 9.313h6.989l-9.503-13.831zM11.133 13.454l-8.316-11.895h3.181l14.64 20.941h-3.181l-6.324-9.046z"></path>
    </svg>
  );
}

export function InstagramLogo({ className = "", ...props }: SocialLogoProps) {
  return (
    <svg
      className={cn("base-svg-icon base-instagram-alt-svg", baseDimensions, className)}
      fill="currentColor"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      <title>Instagram</title>
      <path d="M7 1c-1.657 0-3.158 0.673-4.243 1.757s-1.757 2.586-1.757 4.243v10c0 1.657 0.673 3.158 1.757 4.243s2.586 1.757 4.243 1.757h10c1.657 0 3.158-0.673 4.243-1.757s1.757-2.586 1.757-4.243v-10c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757zM7 3h10c1.105 0 2.103 0.447 2.828 1.172s1.172 1.723 1.172 2.828v10c0 1.105-0.447 2.103-1.172 2.828s-1.723 1.172-2.828 1.172h-10c-1.105 0-2.103-0.447-2.828-1.172s-1.172-1.723-1.172-2.828v-10c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172zM16.989 11.223c-0.15-0.972-0.571-1.857-1.194-2.567-0.754-0.861-1.804-1.465-3.009-1.644-0.464-0.074-0.97-0.077-1.477-0.002-1.366 0.202-2.521 0.941-3.282 1.967s-1.133 2.347-0.93 3.712 0.941 2.521 1.967 3.282 2.347 1.133 3.712 0.93 2.521-0.941 3.282-1.967 1.133-2.347 0.93-3.712zM15.011 11.517c0.122 0.82-0.1 1.609-0.558 2.227s-1.15 1.059-1.969 1.18-1.609-0.1-2.227-0.558-1.059-1.15-1.18-1.969 0.1-1.609 0.558-2.227 1.15-1.059 1.969-1.18c0.313-0.046 0.615-0.042 0.87-0.002 0.74 0.11 1.366 0.47 1.818 0.986 0.375 0.428 0.63 0.963 0.72 1.543zM17.5 7.5c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z"></path>
    </svg>
  );
}
