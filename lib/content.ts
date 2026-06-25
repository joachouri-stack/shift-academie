/* ==========================================================================
   Contenu centralisé du site — source unique de vérité.
   Modifier le contenu ici ; les composants consomment ces données.
   Structure pensée pour évoluer (plusieurs formations, secteurs, etc.).
   ========================================================================== */

export const site = {
  name: "[Shift] Académie",
  shortName: "Shift",
  baseline: "La formation IA qui parle le langage du terrain.",
  description:
    "Organisme de formation certifié Qualiopi. Apprenez à utiliser l'IA pour créer, lancer et développer votre activité avec des outils simples et concrets.",
  url: "https://shift-academie.fr",
  email: "info@shift-academie.fr",
  phone: "+33 7 69 01 02 02",
  phoneDisplay: "+33 7 69 01 02 02",
  whatsapp: "https://wa.me/33769010202",
  city: "Avignon",
  founder: "Johane Achouri",
  responseTime: "Réponse sous 24h",
} as const;

export const nav = [
  { label: "Accueil", href: "/" },
  { label: "Financement", href: "/financement" },
  { label: "Programme", href: "/programme" },
  { label: "À Propos", href: "/a-propos" },
] as const;

/* --- Badges de confiance réutilisables --- */
export const badges = [
  "Qualiopi",
  "Constructys",
  "RS6776",
  "Présentiel",
  "Distanciel",
  "Accessibilité handicap",
] as const;

export const heroBadges = [
  "Qualiopi",
  "Constructys",
  "RS6776",
  "Présentiel et/ou distanciel",
  "Formation accessible",
  "Réponse sous 24h",
] as const;

/* --- Formations (tableau évolutif) --- */
export type Formation = {
  slug: string;
  titre: string;
  accroche: string;
  resume: string;
  formats: string[];
  duree: string;
  niveau: string;
  certification: string;
  disponible: boolean;
};

export const formations: Formation[] = [
  {
    slug: "creer-son-entreprise",
    titre: "Créer son entreprise",
    accroche: "De l'idée au lancement, avec l'IA comme copilote.",
    resume:
      "Structurez votre projet, choisissez le bon statut, montez votre offre et automatisez votre administratif grâce à des outils d'intelligence artificielle simples et concrets.",
    formats: ["Présentiel — Avignon", "Distanciel"],
    duree: "À définir selon la session",
    niveau: "Accessible aux débutants",
    certification: "Attestation de formation · RS6776",
    disponible: true,
  },
];

/* --- Indicateurs de qualité (Qualiopi) --- */
export const indicateurs = [
  { label: "Taux de satisfaction", value: null, suffix: "%" },
  { label: "Taux de réussite", value: null, suffix: "%" },
  { label: "Apprenants formés", value: null, suffix: "" },
  { label: "Taux de recommandation", value: null, suffix: "%" },
] as const;

export const indicateursPlaceholder =
  "Indicateurs disponibles après les premières sessions.";

/* --- Accessibilité & inclusion --- */
export const accessibilite = [
  {
    num: "01",
    titre: "Référent handicap dédié",
    texte:
      "Johane Achouri est votre interlocuteur unique. Un appel, une situation, une solution sur-mesure.",
  },
  {
    num: "02",
    titre: "Adaptations possibles",
    texte:
      "Supports en gros caractères, audio, sous-titres. Durée modulable. Lieu accessible PMR. Pauses adaptées.",
  },
  {
    num: "03",
    titre: "Réseau partenaire",
    texte:
      "Liens directs avec l'Agefiph, Cap Emploi et la MDPH pour mobiliser les financements et accompagnements adaptés.",
  },
  {
    num: "04",
    titre: "Étude au cas par cas",
    texte:
      "Aucune situation n'est traitée par défaut. Chaque besoin est étudié en amont pour proposer une solution réellement accessible.",
  },
] as const;

