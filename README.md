# [Shift] Académie — Site web

Site premium de l'organisme de formation **[Shift] Académie**.
Stack : **Next.js 15 (App Router) · TypeScript · CSS Modules**.

## Démarrer

```bash
npm install
npm run dev      # développement (http://localhost:3000)
npm run build    # build de production
npm start        # serveur de production
```

## Architecture

```
app/                     Routes (App Router)
  layout.tsx             Layout global (header/footer, polices, SEO)
  page.tsx               Homepage
  globals.css            Design system (variables CSS, base, utilitaires)
  programme/             Page Programme
  financement/           Page Financement
  a-propos/              Page À Propos
  inscription/           Page d'inscription (formulaire de réservation)
  connexion/             Espace apprenant (à activer au jalon distanciel)
  mentions-legales/      Pages légales
  confidentialite/
  cgv/
  api/reservation/       Route API du formulaire (validation + anti-spam)
  sitemap.ts, robots.ts  SEO
components/
  layout/                Header, Footer, Logo
  ui/                    Composants réutilisables (Button, Badge, Reveal…)
  home/                  Sections de la homepage
lib/
  content.ts             ⭐ Contenu centralisé (textes, formations, FAQ…)
```

## Modifier le contenu

Presque tout le texte est centralisé dans **`lib/content.ts`** :
coordonnées, badges, formations, indicateurs, témoignages, FAQ, programme,
financement. Modifier ici met à jour l'ensemble du site.

## Identité visuelle

La palette est définie en variables CSS dans `app/globals.css` (`:root`).

La variable **`--accent`** est **sectorielle**. Pour changer de secteur, il
suffit de modifier ces deux variables :

```css
--accent: #E8610A;       /* BTP (actuel) */
--accent-deep: #c4500a;
```

Exemples : Commerce `#1A3A5C` · Agriculture `#1F8A5B` ·
Métiers de bouche `#7A1F1F` · Premium `#C9A84C`.

## Visuels à fournir

Déposer les fichiers dans `public/assets/` :

- **Photo du fondateur** → puis remplacer le bloc placeholder par un
  `<Image>` dans `components/home/Fondateur.tsx` et `app/a-propos/page.tsx`
  (emplacements signalés par un commentaire).
- Logo / favicon / image Open Graph (optionnel).

## À compléter (mentions légales)

Les pages légales contiennent des champs signalés en **orange**
(`[à compléter]`) : SIRET, numéro de déclaration d'activité, hébergeur,
médiateur, etc. À finaliser avec vos informations officielles.

## Formulaire de réservation

Le formulaire (`/inscription` et homepage) envoie vers `app/api/reservation`.
La validation et la protection anti-spam (honeypot) sont en place. **L'envoi
d'email / l'enregistrement en base reste à brancher** (jalon suivant) — voir
le `TODO` dans `app/api/reservation/route.ts`.

## Jalons suivants prévus

1. ~~Design system + structure + homepage~~ ✅
2. ~~Pages Programme / Financement / À Propos~~ ✅
3. ~~Formulaire de réservation + pages légales~~ ✅
4. Authentification + espace apprenant (distanciel)
5. Espace admin (CRUD formations, modules, vidéos, PDF, suivi)
6. Branchement email/base de données du formulaire
