/**
 * Engagement-model copy. Each model carries EN/AR/FR translations.
 * Consumed by /engage and /engage/[slug] via engagementModelsFor(locale).
 */

import type { Locale } from './copy/shared';

type EngagementSlug = 'hosted' | 'pilot' | 'build-with' | 'advisory' | 'evaluation' | 'tpm-research';

interface LocalisedField {
  en: string;
  ar: string;
  fr: string;
}

interface RawEngagementModel {
  slug: EngagementSlug;
  name: LocalisedField;
  tagline: LocalisedField;
  fit: LocalisedField;
  description: LocalisedField;
  bullets: { en: string[]; ar: string[]; fr: string[] };
}

export interface EngagementModel {
  slug: EngagementSlug;
  name: string;
  tagline: string;
  fit: string;
  description: string;
  bullets: string[];
}

const RAW: RawEngagementModel[] = [
  {
    slug: 'hosted',
    name: {
      en: 'Hosted',
      fr: 'Hébergé',
      ar: 'مستضاف',
    },
    tagline: {
      en: 'Run Optics tools as a hosted service in your programme.',
      fr: 'Exécuter les outils Optics en service hébergé dans votre programme.',
      ar: 'تشغيل أدوات Optics كخدمة مستضافة داخل برنامجك.',
    },
    fit: {
      en: 'Donors and INGOs without the engineering capacity to self-host.',
      fr: "Bailleurs et ONGI sans capacité d'ingénierie pour auto-héberger.",
      ar: 'المانحون والمنظمات غير الحكومية الدولية الذين لا تتوفّر لديهم قدرة هندسية للاستضافة الذاتية.',
    },
    description: {
      en: 'We host the tools you need from the Optics Suite, configure them against your programme, integrate with your data sources, and give your team weekly outputs. Data stays in instances we run for you on EU infrastructure under standard data-protection terms.',
      fr: "Nous hébergeons les outils dont vous avez besoin dans la Suite Optics, les configurons selon votre programme, les intégrons à vos sources de données et fournissons à votre équipe des livrables hebdomadaires. Les données restent dans des instances que nous exploitons pour vous sur infrastructure UE, sous conditions standard de protection des données.",
      ar: 'نستضيف الأدوات التي تحتاجها من مجموعة Optics، ونعدّها وفق برنامجك، ونربطها بمصادر بياناتك، ونوفّر لفريقك مخرجات أسبوعية. تبقى البيانات في نُسخ نشغّلها لك على بنية أوروبية وفق شروط حماية بيانات معيارية.',
    },
    bullets: {
      en: [
        'Hosted Optics Suite instance, configured to your programme',
        'Weekly outputs (briefs, dashboards) co-designed with your MEAL team',
        'EU hosting, standard DP terms, full audit log',
        'Routine model retraining and indicator updates',
      ],
      fr: [
        'Instance hébergée de la Suite Optics, configurée pour votre programme',
        "Livrables hebdomadaires (notes, tableaux de bord) co-conçus avec votre équipe MEAL",
        "Hébergement UE, conditions DP standard, journal d'audit complet",
        "Ré-entraînement régulier des modèles et mise à jour des indicateurs",
      ],
      ar: [
        'نسخة مستضافة من مجموعة Optics، مُعَدّة وفق برنامجك',
        'مخرجات أسبوعية (موجزات، لوحات متابعة) مُصمَّمة بالتعاون مع فريق MEAL لديك',
        'استضافة في الاتحاد الأوروبي، شروط حماية بيانات معيارية، سجلّ تدقيق كامل',
        'إعادة تدريب دورية للنماذج وتحديث للمؤشّرات',
      ],
    },
  },
  {
    slug: 'pilot',
    name: {
      en: 'Pilot and evaluate',
      fr: 'Piloter et évaluer',
      ar: 'تجربة وتقييم',
    },
    tagline: {
      en: 'Bounded pilots that test whether a tool fits your context.',
      fr: "Pilotes bornés qui testent si un outil convient à votre contexte.",
      ar: 'تجارب محدّدة النطاق تختبر مدى ملاءمة الأداة لسياقك.',
    },
    fit: {
      en: 'Programmes considering adoption who want evidence before scaling.',
      fr: "Programmes envisageant l'adoption et qui veulent des preuves avant de passer à l'échelle.",
      ar: 'البرامج التي تفكّر في الاعتماد وتريد أدلّة قبل التوسّع.',
    },
    description: {
      en: 'A 4-12 week pilot of one Optics Suite tool against your operational context. We co-design success criteria with your team, deploy in one geography or programme, and write up an honest evaluation: failure modes, integration costs, and a recommendation on whether to scale.',
      fr: "Un pilote de 4 à 12 semaines sur un outil de la Suite Optics dans votre contexte opérationnel. Nous co-définissons les critères de succès avec votre équipe, déployons dans une géographie ou un programme, et produisons une évaluation honnête : modes d'échec, coûts d'intégration et recommandation sur le passage à l'échelle.",
      ar: 'تجربة لمدّة 4–12 أسبوعًا لأداة واحدة من مجموعة Optics في سياقك التشغيلي. نشترك مع فريقك في تحديد معايير النجاح، وننشر في جغرافيا أو برنامج واحد، ثم نُعدّ تقييمًا صريحًا: أنماط الفشل، وكلفة التكامل، وتوصية بشأن التوسّع.',
    },
    bullets: {
      en: [
        'Bounded scope (one tool, one geography)',
        'Pre-registered success criteria',
        'Honest evaluation, including reasons not to scale',
        'Pricing scaled to scope. Partial subsidy available for low-resource partners',
      ],
      fr: [
        'Portée délimitée (un outil, une géographie)',
        'Critères de succès enregistrés à l’avance',
        "Évaluation honnête, incluant les raisons de ne pas passer à l'échelle",
        "Tarification adaptée au périmètre. Subvention partielle pour les partenaires à faibles ressources",
      ],
      ar: [
        'نطاق محدّد (أداة واحدة، جغرافيا واحدة)',
        'معايير نجاح مسجّلة مسبقًا',
        'تقييم صريح، يشمل أسباب عدم التوسّع',
        'تسعير يتناسب مع النطاق. دعم جزئي متاح للشركاء محدودي الموارد',
      ],
    },
  },
  {
    slug: 'build-with',
    name: {
      en: 'Build-with',
      fr: 'Co-construction',
      ar: 'بناء مشترك',
    },
    tagline: {
      en: 'Co-build a tool with us in your domain.',
      fr: 'Co-construisez un outil avec nous dans votre domaine.',
      ar: 'ابنِ معنا أداة في مجالك.',
    },
    fit: {
      en: 'Partners with deep domain knowledge and a problem we should solve openly.',
      fr: "Partenaires avec une expertise approfondie du domaine et un problème à résoudre ouvertement.",
      ar: 'شركاء يمتلكون خبرة عميقة في المجال ومشكلة جديرة بحلٍّ مفتوح.',
    },
    description: {
      en: 'When the suite is missing a tool that your domain needs, build with us. The result is a new open-source tool that you co-own, with a maintenance commitment from MERLx for an agreed period. Your domain expertise plus our engineering. We retain rights to keep maintaining the tool for the wider field.',
      fr: "Quand la suite n'a pas l'outil dont votre domaine a besoin, construisons-le avec vous. Le résultat est un nouvel outil open source que vous co-possédez, avec un engagement de maintenance de MERLx pour une période convenue. Votre expertise de domaine plus notre ingénierie. Nous conservons le droit de continuer à maintenir l'outil pour le reste du secteur.",
      ar: 'حين تغيب أداة يحتاجها مجالك من المجموعة، ابنوها معنا. النتيجة أداة جديدة مفتوحة المصدر تشاركوننا ملكيتها، مع التزام صيانة من MERLx لفترة متّفق عليها. خبرتكم في المجال إضافة إلى هندستنا. نحتفظ بحقّ مواصلة صيانة الأداة لخدمة القطاع الأوسع.',
    },
    bullets: {
      en: [
        'Joint design and engineering sprints (typically 8-20 weeks)',
        'Open-source by default. Co-attribution.',
        'MERLx maintenance window after launch',
        'IP terms agreed up front',
      ],
      fr: [
        "Sprints conjoints de conception et d'ingénierie (typiquement 8–20 semaines)",
        'Open source par défaut. Co-attribution.',
        'Fenêtre de maintenance MERLx après le lancement',
        "Conditions de propriété intellectuelle convenues d'avance",
      ],
      ar: [
        'سباقات تصميم وهندسة مشتركة (عادةً 8–20 أسبوعًا)',
        'مفتوحة المصدر افتراضيًا. عَزْو مشترك.',
        'نافذة صيانة من MERLx بعد الإطلاق',
        'شروط ملكية فكرية مُتّفق عليها مسبقًا',
      ],
    },
  },
  {
    slug: 'advisory',
    name: {
      en: 'Advisory',
      fr: 'Conseil',
      ar: 'استشارة',
    },
    tagline: {
      en: 'Senior advisors on AI, MEAL and conflict-sensitive data work.',
      fr: "Conseillers seniors sur l'IA, le MEAL et le travail sur données sensible au conflit.",
      ar: 'مستشارون كبار في الذكاء الاصطناعي وMEAL والعمل على البيانات الحسّاس للنزاع.',
    },
    fit: {
      en: 'Teams making strategic data, AI or MEAL decisions who want an outside read.',
      fr: "Équipes prenant des décisions stratégiques sur les données, l'IA ou le MEAL qui veulent un regard extérieur.",
      ar: 'الفرق التي تتّخذ قرارات استراتيجية في البيانات أو الذكاء الاصطناعي أو MEAL وتريد قراءة من خارج المؤسّسة.',
    },
    description: {
      en: 'Time-boxed senior advisory: design reviews, theory-of-change critique, AI and data strategy, vendor review, evaluation methodology. Day-rate or retainer. Same people who build the tools.',
      fr: "Conseil senior à durée bornée : revues de conception, critique de théorie du changement, stratégie IA et données, revue de fournisseurs, méthodologie d'évaluation. Taux journalier ou forfait. Les mêmes personnes qui construisent les outils.",
      ar: 'استشارة عليا محدّدة المدّة: مراجعات تصميم، ونقد لنظرية التغيير، واستراتيجية للذكاء الاصطناعي والبيانات، ومراجعة لبائعين، ومنهجية تقييم. أجر يومي أو عقد شهري. الأشخاص أنفسهم الذين يبنون الأدوات.',
    },
    bullets: {
      en: [
        'Day-rate or quarterly retainer',
        'Senior staff only',
        'Output-shaped: written critique, design review, sprint kick-off',
        'We will say no to engagements we cannot do well',
      ],
      fr: [
        'Taux journalier ou forfait trimestriel',
        'Personnel senior uniquement',
        "Façonné par les livrables : critique écrite, revue de conception, lancement de sprint",
        "Nous refuserons les engagements que nous ne pouvons pas mener correctement",
      ],
      ar: [
        'أجر يومي أو عقد ربع سنوي',
        'كوادر عليا فقط',
        'محدّد بالمخرجات: نقد مكتوب، مراجعة تصميم، انطلاقة سباق',
        'سنرفض الانخراطات التي لا نستطيع إنجازها على الوجه المطلوب',
      ],
    },
  },
  {
    slug: 'evaluation',
    name: {
      en: 'Evaluation',
      fr: 'Évaluation',
      ar: 'تقييم',
    },
    tagline: {
      en: 'Conflict-sensitive evaluations across the programme lifecycle.',
      fr: "Évaluations sensibles au conflit sur tout le cycle programme.",
      ar: 'تقييمات حسّاسة للنزاع عبر دورة حياة البرنامج.',
    },
    fit: {
      en: 'Donors, multilaterals and INGOs commissioning formative, midterm or endline evaluations in fragile and conflict-affected contexts.',
      fr: "Bailleurs, multilatéraux et ONGI commanditant des évaluations formatives, à mi-parcours ou finales dans des contextes fragiles et affectés par le conflit.",
      ar: 'المانحون والمنظمات متعدّدة الأطراف والمنظمات غير الحكومية الدولية الذين يكلّفون بتقييمات تكوينية أو منتصف مدّة أو نهائية في سياقات هشّة ومتأثّرة بالنزاع.',
    },
    description: {
      en: 'Independent mixed-methods evaluations: document review, KII, FGD, survey, and — where the question warrants — Optics tools as analytical infrastructure (PRISM compound risk, IRIS narrative monitoring, ToC Tester theory-of-change critique). Conflict-sensitive by default. Bilingual reporting. Outputs are auditable: features behind classifications, indicators behind narratives, evidence behind every claim.',
      fr: "Évaluations indépendantes en méthodes mixtes : revue documentaire, entretiens-clés, groupes de discussion, enquêtes, et — quand la question le justifie — les outils Optics comme infrastructure analytique (PRISM risque composé, IRIS veille narrative, ToC Tester critique de la théorie du changement). Sensible au conflit par défaut. Rapports bilingues. Les résultats sont auditables : caractéristiques derrière les classifications, indicateurs derrière les récits, preuves derrière chaque affirmation.",
      ar: 'تقييمات مستقلّة بطرائق مختلطة: مراجعة وثائق، ومقابلات مع المخبرين الرئيسيين، ومجموعات نقاش مركّزة، ومسوح، و — حين تستدعي المسألة ذلك — أدوات Optics بوصفها بنية تحليلية (PRISM للمخاطر المركّبة، IRIS للرصد الروائي، ToC Tester لنقد نظرية التغيير). حسّاس للنزاع افتراضيًا. تقارير ثنائية اللغة. المخرجات قابلة للتدقيق: سمات وراء التصنيفات، ومؤشّرات وراء السرديّات، وأدلّة وراء كلّ ادّعاء.',
    },
    bullets: {
      en: [
        'Mixed-methods: KII, FGD, survey, document review',
        'Theory-of-change critique with ToC Tester where useful',
        'Bilingual reporting (English + working language)',
        'DPIA per engagement, IASC and OECD-DAC aligned',
      ],
      fr: [
        'Méthodes mixtes : KII, FGD, enquête, revue documentaire',
        "Critique de théorie du changement avec ToC Tester si pertinent",
        "Rapports bilingues (anglais + langue de travail)",
        "ÉIPD par engagement, aligné IASC et OECD-DAC",
      ],
      ar: [
        'طرائق مختلطة: مقابلات مع المخبرين الرئيسيين، مجموعات نقاش مركّزة، مسح، مراجعة وثائق',
        'نقد نظرية التغيير عبر ToC Tester حين يكون ذلك مفيدًا',
        'تقارير ثنائية اللغة (الإنجليزية + لغة العمل)',
        'تقييم لأثر حماية البيانات لكلّ انخراط، متوافق مع IASC وOECD-DAC',
      ],
    },
  },
  {
    slug: 'tpm-research',
    name: {
      en: 'TPM & Research',
      fr: 'TPM & Recherche',
      ar: 'الرصد عبر طرف ثالث والبحث',
    },
    tagline: {
      en: 'Third-Party Monitoring, KII rotations and primary research in fragile contexts.',
      fr: "Suivi par tiers, rotations d'entretiens-clés et recherche primaire dans les contextes fragiles.",
      ar: 'رصد عبر طرف ثالث، ومناوبات مقابلات مع المخبرين الرئيسيين، وبحث أوّلي في السياقات الهشّة.',
    },
    fit: {
      en: 'Donors and implementers needing recurring field verification, baseline / midline / endline studies, or primary research where the field is hard to reach.',
      fr: "Bailleurs et opérateurs ayant besoin de vérification de terrain récurrente, d'études baseline/midline/endline, ou de recherche primaire là où le terrain est difficile d'accès.",
      ar: 'المانحون والمنفّذون الذين يحتاجون تحقّقًا ميدانيًا متكرّرًا، أو دراسات خطّ أساس/متوسّط مدّة/نهائية، أو بحثًا أوّليًا حيث يصعب الوصول الميداني.',
    },
    description: {
      en: 'Recurring TPM cycles and primary research delivered through locally anchored teams who own the analysis. On-device KII transcription via ECHO where bandwidth, security or consent demands it. Findings are owned by the country team and signed off jointly. Client receives structured outputs and briefings rather than raw transcripts.',
      fr: "Cycles TPM récurrents et recherche primaire livrés par des équipes ancrées localement qui possèdent l'analyse. Transcription des entretiens-clés sur appareil via ECHO quand la bande passante, la sécurité ou le consentement l'exigent. Les conclusions appartiennent à l'équipe pays et sont validées conjointement. Le client reçoit des livrables structurés et des briefings plutôt que des transcriptions brutes.",
      ar: 'دورات رصد عبر طرف ثالث متكرّرة وبحث أوّلي تنفّذه فرق مرتكزة محليًا تملك التحليل. تفريغ صوتي للمقابلات على الجهاز عبر ECHO حين يستدعي ذلك الاتصال أو الأمن أو الموافقة. النتائج تخصّ فريق البلد وتُعتمد بالتشارك. يستلم العميل مخرجات منسّقة وموجزات لا تفريغات خام.',
    },
    bullets: {
      en: [
        'Recurring TPM cycles, configurable cadence',
        'On-device KII transcription (ECHO) for low-bandwidth or sensitive contexts',
        'Baseline / midline / endline data collection',
        'Locally anchored teams; structured client briefings, not raw transcripts',
      ],
      fr: [
        'Cycles TPM récurrents, cadence configurable',
        "Transcription KII sur appareil (ECHO) pour contextes à faible bande passante ou sensibles",
        "Collecte de données baseline / midline / endline",
        "Équipes ancrées localement ; briefings clients structurés, pas de transcriptions brutes",
      ],
      ar: [
        'دورات رصد عبر طرف ثالث متكرّرة، بإيقاع قابل للتعديل',
        'تفريغ مقابلات على الجهاز (ECHO) للسياقات ضعيفة الاتصال أو الحسّاسة',
        'جمع بيانات خطّ أساس / متوسّط مدّة / نهائي',
        'فرق مرتكزة محليًا؛ موجزات عميل منسّقة، لا تفريغات خام',
      ],
    },
  },
];

function pick(field: LocalisedField, locale: Locale): string {
  return field[locale] ?? field.en;
}

export function engagementModelsFor(locale: string): EngagementModel[] {
  const key = (['en', 'ar', 'fr'].includes(locale) ? locale : 'en') as Locale;
  return RAW.map((m) => ({
    slug: m.slug,
    name: pick(m.name, key),
    tagline: pick(m.tagline, key),
    fit: pick(m.fit, key),
    description: pick(m.description, key),
    bullets: m.bullets[key] ?? m.bullets.en,
  }));
}

/** Backwards-compatible export — defaults to English. */
export const ENGAGEMENT_MODELS = engagementModelsFor('en');
