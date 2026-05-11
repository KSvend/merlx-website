/**
 * Multi-locale copy for the group home page. Keyed by locale; consumed
 * by GroupHome.tsx via copyForLocale(locale). EN is authoritative; AR
 * and FR are draft translations and benefit from native review before
 * client circulation.
 */

import type { Locale } from './shared';

interface AudienceCard {
  preheader: string;
  brand: string;
  brandSuffix: string;
  subtitle: string;
  body: string;
  bullets: string[];
  primaryCta: string;
  secondaryCta: string;
}

interface CaseStudyCard {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
}

interface RegionCard {
  label: string;
  title: string;
  detail: string;
}

interface PrincipleCard {
  n: string;
  title: string;
  body: string;
}

interface FinalCtaCopy {
  eyebrow: string;
  headlinePrefix: string;
  headlineEm: string;
  body: string;
  primary: string;
  secondary: string;
}

export interface HomeCopy {
  hero: {
    eyebrow: string;
    headlineEm: string;
    headlineRest: string;
    body: string;
  };
  audiences: {
    sectionTitle?: string;
    cards: [AudienceCard, AudienceCard];
  };
  dashboardPreview: {
    eyebrow: string;
    headlinePrefix: string;
    headlineEm: string;
    body: string;
  };
  caseStudies: {
    eyebrow: string;
    headlinePrefix: string;
    headlineEm: string;
    headlineSuffix: string;
    lead: string;
    cards: [CaseStudyCard, CaseStudyCard];
  };
  whereWeOperate: {
    eyebrow: string;
    headlinePrefix: string;
    headlineEm: string;
    lead: string;
    regions: [RegionCard, RegionCard, RegionCard];
    languagesLabel: string;
    languages: string[];
  };
  principles: {
    eyebrow: string;
    headlinePrefix: string;
    headlineEm: string;
    lead: string;
    items: [PrincipleCard, PrincipleCard, PrincipleCard, PrincipleCard];
  };
  partners: {
    label: string;
    items: string[];
  };
  finalCta: FinalCtaCopy;
}

