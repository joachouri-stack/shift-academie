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

  CREATE TABLE IF NOT EXISTS formations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    format TEXT NOT NULL DEFAULT 'distanciel',
    published INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    formation_id TEXT NOT NULL,
    title TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    prenom TEXT NOT NULL,
    nom TEXT NOT NULL,
    metier TEXT NOT NULL DEFAULT '',
    nombre TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL,
    telephone TEXT NOT NULL DEFAULT '',
    format TEXT NOT NULL DEFAULT '',
    periode TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    handled INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
`);

export const db = drizzle(sqlite, { schema });
export { schema };
