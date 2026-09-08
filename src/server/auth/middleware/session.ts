// Edge-compatible session verification for middleware only.
// Uses Web Crypto API (edge-compatible) instead of node:crypto.

const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-cadabry_session" : "cadabry_session";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

async function digestToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

type MiddlewareActor = {
  userId: string;
  sessionId: string;
  displayName: string;
};

export async function verifySessionForMiddleware(
  token: string,
  connString: string,
): Promise<MiddlewareActor | null> {
  if (token.length < 40 || token.length > 128) return null;

  const digest = await digestToken(token);

  const sql = `
    SELECT
      s.id,
      s.expires_at,
      s.revoked_at,
      s.last_seen_at,
      u.id AS user_id,
      u.display_name,
      u.disabled_at
    FROM auth_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_digest = $1
    LIMIT 1
  `;

  const { Pool } = await import("@neondatabase/serverless");
  const pool = new Pool({ connectionString: connString, max: 1 });

  try {
    const result = await pool.query(sql, [digest]);
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    const now = new Date();

    if (row.revoked_at || new Date(row.expires_at) <= now || row.disabled_at) {
      return null;
    }

    // Fire-and-forget touch
    const touchInterval = 86_400_000;
    const lastSeen = new Date(row.last_seen_at);
    if (now.getTime() - lastSeen.getTime() >= touchInterval) {
      pool
        .query("UPDATE auth_sessions SET last_seen_at = $1 WHERE id = $2 AND revoked_at IS NULL", [
          now.toISOString(),
          row.id,
        ])
        .catch(() => {});
    }

    return {
      userId: row.user_id,
      sessionId: row.id,
      displayName: row.display_name,
    };
  } finally {
    await pool.end();
  }
}

export { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS };
