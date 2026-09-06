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
  updateModuleMedia,
  enrollLearner,
} from "../../actions";
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
            <button type="submit" className={styles.btnPrimary}>
              Enregistrer
            </button>
          </form>
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
                    </span>
                    <form action={deleteModule}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="formationId" value={formation.id} />
                      <button type="submit" className={styles.btnDanger}>
                        Supprimer
                      </button>
                    </form>
                  </div>
                  <form action={updateModuleMedia} className={styles.mediaForm}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="formationId" value={formation.id} />
                    <input
                      name="videoRef"
                      defaultValue={m.videoRef}
                      placeholder="URL de la vidéo (MP4 / HLS)"
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
                      Enregistrer
                    </button>
                  </form>
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
                  <Link
                    href={`/admin/assiduite/${ins.id}`}
                    className={styles.reportLink}
                  >
                    Rapport d&rsquo;assiduité →
                  </Link>
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
