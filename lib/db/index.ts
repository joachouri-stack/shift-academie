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
// Attend (jusqu'à 5 s) si la base est verrouillée au lieu d'échouer —
// évite les races entre les workers parallèles de build (SQLITE_BUSY).
sqlite.pragma("busy_timeout = 5000");

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

  /* --- Plateforme e-learning (finançable OPCO) --- */

  CREATE TABLE IF NOT EXISTS inscriptions (
    id TEXT PRIMARY KEY,
    apprenant_id TEXT NOT NULL,
    formation_id TEXT NOT NULL,
    date_debut INTEGER NOT NULL,
    date_fin INTEGER,
    statut TEXT NOT NULL DEFAULT 'en_cours',
    financeur TEXT NOT NULL DEFAULT '',
    prix_cents INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS visionnage_heartbeats (
    id TEXT PRIMARY KEY,
    inscription_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    apprenant_id TEXT NOT NULL,
    position_s INTEGER NOT NULL DEFAULT 0,
    delta_s INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_hb_inscription_module
    ON visionnage_heartbeats (inscription_id, module_id);

  CREATE TABLE IF NOT EXISTS sessions_visionnage (
    id TEXT PRIMARY KEY,
    inscription_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    apprenant_id TEXT NOT NULL,
    timestamp_debut INTEGER NOT NULL,
    timestamp_fin INTEGER,
    duree_effective_secondes INTEGER NOT NULL DEFAULT 0,
    pourcentage_complete INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS progression (
    id TEXT PRIMARY KEY,
    inscription_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    apprenant_id TEXT NOT NULL,
    duree_effective_cumulee INTEGER NOT NULL DEFAULT 0,
    max_position_s INTEGER NOT NULL DEFAULT 0,
    valide INTEGER NOT NULL DEFAULT 0,
    date_validation INTEGER,
    last_heartbeat_at INTEGER,
    updated_at INTEGER NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_progression_uniq
    ON progression (inscription_id, module_id);

  CREATE TABLE IF NOT EXISTS questions_tutorat (
    id TEXT PRIMARY KEY,
    inscription_id TEXT NOT NULL,
    apprenant_id TEXT NOT NULL,
    module_id TEXT,
    question TEXT NOT NULL,
    reponse TEXT,
    formateur_id TEXT,
    date_question INTEGER NOT NULL,
    date_reponse INTEGER,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions_direct (
    id TEXT PRIMARY KEY,
    date INTEGER NOT NULL,
    duree_minutes INTEGER NOT NULL DEFAULT 0,
    sujet TEXT NOT NULL DEFAULT '',
    formateur_id TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions_direct_participants (
    id TEXT PRIMARY KEY,
    session_direct_id TEXT NOT NULL,
    apprenant_id TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attestations (
    id TEXT PRIMARY KEY,
    inscription_id TEXT NOT NULL,
    apprenant_id TEXT NOT NULL,
    formation_id TEXT NOT NULL,
    heures_reelles REAL NOT NULL DEFAULT 0,
    date_debut INTEGER NOT NULL,
    date_fin INTEGER NOT NULL,
    pdf_ref TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL
  );
`);

/* Migrations additives (idempotentes) : ajoute les colonnes manquantes aux
   tables existantes sans écraser les données. */
function addColumnIfMissing(table: string, column: string, ddl: string) {
  const cols = sqlite
    .prepare(`PRAGMA table_info(${table})`)
    .all() as Array<{ name: string }>;
  if (cols.some((c) => c.name === column)) return;
  try {
    sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  } catch (err) {
    // Colonne déjà ajoutée entre-temps (ex. workers de build parallèles) : on ignore.
    if (!String(err).includes("duplicate column name")) throw err;
  }
}

/* Sérialisé via une transaction IMMEDIATE : sous concurrence (workers de build
   parallèles), un seul process traverse la zone « lire les colonnes puis ALTER »
   à la fois — les autres attendent (busy_timeout) puis constatent que tout existe. */
const runMigrations = sqlite.transaction(() => {
  addColumnIfMissing("formations", "slug", "slug TEXT");
  addColumnIfMissing("formations", "objectifs_pedagogiques", "objectifs_pedagogiques TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing("formations", "duree_heures", "duree_heures REAL NOT NULL DEFAULT 0");
  addColumnIfMissing("formations", "methodes_pedagogiques", "methodes_pedagogiques TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing("formations", "modalites_evaluation", "modalites_evaluation TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing("formations", "modalites_accompagnement", "modalites_accompagnement TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing("formations", "prix_cents", "prix_cents INTEGER NOT NULL DEFAULT 0");
  addColumnIfMissing("modules", "duree_secondes", "duree_secondes INTEGER NOT NULL DEFAULT 0");
  addColumnIfMissing("modules", "video_ref", "video_ref TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing("modules", "contenu", "contenu TEXT NOT NULL DEFAULT ''");
});
runMigrations.immediate();

export const db = drizzle(sqlite, { schema });
export { schema };