/* --- Fondateur --- */
export const fondateur = {
  nom: "Johane Achouri",
  role: "Fondateur · Formateur certifié RS6776",
  initiales: "JA",
  baseline: "La formation IA qui parle le langage du terrain.",
  texte:
    "J'ai créé [Shift] Académie parce que j'en avais assez de voir des professionnels talentueux perdre des heures sur de la paperasse, alors qu'ils pourraient être sur le chantier — ou avec leur famille.",
  expertises: [
    { label: "Expertise · 01", titre: "Spécialiste IA & automatisation" },
    { label: "Expertise · 02", titre: "Créateur de SaaS sans coder" },
    { label: "Certifications · 01", titre: "Qualiopi · Constructys agréé" },
    { label: "Certifications · 02", titre: "Formateur RS6776 officiel" },
  ],
  valeurs: ["Praticité", "Accessibilité", "Résultats", "Transparence"],
} as const;

/* --- Témoignages (sobres et crédibles) --- */
export const temoignages = [
  {
    nom: "Sophie M.",
    role: "Artisane peintre · Indépendante",
    texte:
      "Je passais mes dimanches sur mes devis. Aujourd'hui je les prépare en quelques minutes et je récupère mon temps. Concret, sans jargon.",
  },
  {
    nom: "Karim B.",
    role: "Plombier-chauffagiste · Gérant",
    texte:
      "Je voyais l'IA partout sans comprendre à quoi ça servait pour moi. Là, j'ai enfin des outils que j'utilise vraiment, tous les jours.",
  },
  {
    nom: "Thomas R.",
    role: "Commerçant · Épicerie fine",
    texte:
      "Mon administratif tournait en rond. La formation m'a permis d'automatiser le plus pénible et de me reconcentrer sur ma boutique.",
  },
] as const;

/* --- FAQ --- */
export const faq = [
  {
    q: "La formation est-elle finançable ?",
    a: "Oui, un financement est possible selon votre profil et votre situation. Nous vous accompagnons pour préparer un dossier clair, notamment via Constructys. La prise en charge dépend des critères de l'organisme financeur.",
  },
  {
    q: "Est-elle disponible en présentiel ?",
    a: "Oui, la formation est proposée en présentiel à Avignon, dans un cadre adapté à l'apprentissage.",
  },
  {
    q: "Est-elle disponible à distance ?",
    a: "Oui, la formation est également accessible en distanciel, avec un espace apprenant pour suivre votre progression à votre rythme.",
  },
  {
    q: "Faut-il déjà savoir utiliser l'IA ?",
    a: "Non. La formation part des bases et avance pas à pas, avec des outils simples et directement applicables à votre métier.",
  },
  {
    q: "Est-ce adapté aux débutants ?",
    a: "Absolument. Le contenu est pensé pour les professionnels de terrain, sans prérequis technique. On apprend en faisant.",
  },
  {
    q: "Peut-on être accompagné pour le dossier Constructys ?",
    a: "Oui. Nous vous aidons à monter votre dossier de financement de A à Z, pour que vous n'ayez pas à vous perdre dans la paperasse.",
  },
  {
    q: "Que se passe-t-il après l'inscription ?",
    a: "Nous vous rappelons sous 24h pour cadrer votre projet, valider le format et préparer le financement avec vous. Sans engagement.",
  },
  {
    q: "La formation est-elle accessible aux personnes en situation de handicap ?",
    a: "Oui. Un référent handicap dédié étudie chaque situation au cas par cas et met en place les adaptations nécessaires. Contactez-nous en amont.",
  },
] as const;

