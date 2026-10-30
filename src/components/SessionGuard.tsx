"use client";

import * as React from "react";
import { signOut, useSession } from "next-auth/react";

import { AUTH_DISABLED } from "@/lib/auth-config";

/**
 * Signs the user out locally once the Keycloak refresh token is dead.
 *
 * The server drops the access token and flags the session with
 * "RefreshAccessTokenError"; without this the header would keep showing a
 * logged-in user whose requests all fail with 401. Pages that require auth
 * still redirect to the Keycloak login through their own 401 handling.
 */
export function SessionGuard() {
  const { data: session } = useSession();
  const handled = React.useRef(false);

  React.useEffect(() => {
    if (AUTH_DISABLED) return;

    if (session?.error !== "RefreshAccessTokenError") {
      handled.current = false;
      return;
    }

    if (handled.current) return;
    handled.current = true;

    // `redirect: false` keeps the user on the current (possibly public) page;
    // the session state then flips to unauthenticated.
    signOut({ redirect: false }).catch((error) => {
      console.error("Failed to sign out expired session:", error);
    });
  }, [session?.error]);

  return null;
}
