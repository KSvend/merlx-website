/**
 * Shared multi-locale copy for the smaller page hero blocks
 * (/engage, /optics, /insights, /publications, /contact). EN
 * authoritative; AR / FR drafts.
 */
import type { Locale } from './shared';

interface Hero {
  eyebrow: string;
  headlinePrefix: string;
  headlineEm: string;
  headlineSuffix?: string;
  lead?: string;
}

export interface PageHeroes {
  engage: Hero & { secondLineWithCount: (n: number) => string };
  engageModel: {
    eyebrow: string;
    leadLabel: string;
  };
  optics: Hero & { browseLabel: (n: number) => string; emptyState: string };
  insights: Hero & { empty: string };
  publications: Hero & { empty: string };
  contact: Hero;
  pillCtas: {
    readCaseStudy: string;
    backToEngage: string;
    backToOptics: string;
  };
}

const en: PageHeroes = {
  engage: {
    eyebrow: 'How to work with MERLx',
    headlinePrefix: 'Six ways to',
    headlineEm: 'engage',
    headlineSuffix: '.',
    lead: 'Most engagements with MERLx fit one of six shapes — four tooling-led, two grounded in classical MERL practice. Pick the closest fit on the contact form and we will route you to the right team within two working days.',
    secondLineWithCount: (n: number) => `${n} engagement models`,
  },
  engageModel: {
    eyebrow: 'Engagement model',
    leadLabel: 'Fit',
  },
  optics: {
    eyebrow: 'The Optics Suite',
    headlinePrefix: 'Six tools,',
    headlineEm: 'one practice',
    headlineSuffix: '.',
    lead: "MERLx's open AI tooling for monitoring, evaluation, research and early warning. Each tool is small, opinionated, and built to interoperate with the data systems your programme already runs.",
    browseLabel: (n: number) => `Browse the portfolio · ${n} tools`,
    emptyState: 'The portfolio is being seeded. Reload shortly.',
  },
  insights: {
    eyebrow: 'Insights',
    headlinePrefix: 'Writing from the',
    headlineEm: 'field',
    headlineSuffix: '.',
    lead: 'Methods notes, field reflections and the occasional essay from MERLx and its partners. No company updates.',
    empty: 'The first insights are being prepared. Check back shortly.',
  },
  publications: {
    eyebrow: 'Publications',
    headlinePrefix: 'Working papers, briefs,',
    headlineEm: 'peer-reviewed research',
    headlineSuffix: '.',
    lead: 'Open-access by default. Methodology notes, evaluation reports and journal articles authored across MERLx engagements.',
    empty: 'The first cohort of publications is in review.',
  },
  contact: {
    eyebrow: 'Get in touch',
    headlinePrefix: 'Send a',
    headlineEm: 'brief',
    headlineSuffix: '.',
    lead: 'Tell us about the engagement you have in mind. We respond to brief submissions within two working days.',
  },
  pillCtas: {
    readCaseStudy: 'Read case study →',
    backToEngage: '← All engagement models',
    backToOptics: '← All Optics tools',
  },
};

const fr: PageHeroes = {
  engage: {
    eyebrow: 'Comment travailler avec MERLx',
    headlinePrefix: 'Six façons de',
    headlineEm: 'collaborer',
    headlineSuffix: '.',
    lead: "La plupart des engagements avec MERLx prennent l'une de six formes — quatre outillées, deux ancrées dans la pratique MERL classique. Sélectionnez la plus proche dans le formulaire de contact et nous vous orienterons vers la bonne équipe sous deux jours ouvrés.",
    secondLineWithCount: (n: number) => `${n} modèles d'engagement`,
  },
  engageModel: {
    eyebrow: "Modèle d'engagement",
    leadLabel: 'Public',
  },
  optics: {
    eyebrow: 'La Suite Optics',
    headlinePrefix: 'Six outils,',
    headlineEm: 'une seule pratique',
    headlineSuffix: '.',
    lead: "L'outillage IA ouvert de MERLx pour le suivi, l'évaluation, la recherche et l'alerte précoce. Chaque outil est petit, opinié, et construit pour s'interfacer avec les systèmes de données déjà utilisés par votre programme.",
    browseLabel: (n: number) => `Parcourir le portefeuille · ${n} outils`,
    emptyState: "Le portefeuille est en cours d'alimentation. Rechargez dans un instant.",
  },
  insights: {
    eyebrow: 'Analyses',
    headlinePrefix: "Écrits depuis le",
    headlineEm: 'terrain',
    headlineSuffix: '.',
    lead: "Notes méthodologiques, retours de terrain et essais occasionnels par MERLx et ses partenaires. Pas de communications d'entreprise.",
    empty: "Les premières analyses sont en préparation. Revenez bientôt.",
  },
  publications: {
    eyebrow: 'Publications',
    headlinePrefix: 'Documents de travail, notes,',
    headlineEm: 'recherche évaluée par les pairs',
    headlineSuffix: '.',
    lead: "Accès ouvert par défaut. Notes méthodologiques, rapports d'évaluation et articles de revue rédigés au fil des engagements MERLx.",
    empty: 'La première vague de publications est en revue.',
  },
  contact: {
    eyebrow: 'Nous contacter',
    headlinePrefix: 'Envoyez une',
    headlineEm: 'note de cadrage',
    headlineSuffix: '.',
    lead: "Décrivez-nous l'engagement que vous envisagez. Nous répondons aux notes de cadrage sous deux jours ouvrés.",
  },
  pillCtas: {
    readCaseStudy: "Lire l'étude de cas →",
    backToEngage: "← Tous les modèles d'engagement",
    backToOptics: '← Tous les outils Optics',
  },
};