const en: HomeCopy = {
  hero: {
    eyebrow: 'Evidence infrastructure for adaptive programming',
    headlineEm: 'Next-generation MERL',
    headlineRest: 'for global development and humanitarian aid programmes.',
    body: 'MERLx delivers advanced data science and tech-enabled MERL for global development and humanitarian aid programmes. AI-augmented analytical tools, locally anchored research and conflict-sensitive methodology, built for donors, multilaterals, INGOs and implementers — faster context reads, earlier course corrections, decisions grounded in real evidence rather than headquarters narrative.',
  },
  audiences: {
    cards: [
      {
        preheader: '01 · FOR DONORS, MULTILATERALS & INGOs',
        brand: 'MERLx',
        brandSuffix: 'Studio',
        subtitle: 'Scope, instrument, evaluate.',
        body: 'MERLx delivers AI-augmented MERL infrastructure for international development and humanitarian programmes. From scoping to live dashboards to formal evaluation — built for accountability, conflict-sensitivity and compound-risk realities.',
        bullets: [
          'AI-augmented analytical infrastructure (Optics Suite)',
          'Conflict-sensitive MERL design, delivery, and evaluation',
          'Live dashboards: indicators, compound risk, narrative monitoring',
          'Auditable outputs — features and signals, not black boxes',
        ],
        primaryCta: 'Start a conversation →',
        secondaryCta: 'Browse deployments',
      },
      {
        preheader: '02 · FOR MERL PRACTITIONERS & FIELD TEAMS',
        brand: 'MERLx',
        brandSuffix: 'Network',
        subtitle: 'Shared methodology, shared tools.',
        body: 'MERLx works alongside in-country MERL teams, researchers and enumerators. Use the Optics Suite as shared analytical infrastructure, train on conflict-sensitivity standards, and join a peer-review practice that holds a methodological floor across engagements.',
        bullets: [
          'Optics Suite as shared analytical tooling',
          'Conflict-sensitivity training and methodological standards',
          'Peer review across active engagements',
          'Routes to ongoing partnership for established teams',
        ],
        primaryCta: 'Become a partner →',
        secondaryCta: 'Talk to us',
      },
    ],
  },
  dashboardPreview: {
    eyebrow: 'What it looks like in practice',
    headlinePrefix: 'A live MERL dashboard,',
    headlineEm: 'built for the programme team',
    body: 'INGO programme teams log into MERLx and see compound risk for their portfolio, real-time indicator trends, narrative shifts, and forecast confidence — auditable down to the underlying signal. No black-box outputs.',
  },
  caseStudies: {
    eyebrow: 'Case studies',
    headlinePrefix: 'Deployed across',
    headlineEm: 'active conflict and fragile-state contexts',
    headlineSuffix: '.',
    lead: 'Real engagements where MERLx infrastructure runs on the ground, with locally anchored partners.',
    cards: [
      {
        eyebrow: 'ACTIVE · NILEX · SUDAN',
        title: 'Conflict-sensitive MERL across an active conflict',
        body: 'NileX deploys IRIS, PRISM and conflict-sensitive evaluation across Sudan and the wider Nile basin. Bilingual reporting in Arabic and English. KII research with on-device transcription. Programme teams receive weekly compound-risk briefs.',
        cta: 'Read case study →',
      },
      {
        eyebrow: 'LIVE · PRISM · HORN OF AFRICA',
        title: 'Four-month forecast for food insecurity and displacement',
        body: 'PRISM ingests EO data, conflict events and price signals to forecast compound risk across IPC phase 3+ populations. Programme teams use the dashboard for adaptive resource allocation across the Horn of Africa.',
        cta: 'Read case study →',
      },
    ],
  },
  whereWeOperate: {
    eyebrow: 'Where we operate',
    headlinePrefix: 'Working languages and live regions,',
    headlineEm: 'not aspirations',
    lead: 'Engagements include handover and national-staff training. New languages and regions are added as engagements require them.',
    regions: [
      {
        label: 'Primary',
        title: 'Sudan & the Horn of Africa',
        detail:
          'Sudan, Somalia, Ethiopia, Kenya. Live deployments, dedicated in-country teams, and an established conflict-sensitivity track record.',
      },
      {
        label: 'Active',
        title: 'South Asia',
        detail:
          'Engagements in Pakistan, Bangladesh and the wider region. The same analytical stack, the same standards.',
      },
      {
        label: 'Portable',
        title: 'Anywhere with reasonable open-data coverage',
        detail:
          'The architecture is portable. Every engagement includes handover and national-staff training so tools can be run by client teams.',
      },
    ],
    languagesLabel: 'NLP classifiers and working languages',
    languages: [
      'Arabic',
      'Somali',
      'English',
      'French',
      'Spanish',
      'Swahili',
      'Amharic',
      'Oromo',
      'Tigrinya',
      'Kinyarwanda',
      'Nigerian Pidgin',
    ],
  },
  principles: {
    eyebrow: 'How we work',
    headlinePrefix: 'Four commitments,',
    headlineEm: 'held on every engagement',
    lead: 'These describe the floor we will not drop below — methodology, conflict-sensitivity, data responsibility, and how we handle the tools.',
    items: [
      {
        n: '01',
        title: 'Field first, not lab first.',
        body: 'Our tools have to work for programme teams in low-bandwidth environments with limited infrastructure, not just at a conference demo.',
      },
      {
        n: '02',
        title: 'Evidence over abstraction.',
        body: 'Analytical outputs are auditable. We can show the features behind a classification, the indicators behind a narrative, the inputs behind a forecast. No black-box outputs.',
      },
      {
        n: '03',
        title: 'Open and interoperable.',
        body: 'Open data standards, open satellite archives, open-source models, standard APIs. Clients own their data and their instance.',
      },
      {
        n: '04',
        title: 'Responsible by default.',
        body: 'Data-protection impact assessment per engagement. IASC data-responsibility guidance, do-no-harm and informed-consent protocols documented. On-device processing wherever viable. Data residency set by the client.',
      },
    ],
  },
  partners: {
    label: 'We have worked with',
    items: ['UNDP', 'UNICEF', 'WFP', 'UN OCHA', 'GIZ', 'FCDO', 'USAID', 'World Bank'],
  },
  finalCta: {
    eyebrow: 'Working with MERLx',
    headlinePrefix: 'Bring us in',
    headlineEm: 'early',
    body: 'A pilot, a hosted Optics Suite deployment, an evaluation, or short advisory work — send us a brief and we will route it to the right team within two working days.',
    primary: 'Start a conversation →',
    secondary: 'Browse publications',
  },
};

