import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { formations, modules } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import {
  updateFormation,
  deleteFormation,
  addModule,
  deleteModule,
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
                <li key={m.id} className={styles.fItem}>
                  <span className={styles.fTitle}>
                    <span className={styles.modNum}>{i + 1}.</span> {m.title}
                  </span>
                  <form action={deleteModule}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="formationId" value={formation.id} />
                    <button type="submit" className={styles.btnDanger}>
                      Supprimer
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <p className={styles.hintNote}>
            Les vidéos et documents PDF par module arriveront au prochain
            incrément.
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
