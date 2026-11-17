#!/usr/bin/env node
// One-time helper: obtain a Google Calendar refresh token for Elisabeth's
// account. Run locally, signed in to Google as Elisabeth:
//
//   GOOGLE_OAUTH_CLIENT_ID=... GOOGLE_OAUTH_CLIENT_SECRET=... pnpm google:auth
//
// Requires a "Desktop app" OAuth client (loopback redirects on any port are
// allowed without registration). The server listens on 127.0.0.1 at a random
// free port, or GOOGLE_AUTH_PORT if set. Nothing is written to disk; only the
// refresh token is printed. Node built-ins only.

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events.owned",
  "https://www.googleapis.com/auth/calendar.events.freebusy",
];
const TIMEOUT_MS = 5 * 60 * 1000;

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
if (!clientId || !clientSecret) {
  console.error(
    "Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in the environment first.",
  );
  process.exit(1);
}
const requestedPort = Number(process.env.GOOGLE_AUTH_PORT ?? 0);
if (
  !Number.isInteger(requestedPort) ||
  requestedPort < 0 ||
  requestedPort > 65535
) {
  console.error("GOOGLE_AUTH_PORT must be a port number.");
  process.exit(1);
}

const base64url = (buffer) => buffer.toString("base64url");
const verifier = base64url(randomBytes(48));
const challenge = base64url(createHash("sha256").update(verifier).digest());
const state = base64url(randomBytes(24));

const sameState = (value) => {
  const a = Buffer.from(String(value ?? ""));
  const b = Buffer.from(state);
  return a.length === b.length && timingSafeEqual(a, b);
};

const page = (response, status, message) => {
  response.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(
    `<!doctype html><meta charset="utf-8"><title>HairnThere calendar setup</title><p style="font:16px system-ui;margin:2rem">${message}</p>`,
  );
};

let redirectUri = "";
let finished = false;

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  if (url.pathname !== "/callback" || finished) {
    page(response, 404, "Not found.");
    return;
  }
  if (!sameState(url.searchParams.get("state"))) {
    page(
      response,
      400,
      "State mismatch. Close this tab and run the script again.",
    );
    return;
  }
  finished = true;
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  if (error || !code) {
    page(
      response,
      400,
      "Authorization was not granted. You can close this tab.",
    );
    fail(`Authorization was not granted (${error ?? "no code"}).`);
    return;
  }
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        code_verifier: verifier,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok) {
      page(response, 500, "Token exchange failed. See the terminal.");
      fail(
        `Token exchange failed (HTTP ${tokenResponse.status}${typeof data.error === "string" ? `, ${data.error}` : ""}).`,
      );
      return;
    }
    if (typeof data.refresh_token !== "string" || !data.refresh_token) {
      page(response, 500, "No refresh token was returned. See the terminal.");
      fail(
        "Google returned no refresh token. Remove the app's access at https://myaccount.google.com/permissions and run again.",
      );
      return;
    }
    const granted = String(data.scope ?? "").split(/\s+/);
    const missing = SCOPES.filter((scope) => !granted.includes(scope));
    page(
      response,
      200,
      missing.length
        ? "Signed in, but some calendar permissions were not granted. See the terminal."
        : "Done. You can close this tab and return to the terminal.",
    );
    if (missing.length) {
      fail(
        `These permissions were not granted, so booking would fail:\n  ${missing.join("\n  ")}\nRun again and leave every checkbox selected.`,
      );
      return;
    }
    console.log(
      [
        "",
        "Refresh token (treat as a password; do not commit or share in chat):",
        "",
        data.refresh_token,
        "",
        "Paste it into Coolify as GOOGLE_CALENDAR_REFRESH_TOKEN, then redeploy.",
        "Clear your terminal scrollback afterwards.",
        "",
      ].join("\n"),
    );
    done(0);
  } catch {
    page(response, 500, "Token exchange failed. See the terminal.");
    fail("Token exchange could not reach Google.");
  }
});

function fail(message) {
  console.error(`\n${message}`);
  done(1);
}
function done(code) {
  clearTimeout(timer);
  server.close();
  server.closeAllConnections?.();
  process.exitCode = code;
}

const timer = setTimeout(
  () => fail("Timed out waiting for Google sign-in (5 minutes)."),
  TIMEOUT_MS,
);

server.listen(requestedPort, "127.0.0.1", () => {
  const { port } = server.address();
  redirectUri = `http://127.0.0.1:${port}/callback`;
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  }).toString();
  console.log(
    [
      `Listening on ${redirectUri}`,
      "",
      "Open this URL in a browser signed in as Elisabeth (the calendar owner):",
      "",
      authUrl.toString(),
      "",
      "If Google warns the app is unverified, choose Advanced → continue.",
    ].join("\n"),
  );
});