const fr: HomeCopy = {
  hero: {
    eyebrow: "Infrastructure de preuves pour une programmation adaptative",
    headlineEm: 'Le MERL nouvelle génération',
    headlineRest: "pour les programmes de développement et d'aide humanitaire.",
    body:
      "MERLx déploie une science des données avancée et un MERL outillé par la technologie pour les programmes de développement et d'aide humanitaire. Des outils analytiques augmentés par l'IA, une recherche ancrée localement et une méthodologie sensible aux conflits, pour les bailleurs, les multilatéraux, les ONGI et les opérateurs — lectures de contexte plus rapides, corrections de cap plus précoces, décisions fondées sur des preuves réelles plutôt que sur le récit du siège.",
  },
  audiences: {
    cards: [
      {
        preheader: '01 · POUR LES BAILLEURS, MULTILATÉRAUX & ONGI',
        brand: 'MERLx',
        brandSuffix: 'Studio',
        subtitle: 'Cadrer, instrumenter, évaluer.',
        body:
          "MERLx déploie une infrastructure MERL augmentée par l'IA pour les programmes internationaux de développement et d'aide humanitaire. Du cadrage aux tableaux de bord en direct, jusqu'à l'évaluation formelle — conçu pour la redevabilité, la sensibilité au conflit et la réalité des risques composés.",
        bullets: [
          "Infrastructure analytique augmentée par l'IA (Suite Optics)",
          "Conception, mise en œuvre et évaluation MERL sensibles aux conflits",
          "Tableaux de bord en direct : indicateurs, risque composé, veille narrative",
          'Résultats auditables — caractéristiques et signaux, pas de boîtes noires',
        ],
        primaryCta: 'Démarrer une conversation →',
        secondaryCta: 'Parcourir les déploiements',
      },
      {
        preheader: '02 · POUR LES PRATICIENS MERL & ÉQUIPES DE TERRAIN',
        brand: 'MERLx',
        brandSuffix: 'Network',
        subtitle: 'Méthodologie partagée, outils partagés.',
        body:
          "MERLx travaille avec les équipes MERL en pays, les chercheurs et les enquêteurs. Utilisez la Suite Optics comme infrastructure analytique partagée, formez-vous aux standards de sensibilité au conflit, et rejoignez une pratique d'examen par les pairs qui maintient un socle méthodologique sur tous les engagements.",
        bullets: [
          'La Suite Optics comme outillage analytique partagé',
          'Formation à la sensibilité au conflit et standards méthodologiques',
          'Examen par les pairs sur les engagements actifs',
          "Voies de partenariat continu pour les équipes établies",
        ],
        primaryCta: 'Devenir partenaire →',
        secondaryCta: 'Nous contacter',
      },
    ],
  },
  dashboardPreview: {
    eyebrow: 'À quoi cela ressemble en pratique',
    headlinePrefix: 'Un tableau de bord MERL en direct,',
    headlineEm: "conçu pour l'équipe programme",
    body:
      "Les équipes programme des ONGI se connectent à MERLx et voient le risque composé sur leur portefeuille, les tendances d'indicateurs en temps réel, les évolutions narratives et la confiance des prévisions — auditables jusqu'au signal sous-jacent. Pas de boîtes noires.",
  },
  caseStudies: {
    eyebrow: 'Études de cas',
    headlinePrefix: 'Déployé dans des',
    headlineEm: 'contextes de conflit actif et de fragilité',
    headlineSuffix: '.',
    lead:
      "Engagements réels où l'infrastructure MERLx fonctionne sur le terrain, avec des partenaires ancrés localement.",
    cards: [
      {
        eyebrow: 'ACTIF · NILEX · SOUDAN',
        title: 'MERL sensible au conflit dans un conflit actif',
        body:
          "NileX déploie IRIS, PRISM et l'évaluation sensible au conflit à travers le Soudan et le bassin du Nil élargi. Rapports bilingues arabe-anglais. Recherche par entretiens-clés avec transcription sur appareil. Les équipes programme reçoivent des notes hebdomadaires de risque composé.",
        cta: "Lire l'étude de cas →",
      },
      {
        eyebrow: "EN DIRECT · PRISM · CORNE DE L'AFRIQUE",
        title: "Prévision à quatre mois de l'insécurité alimentaire et des déplacements",
        body:
          "PRISM intègre données d'observation de la Terre, événements de conflit et signaux de prix pour prévoir le risque composé sur les populations en phase IPC 3+. Les équipes programme utilisent le tableau de bord pour une allocation adaptative des ressources dans la Corne de l'Afrique.",
        cta: "Lire l'étude de cas →",
      },
    ],
  },
  whereWeOperate: {
    eyebrow: 'Où nous opérons',
    headlinePrefix: 'Langues de travail et régions actives,',
    headlineEm: 'pas des intentions',
    lead:
      "Les engagements incluent transfert et formation du personnel national. De nouvelles langues et régions sont ajoutées au fur et à mesure des engagements.",
    regions: [
      {
        label: 'Principale',
        title: "Soudan & Corne de l'Afrique",
        detail:
          "Soudan, Somalie, Éthiopie, Kenya. Déploiements actifs, équipes dédiées en pays, expérience établie en sensibilité au conflit.",
      },
      {
        label: 'Active',
        title: 'Asie du Sud',
        detail:
          "Engagements au Pakistan, Bangladesh et dans la région élargie. Même pile analytique, mêmes standards.",
      },
      {
        label: 'Portable',
        title: 'Partout où la couverture en données ouvertes est raisonnable',
        detail:
          "L'architecture est portable. Chaque engagement inclut transfert et formation du personnel national pour que les outils puissent être pris en main par les équipes clientes.",
      },
    ],
    languagesLabel: 'Classificateurs NLP et langues de travail',
    languages: [
      'Arabe',
      'Somali',
      'Anglais',
      'Français',
      'Espagnol',
      'Swahili',
      'Amharique',
      'Oromo',
      'Tigrinya',
      'Kinyarwanda',
      'Pidgin nigérian',
    ],
  },
  principles: {
    eyebrow: 'Comment nous travaillons',
    headlinePrefix: 'Quatre engagements,',
    headlineEm: 'tenus sur chaque mission',
    lead:
      "Voici le socle en dessous duquel nous ne descendons pas — méthodologie, sensibilité au conflit, responsabilité des données et notre manière de manier les outils.",
    items: [
      {
        n: '01',
        title: "Le terrain d'abord, pas le laboratoire.",
        body:
          "Nos outils doivent fonctionner pour des équipes programme en environnement à faible bande passante et infrastructure limitée, pas seulement en démonstration de conférence.",
      },
      {
        n: '02',
        title: "Des preuves plutôt que de l'abstraction.",
        body:
          "Les résultats analytiques sont auditables. Nous pouvons montrer les caractéristiques derrière une classification, les indicateurs derrière un récit, les entrées derrière une prévision. Pas de boîtes noires.",
      },
      {
        n: '03',
        title: 'Ouvert et interopérable.',
        body:
          'Standards de données ouverts, archives satellites ouvertes, modèles open source, API standards. Les clients possèdent leurs données et leur instance.',
      },
      {
        n: '04',
        title: 'Responsable par défaut.',
        body:
          "Évaluation d'impact sur la protection des données à chaque engagement. Orientations IASC sur la responsabilité des données, protocoles de non-nuisance et de consentement éclairé documentés. Traitement sur appareil quand c'est viable. Résidence des données fixée par le client.",
      },
    ],
  },
  partners: {
    label: 'Nous avons travaillé avec',
    items: ['UNDP', 'UNICEF', 'WFP', 'UN OCHA', 'GIZ', 'FCDO', 'USAID', 'Banque mondiale'],
  },
  finalCta: {
    eyebrow: 'Travailler avec MERLx',
    headlinePrefix: 'Faites-nous intervenir',
    headlineEm: 'tôt',
    body:
      "Un pilote, un déploiement hébergé de la Suite Optics, une évaluation, ou un court appui consultatif — envoyez-nous une note de cadrage et nous l'orienterons vers la bonne équipe sous deux jours ouvrés.",
    primary: 'Démarrer une conversation →',
    secondary: 'Parcourir les publications',
  },
};

