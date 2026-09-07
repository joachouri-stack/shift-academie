import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { formations, modules, inscriptions, users } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import {
  updateFormation,
  deleteFormation,
  addModule,
  deleteModule,
  updateModule,
  updateModuleMedia,
  deleteModuleVideo,
  enrollLearner,
} from "../../actions";
import VideoUpload from "@/components/learn/VideoUpload";
import styles from "../../admin.module.css";

export const metadata: Metadata = {
  title: "Gérer une formation",
  robots: { index: false, follow: false },
};

export default async function FormationAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const formation = db
    .select()
    .from(formations)
    .where(eq(formations.id, id))
    .get();
  if (!formation) notFound();

  const mods = db
    .select()
    .from(modules)
    .where(eq(modules.formationId, id))
    .orderBy(asc(modules.position))
    .all();

  const inscrits = db
    .select({
      id: inscriptions.id,
      statut: inscriptions.statut,
      dateDebut: inscriptions.dateDebut,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(inscriptions)
    .innerJoin(users, eq(users.id, inscriptions.apprenantId))
    .where(eq(inscriptions.formationId, id))
    .all();

  function fmtDuree(sec: number) {
    if (!sec) return "";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} min ${s.toString().padStart(2, "0")}`;
  }

  return (
    <section className={styles.wrap}>
      <div className="container container-narrow">
        <Link href="/admin" className={styles.back}>
          ← Retour au tableau de bord
        </Link>
        <h1 className={styles.title}>Gérer la formation</h1>

        {/* Détails */}
        <div className={styles.block}>
          <h2 className={styles.h2}>Détails</h2>
          <form action={updateFormation} className={styles.editForm}>
            <input type="hidden" name="id" value={formation.id} />
            <label className={styles.lbl}>
              Titre
              <input
                name="title"
                defaultValue={formation.title}
                required
                className={styles.input}
              />
            </label>
            <label className={styles.lbl}>
              Description
              <textarea
                name="description"
                defaultValue={formation.description}
                rows={4}
                className={styles.input}
              />
            </label>
            <div className={styles.editRow}>
              <label className={styles.lbl}>
                Format
                <select
                  name="format"
                  defaultValue={formation.format}
                  className={styles.input}
                >
                  <option value="distanciel">Distanciel</option>
                  <option value="presentiel">Présentiel</option>
                  <option value="both">Présentiel &amp; distanciel</option>
                </select>
              </label>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={formation.published}
                />
                Publiée (visible par les apprenants)
              </label>
            </div>

            <label className={styles.lbl}>
              Objectifs pédagogiques (un par ligne)
              <textarea
                name="objectifsPedagogiques"
                defaultValue={formation.objectifsPedagogiques}
                rows={5}
                placeholder={"Comparer les statuts juridiques\nÉtablir un budget prévisionnel\n…"}
                className={styles.input}
              />
            </label>
            <div className={styles.editRow}>
              <label className={styles.lbl}>
                Durée (heures)
                <input
                  name="dureeHeures"
                  type="number"
                  step="0.5"
                  min={0}
                  defaultValue={formation.dureeHeures || ""}
                  className={styles.input}
                />
              </label>
              <label className={styles.lbl}>
                Prix (€ HT)
                <input
                  name="prixEuros"
                  type="number"
                  step="1"
                  min={0}
                  defaultValue={formation.prixCents ? formation.prixCents / 100 : ""}
                  className={styles.input}
                />
              </label>
            </div>
            <label className={styles.lbl}>
              Méthodes pédagogiques
              <textarea
                name="methodesPedagogiques"
                defaultValue={formation.methodesPedagogiques}
                rows={3}
                className={styles.input}
              />
            </label>
            <label className={styles.lbl}>
              Modalités d&rsquo;évaluation
              <textarea
                name="modalitesEvaluation"
                defaultValue={formation.modalitesEvaluation}
                rows={3}
                className={styles.input}
              />
            </label>
            <label className={styles.lbl}>
              Modalités d&rsquo;accompagnement (pour le dossier OPCO)
              <textarea
                name="modalitesAccompagnement"
                defaultValue={formation.modalitesAccompagnement}
                rows={3}
                placeholder="Ex. Tutorat asynchrone illimité (réponse sous 48 h) · 1 session live collective de Q&R par semaine · suivi individualisé de la progression."
                className={styles.input}
              />
            </label>

            <button type="submit" className={styles.btnPrimary}>
              Enregistrer
            </button>
          </form>
          <div className={styles.navRow}>
            <Link href={`/admin/programme/${formation.id}`} className={styles.reportLink}>
              Programme (PDF) →
            </Link>
            <Link href={`/admin/dossier/${formation.id}`} className={styles.reportLink}>
              Dossier OPCO complet (PDF) →
            </Link>
          </div>
        </div>

        {/* Modules */}
        <div className={styles.block}>
          <h2 className={styles.h2}>Modules</h2>
          <form action={addModule} className={styles.addRow}>
            <input type="hidden" name="formationId" value={formation.id} />
            <input
              name="title"
              placeholder="Titre du module"
              required
              className={styles.input}
            />
            <button type="submit" className={styles.btnPrimary}>
              + Ajouter
            </button>
          </form>

          {mods.length === 0 ? (
            <p className={styles.empty}>Aucun module pour l&rsquo;instant.</p>
          ) : (
            <ul className={styles.list}>
              {mods.map((m, i) => (
                <li key={m.id} className={styles.modCard}>
                  <div className={styles.fItem}>
                    <span className={styles.fTitle}>
                      <span className={styles.modNum}>{i + 1}.</span> {m.title}
                      {m.dureeSecondes > 0 && (
                        <span className={styles.modMeta}>
                          {" "}
                          · {fmtDuree(m.dureeSecondes)}
                        </span>
                      )}
                      {m.videoRef ? (
                        <span className={styles.modBadgeOk}>● vidéo en ligne</span>
                      ) : (
                        <span className={styles.modBadgeNo}>○ aucune vidéo</span>
                      )}
                    </span>
                    <form action={deleteModule}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="formationId" value={formation.id} />
                      <button type="submit" className={styles.btnDanger}>
                        Supprimer le module
                      </button>
                    </form>
                  </div>

                  {/* Titre + descriptif du module */}
                  <form action={updateModule} className={styles.mediaForm}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="formationId" value={formation.id} />
                    <label className={styles.lbl}>
                      Titre du module
                      <input
                        name="title"
                        defaultValue={m.title}
                        required
                        className={styles.input}
                      />
                    </label>
                    <label className={styles.lbl}>
                      Descriptif (ce que l&rsquo;apprenant voit sous la vidéo)
                      <textarea
                        name="contenu"
                        defaultValue={m.contenu}
                        rows={3}
                        placeholder="Résumé du module, points clés abordés…"
                        className={styles.input}
                      />
                    </label>
                    <button type="submit" className={styles.btnPrimary}>
                      Enregistrer le titre et le descriptif
                    </button>
                  </form>

                  {/* Vidéo */}
                  <VideoUpload moduleId={m.id} formationId={formation.id} />
                  <form action={updateModuleMedia} className={styles.mediaForm}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="formationId" value={formation.id} />
                    <input
                      name="videoRef"
                      defaultValue={m.videoRef}
                      placeholder="URL de la vidéo (MP4 / HLS) ou /api/media/…"
                      className={styles.input}
                    />
                    <input
                      name="dureeSecondes"
                      type="number"
                      min={0}
                      defaultValue={m.dureeSecondes || ""}
                      placeholder="Durée réelle (secondes)"
                      className={styles.input}
                    />
                    <button type="submit" className={styles.btnPrimary}>
                      Enregistrer la vidéo
                    </button>
                  </form>
                  {m.videoRef && (
                    <form action={deleteModuleVideo}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="formationId" value={formation.id} />
                      <button type="submit" className={styles.btnDangerSoft}>
                        Supprimer la vidéo de ce module
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className={styles.hintNote}>
            La « durée réelle » (en secondes) sert de référence pour valider
            l&rsquo;assiduité (module validé à 90 % du temps réellement visionné).
          </p>
        </div>

        {/* Apprenants inscrits */}
        <div className={styles.block}>
          <h2 className={styles.h2}>Apprenants inscrits</h2>
          <form action={enrollLearner} className={styles.addRow}>
            <input type="hidden" name="formationId" value={formation.id} />
            <input
              name="email"
              type="email"
              placeholder="email@apprenant.fr (compte déjà créé)"
              required
              className={styles.input}
            />
            <button type="submit" className={styles.btnPrimary}>
              + Inscrire
            </button>
          </form>

          {inscrits.length === 0 ? (
            <p className={styles.empty}>Aucun apprenant inscrit.</p>
          ) : (
            <ul className={styles.list}>
              {inscrits.map((ins) => (
                <li key={ins.id} className={styles.fItem}>
                  <span className={styles.fTitle}>
                    {ins.firstName} {ins.lastName}
                    <span className={styles.modMeta}> · {ins.email}</span>
                  </span>
                  <div className={styles.fActions}>
                    {ins.statut === "termine" && (
                      <Link
                        href={`/espace/attestation/${ins.id}`}
                        className={styles.reportLink}
                      >
                        Attestation →
                      </Link>
                    )}
                    <Link
                      href={`/admin/assiduite/${ins.id}`}
                      className={styles.reportLink}
                    >
                      Rapport d&rsquo;assiduité →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className={styles.hintNote}>
            L&rsquo;apprenant doit d&rsquo;abord avoir créé son compte via
            « Se connecter » pour pouvoir être inscrit.
          </p>
        </div>

        {/* Suppression */}
        <div className={styles.block}>
          <h2 className={styles.h2}>Zone sensible</h2>
          <form action={deleteFormation}>
            <input type="hidden" name="id" value={formation.id} />
            <button type="submit" className={styles.btnDanger}>
              Supprimer définitivement cette formation
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
