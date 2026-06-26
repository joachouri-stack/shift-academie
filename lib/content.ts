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

/* --- Programme de la formation « Créer son entreprise » --- */
export type ProgrammeModule = {
  num: string;
  titre: string;
  objectifs?: string[];
  contenu: string[];
  contenuTitre?: string;
  casPratiques?: string[];
  casPratiquesTitre?: string;
  outils?: string[];
};

export const programme = {
  titre: "Créer son entreprise",
  titreLong:
    "Créer, lancer et développer une activité indépendante grâce à l'intelligence artificielle",
  sousTitre: "De l'idée aux premiers clients.",
  intro:
    "Un parcours complet, de l'idée aux premiers clients, en s'appuyant sur l'intelligence artificielle pour gagner du temps à chaque étape. 14 heures, 100 % concrètes.",
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
    "Savoir utiliser un ordinateur.",
    "Disposer d'une adresse e-mail.",
    "Aucune compétence technique ou connaissance en IA n'est requise.",
  ],
  objectifs: [
    "Structurer un projet entrepreneurial solide.",
    "Définir son offre et son positionnement.",
    "Identifier son marché et ses clients.",
    "Utiliser efficacement l'IA pour gagner du temps.",
    "Produire rapidement des contenus professionnels.",
    "Créer ses premiers outils de communication.",
    "Développer sa visibilité en ligne.",
    "Trouver ses premiers clients.",
    "Construire un plan d'action concret pour lancer ou développer son activité.",
  ],
  jours: [
    {
      titre: "Structurer son projet",
      label: "Jour 1",
      duree: "7 heures",
      modules: [
        {
          num: "01",
          titre: "Définir son projet entrepreneurial",
          objectifs: [
            "Identifier ses compétences.",
            "Choisir une activité cohérente.",
            "Définir son client idéal.",
            "Construire une proposition de valeur claire.",
          ],
          contenu: [
            "Trouver une idée de projet rentable.",
            "Définir ses objectifs.",
            "Identifier ses forces.",
            "Déterminer son marché cible.",
            "Comprendre les besoins de ses futurs clients.",
          ],
          outils: ["ChatGPT", "Perplexity"],
        },
        {
          num: "02",
          titre: "Étudier son marché grâce à l'IA",
          objectifs: [
            "Réaliser une étude de marché.",
            "Identifier les concurrents.",
            "Trouver des opportunités.",
            "Déterminer son positionnement.",
          ],
          contenu: [
            "Étude de marché assistée par IA.",
            "Analyse concurrentielle.",
            "Recherche d'opportunités.",
            "Validation du projet.",
          ],
          outils: ["ChatGPT", "Google Trends", "Perplexity"],
        },
        {
          num: "03",
          titre: "Choisir son statut et organiser son activité",
          contenu: [
            "Les principaux statuts juridiques.",
            "Les obligations administratives.",
            "Les premières démarches.",
            "Les assurances.",
            "Les bases de la gestion d'entreprise.",
            "Organisation quotidienne.",
          ],
        },
        {
          num: "04",
          titre: "Construire son offre commerciale",
          contenu: [
            "Définir ses prestations.",
            "Construire une offre attractive.",
            "Déterminer ses tarifs.",
            "Préparer ses premiers devis.",
            "Structurer une proposition commerciale.",
          ],
          casPratiquesTitre: "Cas pratiques avec l'IA",
          casPratiques: [
            "Création de devis.",
            "Rédaction de propositions commerciales.",
            "Création d'emails professionnels.",
            "Création de courriers administratifs.",
          ],
          outils: ["ChatGPT"],
        },
        {
          num: "05",
          titre: "Créer son identité professionnelle",
          contenu: [
            "Choisir un nom commercial.",
            "Créer son identité visuelle.",
            "Concevoir un logo.",
            "Définir sa charte graphique.",
            "Préparer ses premiers supports de communication.",
          ],
          outils: ["Canva", "ChatGPT"],
        },
      ] as ProgrammeModule[],
    },
    {
      titre: "Développer son activité",
      label: "Jour 2",
      duree: "7 heures",
      modules: [
        {
          num: "06",
          titre: "Développer sa présence en ligne",
          contenu: [
            "Créer une fiche Google Business Profile.",
            "Comprendre les réseaux sociaux.",
            "Créer un site Internet.",
            "Découvrir WordPress.",
            "Optimiser sa visibilité locale.",
          ],
          outils: ["Google Business Profile", "Canva", "WordPress"],
        },
        {
          num: "07",
          titre: "Trouver ses premiers clients",
          contenu: [
            "Les méthodes de prospection.",
            "Le bouche-à-oreille.",
            "Les réseaux sociaux.",
            "Les partenariats.",
            "Les recommandations.",
            "Les avis clients.",
          ],
          casPratiquesTitre: "Applications avec l'IA",
          casPratiques: [
            "Création de publications.",
            "Réponses aux avis.",
            "Rédaction de messages commerciaux.",
            "Création de contenus.",
          ],
          outils: ["ChatGPT", "Canva"],
        },
        {
          num: "08",
          titre: "Automatiser son activité grâce à l'IA",
          contenuTitre: "Découverte des principaux outils d'IA",
          contenu: [
            "Découvrir et prendre en main les outils d'IA du quotidien.",
          ],
          casPratiquesTitre: "Cas pratiques",
          casPratiques: [
            "Générer des devis.",
            "Rédiger des emails.",
            "Rédiger des courriers.",
            "Générer des contenus.",
            "Créer des visuels.",
            "Automatiser des tâches répétitives.",
            "Organiser son activité plus efficacement.",
          ],
          outils: ["ChatGPT", "Perplexity", "Canva IA"],
        },
        {
          num: "09",
          titre: "Suivre son activité et mesurer ses résultats",
          contenu: [
            "Les indicateurs essentiels.",
            "Suivre ses performances.",
            "Comprendre Google Analytics.",
            "Découvrir Google Search Console.",
            "Organiser son suivi commercial.",
            "Construire un tableau de bord simple.",
          ],
          outils: ["Google Analytics", "Google Search Console"],
        },
        {
          num: "10",
          titre: "Construire son plan d'action",
          contenuTitre: "Chaque participant repart avec",
          contenu: [
            "Son plan d'action personnalisé à 30 jours.",
            "Ses prochaines étapes.",
            "Ses priorités.",
            "Les outils à mettre en place.",
            "Une feuille de route claire.",
            "Une méthode pour continuer à développer son activité.",
          ],
        },
      ] as ProgrammeModule[],
    },
  ],
  pedagogie: [
    "Apports théoriques.",
    "Démonstrations.",
    "Exercices pratiques.",
    "Études de cas.",
    "Travaux individuels.",
    "Échanges entre participants.",
    "Utilisation concrète d'outils d'intelligence artificielle.",
  ],
  moyens: [
    "Support de formation numérique.",
    "Présentation projetée.",
    "Exercices pratiques.",
    "Connexion Internet.",
    "Ordinateur (personnel ou fourni selon les modalités).",
    "ChatGPT, Perplexity, Canva.",
    "Google Business Profile, Google Trends.",
    "Google Analytics, Google Search Console.",
    "WordPress.",
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
    "Plan d'action personnalisé à 30 jours.",
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
