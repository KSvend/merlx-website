/**
 * About-page copy keyed by locale. Drafts for AR/FR; EN is authoritative.
 */
import type { Locale } from './shared';

interface NarrativeSubsection {
  eyebrow: string;
  headlinePrefix: string;
  headlineEm: string;
  headlineSuffix?: string;
  paragraphs: Array<{ strong?: string; text: string }>;
}

interface Milestone {
  year: string;
  entity: string;
  title: string;
  body: string;
}

export interface AboutCopy {
  hero: {
    eyebrow: string;
    flourishGroup: string;
    leadGroup: string;
  };
  narrative: {
    why: NarrativeSubsection;
    response: NarrativeSubsection;
    holdTo: NarrativeSubsection;
  };
  history: {
    eyebrow: string;
    headlinePrefix: string;
    headlineEm: string;
    headlineSuffix: string;
    lead: string;
    milestones: Milestone[];
  };
}

const en: AboutCopy = {
  hero: {
    eyebrow: 'About · MERLx',
    flourishGroup: 'the next-generation MERL practice',
    leadGroup:
      'AI-augmented MERL infrastructure for global development and humanitarian aid programmes — anchored locally through in-country partners.',
  },
  narrative: {
    why: {
      eyebrow: 'Why MERLx exists',
      headlinePrefix: 'The system is under pressure, and most MERL was',
      headlineEm: 'not built for it',
      headlineSuffix: '.',
      paragraphs: [
        {
          text: 'Humanitarian and development systems are under unprecedented pressure. Donors are being asked to deliver more impact, more accountability, and more localisation — with less money, more political scrutiny, and rapidly compounding risks. Budgets are tightening just as climate shocks, protracted crises, and geopolitical fragmentation intensify.',
        },
        {
          text: 'In that context, Monitoring, Evaluation, Research and Learning is both critical and increasingly misaligned with the challenge. Evaluations arrive too late to inform adaptive management. Learning products are stored, not used, and rarely feed portfolio-level decisions. Third-Party Monitoring can feel like compliance surveillance, rather than a tool for joint problem-solving. Local researchers and MERL partners shoulder frontline risk but retain little ownership over data, tools, or long-term value. Emerging AI tools are mostly black-box products — hard to trust, hard to explain, and rarely designed with fragile contexts in mind.',
        },
        {
          text: 'The result is a widening gap between what decision-makers need — timely, conflict-sensitive, trusted evidence — and what current MERL systems can structurally deliver.',
        },
      ],
    },
    response: {
      eyebrow: 'The MERLx response',
      headlinePrefix: 'AI-augmented,',
      headlineEm: 'locally anchored',
      headlineSuffix: ' MERL.',
      paragraphs: [
        {
          text: 'MERLx is being built as an AI-augmented, locally anchored MERL practice for donors, multilaterals, INGOs and implementers who want to re-architect evidence infrastructure around four moves: real-time analysis and compound-risk insight, locally anchored delivery, conflict-sensitive methodology, and operational readiness rather than concept notes.',
        },
        {
          text: 'We combine analytical infrastructure — the Optics Suite: IRIS, Aperture, PRISM, ToC Tester, OASIS, ECHO — with locally anchored research and conflict-sensitive methodology. AI is an amplifier for the analysts, evaluators and programme staff who already do this work. It does not replace their judgement. AI-augmented workflows can reduce qualitative synthesis time by up to 60–75%, freeing expert time for interpretation and dialogue rather than manual coding.',
        },
        {
          text: 'Localisation is not a translation step at the end. It is built into the language stack, the infrastructure choices, and the governance of every engagement. We design tools so the people closest to the work can run them, and we anchor delivery locally through partner cooperatives who own the analysis under their own governance, in their own languages. Findings are owned by the country team. Headquarters does not rewrite them.',
        },
      ],
    },
    holdTo: {
      eyebrow: 'What we hold to',
      headlinePrefix: 'Field first. Evidence over abstraction.',
      headlineEm: 'Open. Responsible',
      headlineSuffix: '.',
      paragraphs: [
        {
          strong: 'Field first, not lab first.',
          text: ' Programme reality sets the architecture. Low bandwidth, limited infrastructure, non-specialist users, noisy data, power that cuts out. Every tool has to work for a programme officer on a modest laptop, or an analyst at a shared country-office desk behind a captive portal. We design for sustained programme use, not conference demos.',
        },
        {
          strong: 'Evidence over abstraction.',
          text: " Every analytical output is auditable. Classifiers show which features drove the call. Narrative reports cite the indicators behind them. ToC Tester critique cites its evidence. We support human judgement; we don't replace it.",
        },
        {
          strong: 'Open and interoperable.',
          text: ' Open data standards, open satellite archives (Sentinel, Landsat, MODIS via Copernicus and Planetary Computer), open-source analytical libraries and standard APIs. Clients own their data and their instance. Nothing in our core stack is licence-locked.',
        },
        {
          strong: 'Responsible by default.',
          text: ' Every engagement runs a data-protection impact assessment at inception. We align to IASC operational guidance on data responsibility, and to OECD-DAC conflict-sensitivity and Core Humanitarian Standard principles. Informed consent, distress-referral and takedown protocols are documented per deployment. Classifier outputs affecting named individuals pass a human-in-the-loop review before release. PII redaction is on by default. Data residency and retention are set by the client.',
        },
      ],
    },
  },
  history: {
    eyebrow: 'Origins',
    headlinePrefix: 'A practice running since',
    headlineEm: '2017',
    headlineSuffix: ', now under MERLx, S.L.',
    lead: 'MERLx, S.L. is a Spain-based MERL consultancy established in 2026 to formalise an advisory practice that previously operated under the Slipström name. Same principal, same methodology, same partner relationships — under a clearer legal form.',
    milestones: [
      {
        year: '2017',
        entity: 'DK · enkeltmandsvirksomhed',
        title: 'Slipström practice begins in Denmark',
        body: 'Independent advisory work begins in Copenhagen as a Danish enkeltmandsvirksomhed under the Slipström name. The early years build the core practice: MERL, conflict analysis, research, and evidence-based advisory for international development and humanitarian partners.',
      },
      {
        year: '2021',
        entity: 'ES · autónoma · Barcelona',
        title: 'Practice relocates to Spain',
        body: 'The principal consultant moves to Spain and registers as an autónoma in Barcelona, continuing under the Slipström name. A growing portfolio across East Africa and the Middle East shapes the practice toward conflict-sensitive MERL and data-enabled evaluation.',
      },
      {
        year: '2024',
        entity: 'NileX · Nairobi',
        title: 'NileX founded as a local-anchor node',
        body: 'The network-building logic crystallizes with the creation of NileX, an independent MERL and data-analytic firm in Nairobi. NileX is designed as a local-anchor node to strengthen conflict-sensitive programme evaluation, research, and early-warning systems across the region.',
      },
      {
        year: '2026',
        entity: 'NileX · Sudan',
        title: 'NileX expands into Sudan',
        body: 'The network expands with the establishment of NileX in Sudan, deepening the practice’s presence in fragile-state contexts and reinforcing capacity for locally anchored, conflict-informed MERL operations across the Nile-region corridor.',
      },
      {
        year: '2026',
        entity: 'MERLx, S.L. · Spain',
        title: 'First formal node in the network',
        body: 'The practice is formalized through the incorporation of MERLx, S.L. in Spain — a limited-liability legal form that carries forward the eight-year track record built under the Slipström name. Same principal, same methodology, same partner relationships. From here on the practice runs as MERLx, S.L., serving as the strategic hub and the first formal node in a broader network with NileX (Nairobi and Sudan).',
      },
    ],
  },
};