const ar: PageHeroes = {
  engage: {
    eyebrow: 'كيفية العمل مع MERLx',
    headlinePrefix: 'ست طرق',
    headlineEm: 'للانخراط',
    headlineSuffix: '.',
    lead: 'تتّخذ معظم الانخراطات مع MERLx واحدة من ست صيغ — أربع تعتمد على الأدوات، واثنتان ترسوان في الممارسة الكلاسيكية للرصد والتقييم. اختر الأقرب في نموذج التواصل وسنحوّلك إلى الفريق المناسب خلال يومَي عمل.',
    secondLineWithCount: (n: number) => `${n} نماذج للانخراط`,
  },
  engageModel: {
    eyebrow: 'نموذج انخراط',
    leadLabel: 'يلائم',
  },
  optics: {
    eyebrow: 'مجموعة Optics',
    headlinePrefix: 'ست أدوات،',
    headlineEm: 'ممارسة واحدة',
    headlineSuffix: '.',
    lead: 'أدوات الذكاء الاصطناعي المفتوحة في MERLx للرصد والتقييم والبحث والإنذار المبكر. كلّ أداة صغيرة ومتركّزة وتعمل مع منظومات البيانات التي يشغّلها برنامجك أصلًا.',
    browseLabel: (n: number) => `تصفّح المحفظة · ${n} أدوات`,
    emptyState: 'تُعَدّ المحفظة الآن. أعد التحميل قريبًا.',
  },
  insights: {
    eyebrow: 'رؤى',
    headlinePrefix: 'كتابات من',
    headlineEm: 'الميدان',
    headlineSuffix: '.',
    lead: 'ملاحظات منهجية، وانعكاسات ميدانية، ومقالات بين الحين والآخر من MERLx وشركائها. لا أخبار شركة.',
    empty: 'الرؤى الأولى قيد الإعداد. تفقّد لاحقًا.',
  },
  publications: {
    eyebrow: 'منشورات',
    headlinePrefix: 'أوراق عمل، موجزات،',
    headlineEm: 'أبحاث محكّمة',
    headlineSuffix: '.',
    lead: 'وصول مفتوح افتراضيًا. ملاحظات منهجية وتقارير تقييم ومقالات دوريات تأليفها عبر انخراطات MERLx.',
    empty: 'الدفعة الأولى من المنشورات قيد المراجعة.',
  },
  contact: {
    eyebrow: 'تواصل معنا',
    headlinePrefix: 'أرسل',
    headlineEm: 'مذكّرة قصيرة',
    headlineSuffix: '.',
    lead: 'أخبرنا عن الانخراط الذي تفكّر فيه. نردّ على المذكّرات خلال يومَي عمل.',
  },
  pillCtas: {
    readCaseStudy: 'اقرأ دراسة الحالة →',
    backToEngage: '← جميع نماذج الانخراط →',
    backToOptics: '← جميع أدوات Optics →',
  },
};

const COPY = { en, ar, fr } as const;

export function pageHeroesFor(locale: string): PageHeroes {
  const key = (['en', 'ar', 'fr'].includes(locale) ? locale : 'en') as Locale;
  return COPY[key];
}
