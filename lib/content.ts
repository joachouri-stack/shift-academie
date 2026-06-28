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
  city: "Orange",
  founder: "Johane Achouri",
  responseTime: "Réponse sous 24h",
  // Informations juridiques
  siret: "490 415 031 00122",
  naf: "8559A",
  nafLabel: "Formation continue d'adultes",
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
    formats: ["Présentiel — Orange", "Distanciel"],
    duree: "14 heures (2 jours)",
    niveau: "Accessible aux débutants",
    certification: "Attestation de fin de formation",
    disponible: true,
  },
];

/* --- Prochaine session (modifiable à chaque session) --- */
export const prochaineSession = {
  /** Mettre à false pour afficher « Prochaine date à venir » au lieu des dates. */
  disponible: true,
  /** Ex. "Du 5 au 7 novembre 2026" */
  dates: "Du 5 au 7 novembre 2026",
  lieu: "Orange",
};

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
    nom: "Cherryne T.",
    role: "Artisane peintre · Indépendante",
    photo: "/assets/temoignage-sophie.jpg",
    texte:
      "Je passais mes dimanches sur mes devis. Aujourd'hui je les prépare en quelques minutes et je récupère mon temps. Concret, sans jargon.",
  },
  {
    nom: "Karim B.",
    role: "Plombier-chauffagiste · Gérant",
    photo: "/assets/temoignage-karim.jpg",
    texte:
      "Je voyais l'IA partout sans comprendre à quoi ça servait pour moi. Là, j'ai enfin des outils que j'utilise vraiment, tous les jours.",
  },
  {
    nom: "Thomas R.",
    role: "Commerçant · Épicerie fine",
    photo: "/assets/temoignage-thomas.jpg",
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
    a: "Oui, la formation est proposée en présentiel à Orange, dans un cadre adapté à l'apprentissage.",
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

/* --- Programme officiel de la formation --- */
export type ProgrammeSection = { titre: string; points: string[] };

export type ProgrammeModule = {
  num: string;
  titre: string;
  horaire?: string;
  duree?: string;
  sections: ProgrammeSection[];
};

export const programme = {
  titre: "Maîtriser les fondamentaux de la création d'entreprise",
  sousTitre: "De l'idée à la pérennisation de votre activité.",
  intro:
    "Une formation complète pour maîtriser toutes les étapes de la création d'entreprise : principes fondamentaux, cadre juridique et fiscal, bases économiques et financières, puis leviers de développement et de pérennisation. 14 heures réparties sur 2 jours.",
  duree: "14 heures (2 jours)",
  format: "Présentiel et/ou distanciel",
  public: [
    "Porteurs de projet",
    "Créateurs d'entreprise",
    "Artisans",
    "Commerçants",
    "Prestataires de services",
    "Professions libérales",
    "Demandeurs d'emploi",
    "Salariés en reconversion",
  ],
  prerequis: [
    "Aucun prérequis particulier.",
    "Savoir utiliser un ordinateur et disposer d'une adresse e-mail.",
    "Avoir un projet ou l'envie de créer son entreprise.",
  ],
  objectifs: [
    "Comprendre les principes fondamentaux et l'environnement de la création d'entreprise.",
    "Identifier les étapes clés et les facteurs de réussite d'un projet entrepreneurial.",
    "Comparer les formes juridiques et choisir un statut adapté à son projet.",
    "Comprendre les régimes fiscaux, sociaux et les formalités administratives.",
    "Maîtriser les bases économiques et financières d'un projet (modèle économique, indicateurs, financement).",
    "Appréhender les leviers commerciaux, de communication et de pérennisation de l'entreprise.",
  ],
  jours: [
    {
      label: "Jour 1",
      titre: "Principes fondamentaux & cadre juridique",
      duree: "7 heures",
      modules: [
        {
          num: "01",
          titre:
            "Comprendre les principes fondamentaux de la création d'entreprise",
          horaire: "9h – 12h",
          duree: "3 heures",
          sections: [
            {
              titre: "Découvrir l'entrepreneuriat et son environnement",
              points: [
                "Définition de l'entrepreneuriat et de la création d'entreprise",
                "Rôle de l'entrepreneur dans l'économie",
                "Les différents types de projets entrepreneuriaux",
                "Les motivations et qualités entrepreneuriales",
              ],
            },
            {
              titre:
                "Identifier les étapes clés d'un projet de création d'entreprise",
              points: [
                "De l'idée à la création de l'activité",
                "Les principales phases d'un projet entrepreneurial",
                "Les acteurs de l'accompagnement à la création d'entreprise",
                "Les ressources mobilisables pour développer son projet",
              ],
            },
            {
              titre: "Analyser les facteurs de réussite d'un projet entrepreneurial",
              points: [
                "Adéquation entre le porteur de projet et son activité",
                "Importance de l'étude du marché",
                "Positionnement et proposition de valeur",
                "Anticipation des risques liés au démarrage",
              ],
            },
          ],
        },
        {
          num: "02",
          titre:
            "Identifier les cadres juridiques, fiscaux et administratifs de l'entreprise",
          horaire: "13h – 17h",
          duree: "4 heures",
          sections: [
            {
              titre: "Comparer les différentes formes juridiques d'entreprise",
              points: [
                "Entreprise individuelle",
                "Micro-entreprise",
                "EURL et SARL",
                "SASU et SAS",
                "Critères de choix d'un statut juridique",
              ],
            },
            {
              titre: "Comprendre les régimes fiscaux et sociaux du dirigeant",
              points: [
                "Impôt sur le revenu et impôt sur les sociétés",
                "Fonctionnement de la TVA",
                "Cotisations sociales du dirigeant",
                "Protection sociale et couverture du chef d'entreprise",
              ],
            },
            {
              titre:
                "Identifier les formalités administratives liées à la création d'entreprise",
              points: [
                "Immatriculation de l'entreprise",
                "Déclarations obligatoires",
                "Obligations réglementaires de démarrage",
                "Documents administratifs indispensables à l'activité",
              ],
            },
          ],
        },
      ] as ProgrammeModule[],
    },
    {
      label: "Jour 2",
      titre: "Économie, finances & pérennisation",
      duree: "7 heures",
      modules: [
        {
          num: "03",
          titre:
            "Comprendre les bases économiques et financières d'un projet entrepreneurial",
          horaire: "9h – 12h",
          duree: "3 heures",
          sections: [
            {
              titre: "Découvrir les composantes d'un modèle économique",
              points: [
                "Définition du modèle économique",
                "Création et proposition de valeur",
                "Sources de revenus de l'entreprise",
                "Structure des coûts et dépenses",
              ],
            },
            {
              titre: "Analyser les principaux indicateurs financiers",
              points: [
                "Chiffre d'affaires",
                "Charges fixes et charges variables",
                "Résultat et rentabilité",
                "Seuil de rentabilité et point mort",
              ],
            },
            {
              titre: "Identifier les solutions de financement d'une entreprise",
              points: [
                "Apports personnels",
                "Emprunts bancaires",
                "Aides publiques à la création d'entreprise",
                "Dispositifs d'accompagnement et de financement",
              ],
            },
          ],
        },
        {
          num: "04",
          titre:
            "Appréhender les leviers de développement et de pérennisation de l'entreprise",
          horaire: "13h – 17h",
          duree: "4 heures",
          sections: [
            {
              titre: "Comprendre les fondamentaux de la stratégie commerciale",
              points: [
                "Définition des objectifs commerciaux",
                "Identification de la clientèle cible",
                "Politique tarifaire",
                "Développement de la relation client",
              ],
            },
            {
              titre: "Identifier les outils de communication et de visibilité",
              points: [
                "Construction de l'identité de l'entreprise",
                "Communication digitale et traditionnelle",
                "Présence sur les réseaux sociaux",
                "Notions de marketing appliquées aux petites entreprises",
              ],
            },
            {
              titre: "Analyser les risques et les facteurs de pérennité de l'entreprise",
              points: [
                "Risques financiers, juridiques et opérationnels",
                "Importance du suivi de l'activité",
                "Outils de pilotage et indicateurs de performance",
                "Principes d'amélioration continue et de développement de l'entreprise",
              ],
            },
          ],
        },
      ] as ProgrammeModule[],
    },
  ],
  pedagogie: [
    "Apports théoriques structurés.",
    "Exemples concrets et études de cas.",
    "Exercices pratiques et mises en situation.",
    "Travaux individuels.",
    "Échanges entre participants.",
  ],
  moyens: [
    "Support de formation numérique.",
    "Présentation projetée.",
    "Exercices et modèles pratiques.",
    "Connexion Internet.",
    "Ordinateur (personnel ou fourni selon les modalités).",
  ],
  evaluation: [
    "Questionnaire de positionnement en début de formation.",
    "Exercices pratiques tout au long de la formation.",
    "Études de cas.",
    "Quiz final.",
    "Questionnaire de satisfaction en fin de formation.",
  ],
  suivi: [
    "Feuille d'émargement.",
    "Attestation d'assiduité.",
    "Suivi pédagogique pendant toute la formation.",
  ],
  documents: [
    "Support pédagogique numérique.",
    "Attestation de fin de formation.",
    "Ressources et modèles utilisés pendant la formation.",
  ],
  validation:
    "À l'issue de la formation, une attestation de fin de formation est remise à chaque participant ayant suivi l'intégralité du parcours.",
  accessibilite:
    "La formation est accessible aux personnes en situation de handicap. Les modalités d'accueil et d'accompagnement sont étudiées au cas par cas afin de proposer les adaptations nécessaires.",
  certification:
    "Attestation de fin de formation remise à chaque participant ayant suivi l'intégralité du parcours.",
  financement:
    "Financement possible selon votre profil (notamment Constructys). Accompagnement au montage du dossier.",
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
