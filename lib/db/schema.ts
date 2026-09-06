import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/* Comptes utilisateurs (apprenants et admin). */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  // "learner" | "admin"
  role: text("role").notNull().default("learner"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type User = typeof users.$inferSelect;

/* Formations en ligne (gérées par l'admin). */
export const formations = sqliteTable("formations", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  // "distanciel" | "presentiel" | "both"
  format: text("format").notNull().default("distanciel"),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  position: integer("position").notNull().default(0),
  // --- Programme pédagogique (dossier OPCO) ---
  slug: text("slug"),
  objectifsPedagogiques: text("objectifs_pedagogiques").notNull().default(""),
  dureeHeures: real("duree_heures").notNull().default(0),
  methodesPedagogiques: text("methodes_pedagogiques").notNull().default(""),
  modalitesEvaluation: text("modalites_evaluation").notNull().default(""),
  prixCents: integer("prix_cents").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Formation = typeof formations.$inferSelect;

/* Modules d'une formation. */
export const modules = sqliteTable("modules", {
  id: text("id").primaryKey(),
  formationId: text("formation_id").notNull(),
  title: text("title").notNull(),
  position: integer("position").notNull().default(0),
  // Durée RÉELLE du module en secondes (référence pour la validation d'assiduité).
  dureeSecondes: integer("duree_secondes").notNull().default(0),
  // Référence vidéo (URL ou id du fournisseur de streaming).
  videoRef: text("video_ref").notNull().default(""),
  contenu: text("contenu").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Module = typeof modules.$inferSelect;

/* Demandes issues du formulaire de réservation. */
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  prenom: text("prenom").notNull(),
  nom: text("nom").notNull(),
  metier: text("metier").notNull().default(""),
  nombre: text("nombre").notNull().default(""),
  email: text("email").notNull(),
  telephone: text("telephone").notNull().default(""),
  format: text("format").notNull().default(""),
  periode: text("periode").notNull().default(""),
  message: text("message").notNull().default(""),
  handled: integer("handled", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Lead = typeof leads.$inferSelect;

/* ==========================================================================
   Plateforme de formation e-learning (finançable OPCO)
   Principe : les tables de preuve sont APPEND-ONLY (insertion seule, jamais
   d'écrasement) — c'est la traçabilité qui sert en audit OPCO / Qualiopi.
   ========================================================================== */

/* Parcours d'un apprenant sur une formation. */
export const inscriptions = sqliteTable("inscriptions", {
  id: text("id").primaryKey(),
  apprenantId: text("apprenant_id").notNull(),
  formationId: text("formation_id").notNull(),
  dateDebut: integer("date_debut", { mode: "timestamp" }).notNull(),
  dateFin: integer("date_fin", { mode: "timestamp" }),
  // "en_cours" | "termine" | "abandonne"
  statut: text("statut").notNull().default("en_cours"),
  financeur: text("financeur").notNull().default(""),
  prixCents: integer("prix_cents").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
export type Inscription = typeof inscriptions.$inferSelect;

/* PREUVE BRUTE (append-only) : chaque battement de lecture reçu par le serveur. */
export const visionnageHeartbeats = sqliteTable("visionnage_heartbeats", {
  id: text("id").primaryKey(),
  inscriptionId: text("inscription_id").notNull(),
  moduleId: text("module_id").notNull(),
  apprenantId: text("apprenant_id").notNull(),
  positionS: integer("position_s").notNull().default(0),
  // secondes réellement créditées pour ce battement (0 si interruption détectée).
  deltaS: integer("delta_s").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
export type VisionnageHeartbeat = typeof visionnageHeartbeats.$inferSelect;

/* Sessions de visionnage agrégées (append-only), pour le rapport d'assiduité. */
export const sessionsVisionnage = sqliteTable("sessions_visionnage", {
  id: text("id").primaryKey(),
  inscriptionId: text("inscription_id").notNull(),
  moduleId: text("module_id").notNull(),
  apprenantId: text("apprenant_id").notNull(),
  timestampDebut: integer("timestamp_debut", { mode: "timestamp" }).notNull(),
  timestampFin: integer("timestamp_fin", { mode: "timestamp" }),
  dureeEffectiveSecondes: integer("duree_effective_secondes").notNull().default(0),
  pourcentageComplete: integer("pourcentage_complete").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
export type SessionVisionnage = typeof sessionsVisionnage.$inferSelect;

/* État courant par (inscription, module) — cache recalculable depuis les logs. */
export const progression = sqliteTable("progression", {
  id: text("id").primaryKey(),
  inscriptionId: text("inscription_id").notNull(),
  moduleId: text("module_id").notNull(),
  apprenantId: text("apprenant_id").notNull(),
  dureeEffectiveCumulee: integer("duree_effective_cumulee").notNull().default(0),
  maxPositionS: integer("max_position_s").notNull().default(0),
  valide: integer("valide", { mode: "boolean" }).notNull().default(false),
  dateValidation: integer("date_validation", { mode: "timestamp" }),
  lastHeartbeatAt: integer("last_heartbeat_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
export type Progression = typeof progression.$inferSelect;

/* Tutorat asynchrone (question apprenant / réponse formateur, horodaté). */
export const questionsTutorat = sqliteTable("questions_tutorat", {
  id: text("id").primaryKey(),
  inscriptionId: text("inscription_id").notNull(),
  apprenantId: text("apprenant_id").notNull(),
  moduleId: text("module_id"),
  question: text("question").notNull(),
  reponse: text("reponse"),
  formateurId: text("formateur_id"),
  dateQuestion: integer("date_question", { mode: "timestamp" }).notNull(),
  dateReponse: integer("date_reponse", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
export type QuestionTutorat = typeof questionsTutorat.$inferSelect;

/* Sessions live (visio de questions/réponses groupées) — preuve d'accompagnement synchrone. */
export const sessionsDirect = sqliteTable("sessions_direct", {
  id: text("id").primaryKey(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  dureeMinutes: integer("duree_minutes").notNull().default(0),
  sujet: text("sujet").notNull().default(""),
  formateurId: text("formateur_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
export type SessionDirect = typeof sessionsDirect.$inferSelect;

/* Présence à une session live (append-only). */
export const sessionsDirectParticipants = sqliteTable(
  "sessions_direct_participants",
  {
    id: text("id").primaryKey(),
    sessionDirectId: text("session_direct_id").notNull(),
    apprenantId: text("apprenant_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  }
);
export type SessionDirectParticipant =
  typeof sessionsDirectParticipants.$inferSelect;

/* Attestations générées (append-only) — heures RÉELLES issues du visionnage. */
export const attestations = sqliteTable("attestations", {
  id: text("id").primaryKey(),
  inscriptionId: text("inscription_id").notNull(),
  apprenantId: text("apprenant_id").notNull(),
  formationId: text("formation_id").notNull(),
  heuresReelles: real("heures_reelles").notNull().default(0),
  dateDebut: integer("date_debut", { mode: "timestamp" }).notNull(),
  dateFin: integer("date_fin", { mode: "timestamp" }).notNull(),
  pdfRef: text("pdf_ref").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
export type Attestation = typeof attestations.$inferSelect;