const ar: HomeCopy = {
  hero: {
    eyebrow: 'بنية تحتية للأدلة من أجل برمجة قابلة للتكيّف',
    headlineEm: 'الجيل القادم من الرصد والتقييم والبحث والتعلّم',
    headlineRest: 'لبرامج التنمية الدولية والمساعدات الإنسانية.',
    body:
      'تقدّم MERLx علم بيانات متقدّمًا وأنشطة رصد وتقييم وبحث وتعلّم مدعومة بالتكنولوجيا لبرامج التنمية والمساعدات الإنسانية. أدوات تحليلية معزّزة بالذكاء الاصطناعي، وبحث ذو جذور محلية، ومنهجية حسّاسة للنزاع، مصمّمة للمانحين والمنظمات متعددة الأطراف والمنظمات غير الحكومية الدولية ومنفّذي البرامج — قراءات أسرع للسياق، وتصحيحات أبكر للمسار، وقرارات مبنية على أدلة حقيقية لا على روايات المقرّات.',
  },
  audiences: {
    cards: [
      {
        preheader: '01 · للمانحين والمنظمات متعددة الأطراف والمنظمات غير الحكومية الدولية',
        brand: 'MERLx',
        brandSuffix: 'Studio',
        subtitle: 'تحديد النطاق، التجهيز، التقييم.',
        body:
          'تقدّم MERLx بنية تحتية للرصد والتقييم معزّزة بالذكاء الاصطناعي لبرامج التنمية الدولية والمساعدات الإنسانية. من تحديد النطاق إلى لوحات المتابعة الحيّة ووصولًا إلى التقييم الرسمي — مصمّمة للمساءلة والحسّاسية للنزاع وواقع المخاطر المركّبة.',
        bullets: [
          'بنية تحليلية معزّزة بالذكاء الاصطناعي (مجموعة Optics)',
          'تصميم وتنفيذ وتقييم MERL حسّاس للنزاع',
          'لوحات متابعة حيّة: مؤشّرات، مخاطر مركّبة، رصد روائي',
          'مخرجات قابلة للتدقيق — سمات وإشارات لا صناديق سوداء',
        ],
        primaryCta: 'ابدأ محادثة →',
        secondaryCta: 'تصفّح عمليات النشر',
      },
      {
        preheader: '02 · لممارسي MERL وفرق الميدان',
        brand: 'MERLx',
        brandSuffix: 'Network',
        subtitle: 'منهجية مشتركة، أدوات مشتركة.',
        body:
          'تعمل MERLx جنبًا إلى جنب مع فرق MERL داخل الدول والباحثين والمسحيّين. استخدم مجموعة Optics كبنية تحليلية مشتركة، وتدرّب على معايير الحسّاسية للنزاع، وانضمّ إلى ممارسة لمراجعة الأقران تحفظ سقفًا منهجيًا واحدًا عبر الانخراطات المختلفة.',
        bullets: [
          'مجموعة Optics بوصفها أدوات تحليلية مشتركة',
          'تدريب على الحسّاسية للنزاع ومعايير منهجية',
          'مراجعة الأقران عبر الانخراطات النشطة',
          'مسارات لشراكة مستمرّة للفرق الراسخة',
        ],
        primaryCta: 'كن شريكًا →',
        secondaryCta: 'تواصل معنا',
      },
    ],
  },
  dashboardPreview: {
    eyebrow: 'كيف يبدو ذلك عمليًا',
    headlinePrefix: 'لوحة متابعة MERL حيّة،',
    headlineEm: 'مصمّمة لفريق البرنامج',
    body:
      'تسجّل فرق برامج المنظمات غير الحكومية الدولية الدخول إلى MERLx فترى المخاطر المركّبة على محفظتها، واتجاهات المؤشّرات في الوقت الفعلي، والتحوّلات الروائية، ودرجة الثقة في التنبّؤات — قابلة للتدقيق وصولًا إلى الإشارة الأصلية. بلا صناديق سوداء.',
  },
  caseStudies: {
    eyebrow: 'دراسات حالة',
    headlinePrefix: 'منشورة عبر',
    headlineEm: 'سياقات النزاع الفعلي والدول الهشّة',
    headlineSuffix: '.',
    lead: 'انخراطات فعلية تعمل فيها بنية MERLx ميدانيًا مع شركاء راسخين محليًا.',
    cards: [
      {
        eyebrow: 'نشط · NILEX · السودان',
        title: 'MERL حسّاس للنزاع داخل نزاع فعلي',
        body:
          'تنشر NileX أدوات IRIS وPRISM والتقييم الحسّاس للنزاع عبر السودان وحوض النيل الأوسع. تقارير ثنائية اللغة بالعربية والإنجليزية. بحث عبر مقابلات المخبرين الرئيسيين مع تفريغ صوتي على الجهاز. تتلقّى فرق البرامج موجزات أسبوعية عن المخاطر المركّبة.',
        cta: 'اقرأ دراسة الحالة →',
      },
      {
        eyebrow: 'مباشر · PRISM · القرن الأفريقي',
        title: 'تنبّؤ لأربعة أشهر بانعدام الأمن الغذائي والنزوح',
        body:
          'تستوعب PRISM بيانات رصد الأرض وأحداث النزاع وإشارات الأسعار للتنبّؤ بالمخاطر المركّبة على السكّان في مرحلة IPC الثالثة فأعلى. تستخدم فرق البرامج لوحة المتابعة لتوزيع موارد قابل للتكيّف في القرن الأفريقي.',
        cta: 'اقرأ دراسة الحالة →',
      },
    ],
  },
  whereWeOperate: {
    eyebrow: 'مناطق عملنا',
    headlinePrefix: 'لغات عمل ومناطق نشطة،',
    headlineEm: 'لا مجرّد طموحات',
    lead:
      'تتضمّن الانخراطات تسليمًا وتدريبًا للكوادر الوطنية. تُضاف لغات ومناطق جديدة عندما تتطلّبها الانخراطات.',
    regions: [
      {
        label: 'رئيسية',
        title: 'السودان والقرن الأفريقي',
        detail:
          'السودان والصومال وإثيوبيا وكينيا. عمليات نشر فعلية، فرق مخصّصة داخل البلد، وسجلّ راسخ في الحسّاسية للنزاع.',
      },
      {
        label: 'نشطة',
        title: 'جنوب آسيا',
        detail:
          'انخراطات في باكستان وبنغلاديش والمنطقة الأوسع. الكومة التحليلية نفسها، والمعايير نفسها.',
      },
      {
        label: 'قابلة للنقل',
        title: 'في أي مكان تتوفّر فيه تغطية معقولة للبيانات المفتوحة',
        detail:
          'البنية قابلة للنقل. يشمل كلّ انخراط تسليمًا وتدريبًا للكوادر الوطنية كي تتمكّن فرق العميل من تشغيل الأدوات بنفسها.',
      },
    ],
    languagesLabel: 'مصنّفات معالجة اللغة الطبيعية ولغات العمل',
    languages: [
      'العربية',
      'الصومالية',
      'الإنجليزية',
      'الفرنسية',
      'الإسبانية',
      'السواحيلية',
      'الأمهرية',
      'الأورومو',
      'التغرينية',
      'الكينياروانداوية',
      'البيدجن النيجيرية',
    ],
  },
  principles: {
    eyebrow: 'كيف نعمل',
    headlinePrefix: 'أربعة التزامات،',
    headlineEm: 'محفوظة في كلّ انخراط',
    lead:
      'تصف هذه الالتزامات الأرضية التي لن نتنازل عنها — المنهجية، الحسّاسية للنزاع، مسؤولية البيانات، وطريقة تعاملنا مع الأدوات.',
    items: [
      {
        n: '01',
        title: 'الميدان أولًا، لا المختبر.',
        body:
          'يجب أن تعمل أدواتنا في بيئات ضعيفة الاتصال ومحدودة البنية التحتية لفرق البرامج، لا في عروض المؤتمرات فقط.',
      },
      {
        n: '02',
        title: 'الدليل قبل التجريد.',
        body:
          'المخرجات التحليلية قابلة للتدقيق. يمكننا إظهار السمات وراء كلّ تصنيف، والمؤشّرات وراء كلّ سرديّة، والمدخلات وراء كلّ تنبّؤ. بلا صناديق سوداء.',
      },
      {
        n: '03',
        title: 'مفتوح ومتوافق.',
        body:
          'معايير بيانات مفتوحة، وأرشيفات أقمار صناعية مفتوحة، ونماذج مفتوحة المصدر، وواجهات برمجية معيارية. يملك العملاء بياناتهم ونسختهم.',
      },
      {
        n: '04',
        title: 'مسؤول افتراضيًا.',
        body:
          'تقييم لأثر حماية البيانات في كلّ انخراط. توجيهات IASC لمسؤولية البيانات، وبروتوكولات عدم الإضرار والموافقة المستنيرة موثّقة. معالجة على الجهاز كلّما أمكن. مكان إقامة البيانات يحدّده العميل.',
      },
    ],
  },
  partners: {
    label: 'عملنا مع',
    items: ['UNDP', 'UNICEF', 'WFP', 'UN OCHA', 'GIZ', 'FCDO', 'USAID', 'البنك الدولي'],
  },
  finalCta: {
    eyebrow: 'العمل مع MERLx',
    headlinePrefix: 'استدعِنا',
    headlineEm: 'مبكّرًا',
    body:
      'تجربة تجريبية، نشر مستضاف لمجموعة Optics، تقييم، أو عمل استشاري قصير — أرسل لنا مذكّرة قصيرة وسنحوّلها إلى الفريق المناسب خلال يومَي عمل.',
    primary: 'ابدأ محادثة →',
    secondary: 'تصفّح المنشورات',
  },
};

const COPY = { en, ar, fr } as const;

export function homeCopyFor(locale: string): HomeCopy {
  const key = (['en', 'ar', 'fr'].includes(locale) ? locale : 'en') as Locale;
  return COPY[key];
}
