// Edge-compatible setup check for middleware. Uses neon serverless directly.
export async function isSetupAvailableForMiddleware(connString: string): Promise<boolean> {
  const sql = "SELECT owner_user_id FROM app_installation WHERE key = 'primary' LIMIT 1";
  const { Pool } = await import("@neondatabase/serverless");
  const pool = new Pool({ connectionString: connString, max: 1 });
  try {
    const result = await pool.query(sql);
    return !result.rows[0]?.owner_user_id;
  } finally {
    await pool.end();
  }
}
