import { type NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const url = new URL(request.url);
  const apiBase = process.env.BASE_URL ?? "http://localhost:8080/api";
  const targetURL = `${apiBase}/${path.join("/")}${url.search}`;

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.arrayBuffer()
      : undefined;

  const apiHost = new URL(apiBase).host;
  const headers = new Headers(request.headers);
  headers.set("host", apiHost);

  const response = await fetch(targetURL, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  // For redirects: return a 200 HTML page that sets cookies and redirects via JS.
  // Cloudflare and some proxies strip Set-Cookie from 302 responses, so we use
  // a 200 HTML response to ensure cookies are stored before the redirect fires.
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location") ?? "/";
    const cookies = response.headers.getSetCookie();

    const safeLocation = JSON.stringify(location);
    const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${location}"></head><body><script>window.location.replace(${safeLocation})</script></body></html>`;

    const htmlResponse = new NextResponse(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store, private",
      },
    });

    for (const cookie of cookies) {
      htmlResponse.headers.append("set-cookie", cookie);
    }

    return htmlResponse;
  }

  // For normal responses, copy headers and body
  const nextResponse = new NextResponse(response.body, {
    status: response.status,
  });

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "content-encoding") {
      nextResponse.headers.set(key, value);
    }
  });

  const cookies = response.headers.getSetCookie();
  for (const cookie of cookies) {
    nextResponse.headers.append("set-cookie", cookie);
  }

  return nextResponse;
}

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
