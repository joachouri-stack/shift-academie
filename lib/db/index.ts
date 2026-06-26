import "server-only";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "fs";
import { dirname, resolve } from "path";
import * as schema from "./schema";

/**
 * Chemin du fichier SQLite.
 * - En local : ./data/shift.db
 * - En production : définir DATABASE_PATH (ex. /app/data/shift.db sur un
 *   volume persistant Coolify) pour que les données survivent aux déploiements.
 */
const dbPath = resolve(process.env.DATABASE_PATH || "./data/shift.db");
mkdirSync(dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

/* Initialisation idempotente du schéma (pas de migration externe à lancer). */
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'learner',
    created_at INTEGER NOT NULL
  );
`);

export const db = drizzle(sqlite, { schema });
export { schema };
