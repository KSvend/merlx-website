/**
 * Per-tool authoritative profiles, sourced from the MERLx Company
 * Profile (v2026.04). Used by /optics/[slug] when the Payload doc
 * lacks rich body / screenshots. The Payload doc supplies status,
 * order, and any localised overrides; this file supplies the
 * canonical English narrative + in-repo screenshots.
 */

export interface OpticsScreenshot {
  src: string;
  caption: string;
  /** "wide" spans the full preview column; "half" sits side-by-side. */
  width?: 'wide' | 'half';
}

export interface OpticsToolProfile {
  slug: string;
  letter: string;
  /** Long form of the acronym, shown above the tool name. */
  longName: string;
  tagline: string;
  /** One- or two-sentence summary that runs as the lead. */
  summary: string;
  domains: string[];
  capabilities: string[];
  builtOn: string[];
  /** NDA / scope footnote, italic. */
  note?: string;
  screenshots: OpticsScreenshot[];
  metrics?: { label: string; value: string }[];
}

export const OPTICS_TOOL_PROFILES: Record<string, OpticsToolProfile> = {
  iris: {
    slug: 'iris',
    letter: 'I',
    longName: 'Information Risk Intelligence System',
    tagline: 'Information risk intelligence.',
    summary:
      'Automated monitoring and classification of hate speech, disinformation and violent-extremism narratives across social media and online platforms. Analysts get a map-based timeline and a chat assistant for triage.',
    domains: ['Conflict monitoring', 'Social media', 'Machine learning', 'Multilingual'],
    capabilities: [
      'Four fine-tuned classifiers across East African hate-speech and polarisation use cases',
      'Multilingual: Arabic, Somali, English, Swahili, Amharic, Oromo, Tigrinya, Kinyarwanda and growing',
      'Runs on standard CPU infrastructure. No GPU needed for day-to-day inference',
      'PII redaction on by default',
      'Narrative-family timelines with P1 (critical) to P4 (low) triage',
      'Built-in analyst chat for narrative search and briefing support',
    ],
    builtOn: ['Python', 'HuggingFace Transformers', 'XLM-RoBERTa', 'Next.js', 'Supabase', 'D3.js'],
    note: 'Classifier performance per language, model cards and annotation protocol available under NDA.',
    metrics: [
      { label: 'Posts indexed', value: '80,714' },
      { label: 'Narrative families', value: '15' },
    ],
    screenshots: [
      {
        src: '/screenshots/iris_events.png',
        caption: 'East Africa disorder and hate-speech monitor: map and event timeline',
        width: 'wide',
      },
      {
        src: '/screenshots/iris_analyst.png',
        caption: 'Analyst chat and narrative-family triage panel',
        width: 'wide',
      },
    ],
  },
  prism: {
    slug: 'prism',
    letter: 'P',
    longName: 'Predictive Risk Intelligence and Simulation Modelling',
    tagline: 'Compound risk and forecasting.',
    summary:
      'A compound-risk platform that brings conflict, socioeconomic, environmental, health and coping-capacity data onto a single spatial grid. Forecasts and narrative summaries are generated on top.',
    domains: ['Early warning', 'Conflict analysis', 'Machine learning', 'Geospatial'],
    capabilities: [
      'Conflict and security: ACLED events, armed-actor ontology',
      'Socioeconomic: WFP food prices, livelihood stress',
      'Environmental: vegetation, evapotranspiration, floods, fires',
      'Health and epidemic: IPC phases, outbreak feeds',
      'Coping capacity: INFORM indices, governance',
    ],
    builtOn: [
      'Python',
      'FastAPI',
      'PostgreSQL / PostGIS',
      'Neo4j',
      'Machine learning ensembles',
      'Claude',
      'Next.js',
      'MapLibre',
    ],
    note: 'Forecast horizon, skill scores against baseline, and model documentation available under NDA.',
    screenshots: [
      {
        src: '/screenshots/prism_map.png',
        caption: 'PRISM · compound risk across Sudan and the Horn of Africa with cell-level detail',
        width: 'wide',
      },
      {
        src: '/screenshots/prism_detail.png',
        caption: 'Cell drill-down: dimensional scores and active conflict systems',
        width: 'wide',
      },
    ],
  },
  aperture: {
    slug: 'aperture',
    letter: 'A',
    longName: 'Satellite and earth observation',
    tagline: 'Satellite analysis for non-specialists.',
    summary:
      "Satellite analysis for programme teams who don't run a GIS. Click a location, set a date range, and get an environmental and situational read back as a PDF report.",
    domains: ['Remote sensing', 'Field verification', 'Programme monitoring'],
    capabilities: [
      'Vegetation (NDVI): cropland productivity, green-cover change',
      'Surface water (MNDWI): flood extent, reservoir change',
      'Built-up area (NDBI): settlement expansion, displacement sites',
      'Radar backscatter (SAR): all-weather structural change',
      'Fire activity: active fires and burn scars from FIRMS / VIIRS',
    ],
    builtOn: ['Python', 'FastAPI', 'Copernicus openEO', 'rasterio', 'geopandas', 'Claude'],
    note: 'HuggingFace Spaces is used for demo and beta access. Production engagements deploy on client-nominated infrastructure.',
    screenshots: [
      {
        src: '/screenshots/gezira_ndvi.png',
        caption:
          'NDVI change product · Gezira Wad Madani · baseline, conflict-period and difference · Sentinel-2',
        width: 'wide',
      },
      {
        src: '/screenshots/aperture_define.png',
        caption: 'Click-to-place area of interest · 250 km² over Khartoum',
        width: 'half',
      },
    ],
  },
  'toc-tester': {
    slug: 'toc-tester',
    letter: 'T',
    longName: 'Programme design and testing',
    tagline: 'Theory of change, run as a simulation.',
    summary:
      "A simulation engine and AI critic for Theories of Change. Build a causal map, run scenarios, and get critique anchored in your project's own evidence before the design is locked.",
    domains: ['Programme design', 'Theory of Change', 'Evaluation'],
    capabilities: [
      'Causal simulation via Fuzzy Cognitive Mapping. You can run the theory, not just draw it',
      'Unintended consequences as a first-class node type',
      'Critical Friend: AI critique anchored in a project-specific evidence corpus',
      'Scenario testing: clamp an assumption and see how the impact cascades',
      'Sensitivity analysis across all causal edges',
      'Workshop-grade UI with auto-layout, undo/redo and a presentation mode',
    ],
    builtOn: [
      'Next.js',
      'React Flow',
      'FastAPI',
      'NumPy FCM engine',
      'Supabase',
      'ChromaDB',
      'Claude',
    ],
    screenshots: [
      {
        src: '/screenshots/toc_canvas.jpg',
        caption:
          'Workshop canvas with the Critical Friend panel generating unintended consequences',
        width: 'wide',
      },
    ],
  },
  oasis: {
    slug: 'oasis',
    letter: 'O',
    longName: 'Open Atlas for Sudan Infrastructure and Services',
    tagline: 'Where to go first, ranked.',
    summary:
      'Geospatial infrastructure for post-conflict recovery planning. OASIS pulls in facility, activity, displacement and response data, scores coverage gaps on a hex grid, and ranks where programme planners should go first.',
    domains: ['Humanitarian mapping', 'Recovery planning', 'Geospatial'],
    capabilities: [
      'Ingests facility, activity, displacement and response data from open humanitarian sources and client feeds',
      'Deduplicates facility records across sources and scores them against configurable need profiles',
      'Distance-decay coverage scoring on an H3 hex grid, ranked to a priority list of where to go first',
      "Admin-level rollups and spatial joins to any country's COD-AB boundaries",
      'CSV and GeoJSON exports for direct use in QGIS, ArcGIS and downstream dashboards',
    ],
    builtOn: [
      'Python',
      'FastAPI',
      'PostgreSQL / PostGIS',
      'GraphQL',
      'Next.js',
      'MapLibre',
      'deck.gl',
    ],
    screenshots: [
      {
        src: '/screenshots/oasis_map.png',
        caption: 'Country view: facility density and population layer across Sudan',
        width: 'half',
      },
      {
        src: '/screenshots/oasis_dashboard.png',
        caption: 'Priority dashboard: ranked gaps with state-level drill-down',
        width: 'half',
      },
    ],
  },
  echo: {
    slug: 'echo',
    letter: 'E',
    longName: 'Offline field data collection',
    tagline: 'Offline-first AI for field interviews.',
    summary:
      'An AI assistant that runs entirely on the phone. No cloud call at interview time. Built for Khartoum without power, South Kordofan without 3G, and reception centres where no data can leave the device.',
    domains: ['Field research', 'Qualitative data', 'Offline AI'],
    capabilities: [
      'AI-augmented enumerators: live probing, clarification and gap-spotting suggestions during the interview itself',
      'On-device speech transcription in real time',
      'On-device language model for suggestions and follow-up probes',
      'Dynamic form evaluation with a built-in expression engine',
      'Pluggable model registry for English and multilingual stacks',
    ],
    builtOn: ['Kotlin and Jetpack Compose', 'whisper.cpp', 'llama.cpp', 'ONNX Runtime', 'SQLite'],
    screenshots: [
      {
        src: '/screenshots/echo_home.png',
        caption: 'Home · study packs',
        width: 'half',
      },
      {
        src: '/screenshots/echo_interview.png',
        caption: 'Live transcript on-device',
        width: 'half',
      },
      {
        src: '/screenshots/echo_assist.png',
        caption: 'AI assistant: follow-up probes',
        width: 'half',
      },
    ],
  },
};

export const OPTICS_ACCENT_BY_SLUG: Record<string, string> = {
  iris: 'var(--iris)',
  prism: 'var(--ember)',
  aperture: 'var(--deep-teal)',
  'toc-tester': 'var(--deep-iris)',
  oasis: 'var(--sand-dark)',
  echo: 'var(--deep-teal)',
};
