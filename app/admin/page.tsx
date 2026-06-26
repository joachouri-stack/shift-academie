import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, leads, formations } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/app/connexion/actions";
import { createFormation, deleteFormation, toggleLead } from "./actions";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Espace admin",
  robots: { index: false, follow: false },
};

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export default async function AdminPage() {
  await requireAdmin();

  const allUsers = db.select().from(users).orderBy(desc(users.createdAt)).all();
  const allLeads = db.select().from(leads).orderBy(desc(leads.createdAt)).all();
  const allFormations = db
    .select()
    .from(formations)
    .orderBy(desc(formations.createdAt))
    .all();

  const learners = allUsers.filter((u) => u.role !== "admin");
  const pendingLeads = allLeads.filter((l) => !l.handled).length;

  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <p className={styles.eyebrow}>Espace admin</p>
            <h1 className={styles.title}>Tableau de bord</h1>
          </div>
          <form action={logoutAction}>
            <button type="submit" className={styles.logout}>
              Se déconnecter
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statVal}>{learners.length}</span>
            <span className={styles.statLabel}>Apprenants</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statVal}>{allLeads.length}</span>
            <span className={styles.statLabel}>Demandes reçues</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statVal}>{pendingLeads}</span>
            <span className={styles.statLabel}>À traiter</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statVal}>{allFormations.length}</span>
            <span className={styles.statLabel}>Formations</span>
          </div>
        </div>

        {/* Formations */}
        <div className={styles.block}>
          <h2 className={styles.h2}>Formations</h2>
          <form action={createFormation} className={styles.addRow}>
            <input
              name="title"
              placeholder="Titre de la nouvelle formation"
              required
              className={styles.input}
            />
            <button type="submit" className={styles.btnPrimary}>
              + Créer
            </button>
          </form>

          {allFormations.length === 0 ? (
            <p className={styles.empty}>Aucune formation pour l&rsquo;instant.</p>
          ) : (
            <ul className={styles.list}>
              {allFormations.map((f) => (
                <li key={f.id} className={styles.fItem}>
                  <div className={styles.fInfo}>
                    <span className={styles.fTitle}>{f.title}</span>
                    <span
                      className={`${styles.pill} ${
                        f.published ? styles.pillOn : styles.pillOff
                      }`}
                    >
                      {f.published ? "Publiée" : "Brouillon"}
                    </span>
                  </div>
                  <div className={styles.fActions}>
                    <Link href={`/admin/formations/${f.id}`} className={styles.btnGhost}>
                      Gérer
                    </Link>
                    <form action={deleteFormation}>
                      <input type="hidden" name="id" value={f.id} />
                      <button type="submit" className={styles.btnDanger}>
                        Supprimer
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Demandes de réservation */}
        <div className={styles.block}>
          <h2 className={styles.h2}>Demandes de réservation</h2>
          {allLeads.length === 0 ? (
            <p className={styles.empty}>Aucune demande pour l&rsquo;instant.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Contact</th>
                    <th>Métier</th>
                    <th>Format</th>
                    <th>Message</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {allLeads.map((l) => (
                    <tr key={l.id} className={l.handled ? styles.rowDone : ""}>
                      <td>{fmtDate(l.createdAt)}</td>
                      <td>
                        <strong>
                          {l.prenom} {l.nom}
                        </strong>
                        <br />
                        <a href={`mailto:${l.email}`}>{l.email}</a>
                        {l.telephone && (
                          <>
                            <br />
                            <a href={`tel:${l.telephone}`}>{l.telephone}</a>
                          </>
                        )}
                      </td>
                      <td>{l.metier || "—"}</td>
                      <td>
                        {l.format || "—"}
                        {l.periode && (
                          <>
                            <br />
                            <span className={styles.muted}>{l.periode}</span>
                          </>
                        )}
                      </td>
                      <td className={styles.msgCell}>{l.message || "—"}</td>
                      <td>
                        <form action={toggleLead}>
                          <input type="hidden" name="id" value={l.id} />
                          <input
                            type="hidden"
                            name="handled"
                            value={String(l.handled)}
                          />
                          <button
                            type="submit"
                            className={l.handled ? styles.btnGhost : styles.btnPrimary}
                          >
                            {l.handled ? "Rouvrir" : "Marquer traité"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Apprenants */}
        <div className={styles.block}>
          <h2 className={styles.h2}>Apprenants</h2>
          {learners.length === 0 ? (
            <p className={styles.empty}>Aucun apprenant inscrit pour l&rsquo;instant.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Inscrit le</th>
                    <th>Nom</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {learners.map((u) => (
                    <tr key={u.id}>
                      <td>{fmtDate(u.createdAt)}</td>
                      <td>
                        <strong>
                          {u.firstName} {u.lastName}
                        </strong>
                      </td>
                      <td>
                        <a href={`mailto:${u.email}`}>{u.email}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
