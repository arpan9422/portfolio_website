import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import os from "os";

// ── Config ────────────────────────────────────────────────────────────────────
const MAX_QUESTIONS = 30;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour in ms

// ── DB setup (singleton) ──────────────────────────────────────────────────────
// In serverless (Vercel/Lambda), process.cwd() is read-only — use os.tmpdir().
// Locally, keep data/ inside the project so it survives dev-server restarts.
const DATA_DIR =
  process.env.NODE_ENV === "production"
    ? os.tmpdir()
    : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "rate_limit.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  // Ensure the data directory exists (no-op in prod since /tmp always exists)
  if (process.env.NODE_ENV !== "production") {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  _db = new Database(DB_PATH);

  // WAL mode for better concurrent read performance
  _db.pragma("journal_mode = WAL");

  // Create table + index on first run
  _db.exec(`
    CREATE TABLE IF NOT EXISTS rate_limit (
      ip        TEXT    NOT NULL,
      timestamp INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_ip_ts ON rate_limit (ip, timestamp);
  `);

  return _db;
}

// ── Prepared statements (created lazily once db is ready) ─────────────────────
function getStmts(db: Database.Database) {
  return {
    purge:  db.prepare("DELETE FROM rate_limit WHERE timestamp < ?"),
    count:  db.prepare<[string, number], { cnt: number }>(
              "SELECT COUNT(*) AS cnt FROM rate_limit WHERE ip = ? AND timestamp >= ?"
            ),
    insert: db.prepare("INSERT INTO rate_limit (ip, timestamp) VALUES (?, ?)"),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number; // questions left in this window (after this one)
  message?: string;
}

/**
 * Check and record a single question attempt for the given IP.
 * Also purges entries older than the 1-hour window on every call.
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const db = getDb();
  const stmts = getStmts(db);

  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Purge stale entries first (keeps the table small)
  stmts.purge.run(windowStart);

  // Count how many questions this IP has asked in the current window
  const { cnt } = stmts.count.get(ip, windowStart)!;

  if (cnt >= MAX_QUESTIONS) {
    return {
      allowed: false,
      remaining: 0,
      message:
        "I guess you know a lot about Arpan! 😄 Let's take a break — you've asked " +
        MAX_QUESTIONS +
        " questions this hour. Come back in a bit! ☕",
    };
  }

  // Record this question
  stmts.insert.run(ip, now);

  return {
    allowed: true,
    remaining: MAX_QUESTIONS - cnt - 1,
  };
}