const fr: AboutCopy = {
  hero: {
    eyebrow: 'À propos · MERLx',
    flourishGroup: 'la pratique MERL de nouvelle génération',
    leadGroup:
      "Infrastructure MERL augmentée par l'IA pour les programmes de développement et d'aide humanitaire — ancrée localement à travers des partenaires en pays.",
  },
  narrative: {
    why: {
      eyebrow: 'Pourquoi MERLx existe',
      headlinePrefix: "Le système est sous pression, et la plupart du MERL n'a",
      headlineEm: 'pas été conçu pour ça',
      headlineSuffix: '.',
      paragraphs: [
        {
          text: "Les systèmes humanitaires et de développement sont sous une pression sans précédent. On demande aux bailleurs de fonds plus d'impact, plus de redevabilité et plus de localisation — avec moins de moyens, plus de scrutin politique et des risques qui s'accumulent rapidement. Les budgets se resserrent au moment même où les chocs climatiques, les crises prolongées et la fragmentation géopolitique s'intensifient.",
        },
        {
          text: "Dans ce contexte, le Suivi, l'Évaluation, la Recherche et l'Apprentissage (MERL) est à la fois essentiel et de plus en plus désaligné avec le défi. Les évaluations arrivent trop tard pour informer la gestion adaptative. Les produits d'apprentissage sont stockés, pas utilisés, et nourrissent rarement les décisions de portefeuille. Le Suivi par Tiers (TPM) peut ressembler à une surveillance de conformité plutôt qu'à un outil de résolution conjointe de problèmes. Les chercheurs locaux et partenaires MERL portent le risque en première ligne mais conservent peu de propriété sur les données, les outils ou la valeur de long terme. Les outils d'IA émergents sont surtout des produits boîtes noires — difficiles à valider, difficiles à expliquer, et rarement conçus avec les contextes fragiles à l'esprit.",
        },
        {
          text: "Le résultat est un écart grandissant entre ce dont les décideurs ont besoin — des preuves fiables, sensibles au conflit, livrées à temps — et ce que les systèmes MERL actuels peuvent structurellement délivrer.",
        },
      ],
    },
    response: {
      eyebrow: 'La réponse de MERLx',
      headlinePrefix: "Un MERL augmenté par l'IA,",
      headlineEm: 'ancré localement',
      headlineSuffix: '.',
      paragraphs: [
        {
          text: "MERLx est construit comme une pratique MERL augmentée par l'IA et ancrée localement pour les bailleurs, multilatéraux, ONGI et opérateurs qui veulent ré-architecturer leur infrastructure de preuves autour de quatre axes : analyse en temps réel et compréhension du risque composé, livraison ancrée localement, méthodologie sensible au conflit, et capacité opérationnelle plutôt que notes de concept.",
        },
        {
          text: "Nous combinons une infrastructure analytique — la Suite Optics : IRIS, Aperture, PRISM, ToC Tester, OASIS, ECHO — avec une recherche ancrée localement et une méthodologie sensible au conflit. L'IA amplifie les analystes, évaluateurs et personnels programme qui font déjà ce travail. Elle ne remplace pas leur jugement. Les flux augmentés par l'IA peuvent réduire le temps de synthèse qualitative de 60 à 75 %, libérant le temps d'expert pour l'interprétation et le dialogue plutôt que pour le codage manuel.",
        },
        {
          text: "La localisation n'est pas une étape de traduction à la fin. Elle est intégrée dans la pile linguistique, les choix d'infrastructure et la gouvernance de chaque engagement. Nous concevons des outils pour que les personnes les plus proches du travail puissent les exécuter, et nous ancrons la livraison localement à travers des coopératives partenaires qui possèdent l'analyse sous leur propre gouvernance, dans leurs propres langues. Les conclusions appartiennent à l'équipe pays. Le siège ne les réécrit pas.",
        },
      ],
    },
    holdTo: {
      eyebrow: 'Ce à quoi nous tenons',
      headlinePrefix: "Le terrain d'abord. Des preuves plutôt que de l'abstraction.",
      headlineEm: 'Ouvert. Responsable',
      headlineSuffix: '.',
      paragraphs: [
        {
          strong: "Le terrain d'abord, pas le laboratoire.",
          text: " La réalité programme dicte l'architecture. Bande passante faible, infrastructure limitée, utilisateurs non spécialistes, données bruitées, coupures de courant. Chaque outil doit fonctionner pour un agent programme sur un ordinateur portable modeste, ou un analyste à un poste partagé dans un bureau pays derrière un portail captif. Nous concevons pour un usage programme durable, pas pour les démonstrations en conférence.",
        },
        {
          strong: "Des preuves plutôt que de l'abstraction.",
          text: " Chaque résultat analytique est auditable. Les classificateurs montrent les caractéristiques qui ont guidé la décision. Les rapports narratifs citent les indicateurs sous-jacents. La critique de ToC Tester cite ses preuves. Nous appuyons le jugement humain ; nous ne le remplaçons pas.",
        },
        {
          strong: 'Ouvert et interopérable.',
          text: " Standards de données ouverts, archives satellites ouvertes (Sentinel, Landsat, MODIS via Copernicus et Planetary Computer), bibliothèques analytiques open source et API standards. Les clients possèdent leurs données et leur instance. Rien dans notre pile centrale n'est verrouillé par licence.",
        },
        {
          strong: 'Responsable par défaut.',
          text: " Chaque engagement commence par une évaluation d'impact sur la protection des données. Nous nous alignons sur les orientations opérationnelles IASC en matière de responsabilité des données, et sur les principes de sensibilité au conflit OECD-DAC et le Core Humanitarian Standard. Consentement éclairé, protocoles d'orientation en cas de détresse et de retrait sont documentés par déploiement. Les sorties de classificateurs qui affectent des individus nommés passent par une revue humaine avant publication. La rédaction des PII est activée par défaut. La résidence et la rétention des données sont définies par le client.",
        },
      ],
    },
  },
  history: {
    eyebrow: 'Origines',
    headlinePrefix: 'Une pratique active depuis',
    headlineEm: '2017',
    headlineSuffix: ', désormais sous MERLx, S.L.',
    lead:
      "MERLx, S.L. est une société de conseil MERL basée en Espagne, établie en 2026 pour formaliser une pratique consultative qui opérait précédemment sous le nom Slipström. Même principal, même méthodologie, mêmes relations partenariales — sous une forme légale plus claire.",
    milestones: [
      {
        year: '2017',
        entity: 'DK · enkeltmandsvirksomhed',
        title: 'Démarrage de la pratique Slipström au Danemark',
        body: "Le travail consultatif indépendant commence à Copenhague en tant qu'enkeltmandsvirksomhed danoise sous le nom Slipström. Les premières années construisent la pratique centrale : MERL, analyse de conflit, recherche et conseil fondé sur les preuves pour les partenaires internationaux de développement et d'aide humanitaire.",
      },
      {
        year: '2021',
        entity: 'ES · autónoma · Barcelone',
        title: 'La pratique déménage en Espagne',
        body: "Le consultant principal s'installe en Espagne et s'inscrit comme autónoma à Barcelone, poursuivant sous le nom Slipström. Un portefeuille croissant en Afrique de l'Est et au Moyen-Orient oriente la pratique vers un MERL sensible au conflit et une évaluation outillée par les données.",
      },
      {
        year: '2024',
        entity: 'NileX · Nairobi',
        title: "Création de NileX comme nœud d'ancrage local",
        body: "La logique de construction du réseau se cristallise avec la création de NileX, une firme indépendante de MERL et d'analyse de données à Nairobi. NileX est conçu comme un nœud d'ancrage local pour renforcer l'évaluation de programmes sensible au conflit, la recherche et les systèmes d'alerte précoce dans la région.",
      },
      {
        year: '2026',
        entity: 'NileX · Soudan',
        title: "NileX s'étend au Soudan",
        body: "Le réseau s'étend avec l'établissement de NileX au Soudan, approfondissant la présence de la pratique dans les contextes de fragilité étatique et renforçant la capacité d'opérations MERL ancrées localement et informées par le conflit à travers le corridor Nil.",
      },
      {
        year: '2026',
        entity: 'MERLx, S.L. · Espagne',
        title: 'Premier nœud formel dans le réseau',
        body: "La pratique est formalisée par la constitution de MERLx, S.L. en Espagne — une forme légale à responsabilité limitée qui porte les huit années d'expérience accumulées sous le nom Slipström. Même principal, même méthodologie, mêmes relations partenariales. À partir d'ici la pratique opère sous MERLx, S.L., servant de pivot stratégique et de premier nœud formel dans un réseau plus large avec NileX (Nairobi et Soudan).",
      },
    ],
  },
};

