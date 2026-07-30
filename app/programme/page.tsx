import { redirect } from "next/navigation";

// L'ancienne page « Programme » est désormais la fiche formation.
export default function ProgrammeRedirect() {
  redirect("/formations/creer-son-entreprise");
}
