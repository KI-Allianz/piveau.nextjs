const UMA_TICKET_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:uma-ticket";

export interface KeycloakPermission {
  rsid?: string;
  rsname?: string;
  scopes: string[];
}

/**
 * Resolves the Keycloak Authorization Services permissions of the user behind
 * the given access token.
 *
 * The catalogue assignments are not part of the access token (they are not a
 * user attribute or role), so they have to be requested from the UMA endpoint
 * with `response_mode=permissions`.
 *
 * @returns the granted permissions, or an empty list if the user has none.
 */
export async function getKeycloakPermissions(
  accessToken: string,
): Promise<KeycloakPermission[]> {
  const issuer = (process.env.AUTH_KEYCLOAK_ISSUER || "").replace(/\/$/, "");
  const audience = process.env.AUTH_KEYCLOAK_RPT_AUDIENCE;

  if (!issuer || !audience) {
    throw new Error(
      "AUTH_KEYCLOAK_ISSUER and AUTH_KEYCLOAK_RPT_AUDIENCE must be configured to resolve Keycloak permissions.",
    );
  }

  const response = await fetch(`${issuer}/protocol/openid-connect/token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: UMA_TICKET_GRANT_TYPE,
      audience,
      response_mode: "permissions",
      response_include_resource_name: "true",
    }),
    cache: "no-store",
  });

  const body = await response.json().catch(() => null);

  // Keycloak answers 403 with access_denied when the user has no permissions
  // at all. Other 403s indicate a configuration problem and should surface.
  if (
    response.status === 403 &&
    (!body ||
      body.error === "access_denied" ||
      body.error_description === "not_authorized")
  ) {
    return [];
  }

  if (!response.ok) {
    const detail = body ? `: ${JSON.stringify(body)}` : "";
    throw new Error(
      `Keycloak permission request failed with ${response.status}${detail}`,
    );
  }

  return Array.isArray(body) ? body : [];
}