const ar: AboutCopy = {
  hero: {
    eyebrow: 'حول · MERLx',
    flourishGroup: 'ممارسة MERL للجيل القادم',
    leadGroup:
      'بنية تحتية للرصد والتقييم معزّزة بالذكاء الاصطناعي لبرامج التنمية الدولية والمساعدات الإنسانية — مرتكزة محليًا عبر شركاء داخل البلدان.',
  },
  narrative: {
    why: {
      eyebrow: 'لماذا توجد MERLx',
      headlinePrefix: 'النظام تحت ضغط، ومعظم الرصد والتقييم',
      headlineEm: 'لم يُصمَّم لمواجهته',
      headlineSuffix: '.',
      paragraphs: [
        {
          text: 'تخضع منظومات العمل الإنساني والتنموي لضغط غير مسبوق. يُطلب من المانحين تقديم أثر أكبر، ومساءلة أعلى، وقدر أكبر من التوطين — بأموال أقلّ، وتدقيق سياسي أكثر، ومخاطر تتراكم بسرعة. تتقلّص الموازنات في الوقت ذاته الذي تتكثّف فيه الصدمات المناخية والأزمات المطوّلة والتشظّي الجيوسياسي.',
        },
        {
          text: 'في هذا السياق، فإن الرصد والتقييم والبحث والتعلّم حيوي ومتزايد الانفصال عن التحدّي. تأتي التقييمات متأخّرة جدًا بحيث لا تُسعف الإدارة التكيّفية. تُحفظ "منتجات التعلّم" ولا تُستخدم، ونادرًا ما تُغذّي قرارات على مستوى المحفظة. قد يبدو الرصد عبر طرف ثالث رقابة امتثال، لا أداة لحلّ المشكلات بالشراكة. يتحمّل الباحثون المحليون وشركاء MERL مخاطر الخطوط الأمامية لكنهم يحتفظون بقدر ضئيل من ملكية البيانات والأدوات والقيمة طويلة الأجل. أدوات الذكاء الاصطناعي الناشئة هي في معظمها منتجات "صناديق سوداء" — يصعب الوثوق بها أو شرحها، وقلّما تُصمَّم مع وضع السياقات الهشّة في الحسبان.',
        },
        {
          text: 'النتيجة فجوة تتّسع بين ما يحتاجه صانعو القرار — أدلّة جديرة بالثقة، حسّاسة للنزاع، تصل في وقتها — وما تستطيع منظومات MERL الراهنة تقديمه بنيويًا.',
        },
      ],
    },
    response: {
      eyebrow: 'استجابة MERLx',
      headlinePrefix: 'رصد وتقييم معزّز بالذكاء الاصطناعي،',
      headlineEm: 'مرتكز محليًا',
      headlineSuffix: '.',
      paragraphs: [
        {
          text: 'تُبنى MERLx بوصفها ممارسة رصد وتقييم معزّزة بالذكاء الاصطناعي ومرتكزة محليًا، للمانحين والمنظمات متعددة الأطراف والمنظمات غير الحكومية الدولية ومنفّذي البرامج الذين يريدون إعادة هيكلة بنيتهم التحتية للأدلّة حول أربع حركات: تحليل في الوقت الفعلي وفهم للمخاطر المركّبة، وتنفيذ مرتكز محليًا، ومنهجية حسّاسة للنزاع، وجاهزية تشغيلية لا مجرّد أوراق مفاهيمية.',
        },
        {
          text: 'نمزج البنية التحليلية — مجموعة Optics: IRIS وAperture وPRISM وToC Tester وOASIS وECHO — بالبحث المرتكز محليًا وبالمنهجية الحسّاسة للنزاع. الذكاء الاصطناعي مكبّر لعمل المحلّلين والمقيّمين وفرق البرامج الذين يقومون أصلًا بهذا العمل. هو لا يحلّ محلّ حكمهم. قد تختصر مجريات العمل المعزّزة بالذكاء الاصطناعي زمن التركيب النوعي بنسبة 60–75% تقريبًا، فتُحرّر وقت الخبراء للتفسير والحوار بدل التشفير اليدوي.',
        },
        {
          text: 'التوطين ليس خطوة ترجمة في النهاية. إنه مُدمج في حزمة اللغة، وفي خيارات البنية التحتية، وفي حوكمة كلّ انخراط. نُصمّم الأدوات كي يستطيع المقرّبون من العمل تشغيلها بأنفسهم، ونرسي التنفيذ محليًا عبر تعاونيات شريكة تملك التحليل تحت حوكمتها الخاصة وبلغاتها. النتائج تخصّ فريق البلد. المقرّ لا يعيد كتابتها.',
        },
      ],
    },
    holdTo: {
      eyebrow: 'ما نتمسّك به',
      headlinePrefix: 'الميدان أوّلًا. الدليل قبل التجريد.',
      headlineEm: 'مفتوح. مسؤول',
      headlineSuffix: '.',
      paragraphs: [
        {
          strong: 'الميدان أوّلًا، لا المختبر.',
          text: ' الواقع البرامجي يفرض البنية. اتصال ضعيف، بنية تحتية محدودة، مستخدمون غير متخصّصين، بيانات صاخبة، انقطاع تيّار. يجب أن تعمل كلّ أداة لصالح ضابط برامج على حاسوب متواضع، أو محلّل في مكتب بلد مشترك خلف بوّابة شبكة محدودة. نُصمّم لاستخدام برامجي مستدام، لا لعروض المؤتمرات.',
        },
        {
          strong: 'الدليل قبل التجريد.',
          text: ' كلّ ناتج تحليلي قابل للتدقيق. تُظهر المصنّفات السمات التي قادت إلى القرار. التقارير السرديّة تستشهد بمؤشّراتها. نقد ToC Tester يستشهد بأدلّته. ندعم الحكم البشري؛ لا نحلّ محلّه.',
        },
        {
          strong: 'مفتوح ومتوافق.',
          text: ' معايير بيانات مفتوحة، وأرشيفات أقمار صناعية مفتوحة (Sentinel وLandsat وMODIS عبر Copernicus وPlanetary Computer)، ومكتبات تحليل مفتوحة المصدر، وواجهات برمجية معيارية. يملك العملاء بياناتهم ونسختهم. لا شيء في حزمتنا الأساسية مقفل برخصة.',
        },
        {
          strong: 'مسؤول افتراضيًا.',
          text: ' كلّ انخراط يبدأ بتقييم لأثر حماية البيانات. نلتزم بإرشادات IASC حول مسؤولية البيانات، وبمبادئ OECD-DAC للحسّاسية للنزاع، وبـ Core Humanitarian Standard. الموافقة المستنيرة، وبروتوكولات الإحالة عند الضيق والإزالة، موثّقة لكلّ نشر. مخرجات المصنّفات التي تطال أفرادًا بأسمائهم تمرّ بمراجعة بشرية قبل الإصدار. تنقيح المعلومات الشخصية مفعّل افتراضيًا. مكان إقامة البيانات ومدّة الاحتفاظ يحدّدهما العميل.',
        },
      ],
    },
  },
  history: {
    eyebrow: 'الأصول',
    headlinePrefix: 'ممارسة تعمل منذ',
    headlineEm: '2017',
    headlineSuffix: '، تحت اسم MERLx, S.L. اليوم.',
    lead:
      'MERLx, S.L. شركة استشارات رصد وتقييم وبحث وتعلّم مقرّها إسبانيا، أُسّست عام 2026 لإضفاء طابع رسمي على ممارسة استشارية كانت تعمل سابقًا باسم Slipström. الكادر الأساسي نفسه، والمنهجية نفسها، وعلاقات الشراكة نفسها — تحت شكل قانوني أوضح.',
    milestones: [
      {
        year: '2017',
        entity: 'DK · enkeltmandsvirksomhed',
        title: 'بداية ممارسة Slipström في الدنمارك',
        body: 'يبدأ العمل الاستشاري المستقلّ في كوبنهاغن بوصفه enkeltmandsvirksomhed دنماركية باسم Slipström. تبني السنوات الأولى الممارسة الأساسية: رصد وتقييم، تحليل نزاع، بحث، واستشارات مبنيّة على الأدلّة لشركاء التنمية الدولية والمساعدات الإنسانية.',
      },
      {
        year: '2021',
        entity: 'ES · autónoma · برشلونة',
        title: 'انتقال الممارسة إلى إسبانيا',
        body: 'ينتقل الاستشاري الأساسي إلى إسبانيا ويسجّل كـ autónoma في برشلونة، مع الاستمرار باسم Slipström. تتشكّل محفظة متنامية عبر شرق أفريقيا والشرق الأوسط، فتُوجَّه الممارسة نحو رصد وتقييم حسّاس للنزاع وتقييم مدعوم بالبيانات.',
      },
      {
        year: '2024',
        entity: 'NileX · نيروبي',
        title: 'تأسيس NileX كعقدة ارتكاز محلية',
        body: 'تتبلّر منطق بناء الشبكة بتأسيس NileX، وهي شركة رصد وتقييم وتحليل بيانات مستقلّة في نيروبي. صُمّمت NileX كعقدة ارتكاز محلية لتعزيز التقييم الحسّاس للنزاع والبحث وأنظمة الإنذار المبكر في المنطقة.',
      },
      {
        year: '2026',
        entity: 'NileX · السودان',
        title: 'NileX تتوسّع إلى السودان',
        body: 'تتوسّع الشبكة بتأسيس NileX في السودان، فتعمّق حضور الممارسة في سياقات الدول الهشّة وتعزّز قدرة عمليات MERL المرتكزة محليًا والمستندة إلى الحسّاسية للنزاع عبر ممرّ النيل.',
      },
      {
        year: '2026',
        entity: 'MERLx, S.L. · إسبانيا',
        title: 'أوّل عقدة رسمية في الشبكة',
        body: 'تُضفى الصفة الرسمية على الممارسة بتأسيس MERLx, S.L. في إسبانيا — شكل قانوني محدود المسؤولية يحمل سجلّ السنوات الثماني المتراكم تحت اسم Slipström. الكادر الأساسي نفسه، والمنهجية نفسها، وعلاقات الشراكة نفسها. من هنا فصاعدًا تعمل الممارسة بوصفها MERLx, S.L.، بصفتها مركز الثقل الاستراتيجي وأوّل عقدة رسمية في شبكة أوسع تضمّ NileX (نيروبي والسودان).',
      },
    ],
  },
};

const COPY = { en, ar, fr } as const;

export function aboutCopyFor(locale: string): AboutCopy {
  const key = (['en', 'ar', 'fr'].includes(locale) ? locale : 'en') as Locale;
  return COPY[key];
}