/* --- Programme de la formation « Créer son entreprise » --- */
export const programme = {
  titre: "Créer son entreprise",
  intro:
    "Un parcours complet pour passer de l'idée au lancement, en s'appuyant sur l'intelligence artificielle pour gagner du temps à chaque étape.",
  objectifs: [
    "Clarifier et structurer son projet d'entreprise.",
    "Choisir le statut juridique adapté à sa situation.",
    "Construire une offre claire et un positionnement solide.",
    "Utiliser des outils d'IA simples pour gagner du temps au quotidien.",
    "Automatiser les tâches administratives répétitives.",
    "Lancer son activité avec un plan d'action concret.",
  ],
  public:
    "Futurs créateurs d'entreprise, indépendants, artisans, commerçants et professionnels de terrain souhaitant lancer ou structurer leur activité.",
  prerequis:
    "Aucun prérequis technique. Savoir utiliser un ordinateur ou un smartphone suffit.",
  duree: "Durée précisée à chaque session (présentiel et/ou distanciel).",
  format:
    "Présentiel à Avignon et/ou distanciel via l'espace apprenant en ligne.",
  pedagogie: [
    "Apports pratiques et cas concrets issus du terrain.",
    "Exercices et mises en application directes.",
    "Modèles et outils prêts à l'emploi.",
    "Accompagnement individualisé.",
  ],
  evaluation: [
    "Évaluation des acquis tout au long de la formation.",
    "Quiz et mises en situation.",
    "Bilan de fin de parcours.",
  ],
  moyens:
    "Supports numériques, accès à l'espace apprenant en ligne, ressources téléchargeables, démonstrations d'outils IA.",
  accessibilite:
    "Formation accessible aux personnes en situation de handicap. Référent dédié et adaptations étudiées au cas par cas.",
  certification:
    "Attestation de formation délivrée en fin de parcours. Formation en lien avec la certification RS6776.",
  financement:
    "Financement possible selon votre profil (notamment Constructys). Accompagnement au montage du dossier.",
  modules: [
    {
      num: "01",
      titre: "Cadrer son projet",
      points: [
        "Transformer une idée en projet structuré",
        "Étudier son marché simplement",
        "Définir sa cible et sa proposition de valeur",
      ],
    },
    {
      num: "02",
      titre: "Choisir son statut",
      points: [
        "Comprendre les principaux statuts juridiques",
        "Choisir selon sa situation réelle",
        "Anticiper les obligations essentielles",
      ],
    },
    {
      num: "03",
      titre: "Construire son offre",
      points: [
        "Clarifier son offre et ses prix",
        "Se différencier sans se compliquer",
        "Préparer ses premiers supports",
      ],
    },
    {
      num: "04",
      titre: "L'IA au service du terrain",
      points: [
        "Découvrir les outils IA utiles à votre métier",
        "Rédiger devis, mails et contenus plus vite",
        "Gagner du temps sans compétence technique",
      ],
    },
    {
      num: "05",
      titre: "Automatiser l'administratif",
      points: [
        "Identifier les tâches répétitives",
        "Mettre en place des automatisations simples",
        "Organiser son suivi client",
      ],
    },
    {
      num: "06",
      titre: "Lancer son activité",
      points: [
        "Construire son plan d'action",
        "Trouver ses premiers clients",
        "Suivre et ajuster dans la durée",
      ],
    },
  ],
} as const;

/* --- Financement --- */
export const financement = {
  intro:
    "Le financement de votre formation peut être pris en charge selon votre profil. Nous vous accompagnons pour préparer un dossier clair, sans mauvaise surprise.",
  disclaimer:
    "La prise en charge dépend de votre situation, de votre entreprise et des critères de l'organisme financeur. Nous vous accompagnons pour préparer un dossier clair.",
  points: [
    {
      titre: "Constructys",
      texte:
        "Opérateur de compétences du BTP. Selon votre situation, une partie ou la totalité de votre formation peut être prise en charge.",
    },
    {
      titre: "Financement selon profil",
      texte:
        "Salarié, dirigeant, indépendant : les dispositifs varient. Nous identifions avec vous la voie la plus adaptée.",
    },
    {
      titre: "Accompagnement au montage du dossier",
      texte:
        "Nous préparons votre dossier de financement avec vous, étape par étape, pour vous éviter la paperasse.",
    },
    {
      titre: "Contact sous 24h, sans engagement",
      texte:
        "Vous nous contactez, on vous rappelle sous 24h pour faire le point. Aucune obligation à la clé.",
    },
  ],
} as const;
