/**
 * Foundry brand system — 10 independent visual directions sharing accessibility contracts.
 * These are conceptual design identities, NOT released product names or promised products.
 * A published app must own its design brief, components, content and legally cleared brand.
 */
export type ColorMode = 'light' | 'dark';
export type HeroComposition = 'roster' | 'orbit' | 'care' | 'nest' | 'canopy' | 'pet' | 'ledger' | 'archive' | 'tempo' | 'daylight';
export type Palette = Readonly<{canvas:string;surface:string;ink:string;muted:string;accent:string;onAccent:string;border:string;tint:string;onTint:string}>;
export type BrandTheme = Readonly<{
  id: string;
  name: string;
  audience: string;
  archetype: string;
  signature: string;
  hero: HeroComposition;
  density: 'compact' | 'balanced' | 'spacious';
  typography: {headlineSize:number;bodySize:number;tracking:number;family:'system'|'serif'|'rounded';weight:'700'|'800'};
  shape: {cardRadius:number;buttonRadius:number};
  copy: {eyebrow:string;headline:string;body:string;metric:string;metricLabel:string;primaryAction:string;secondaryLabel:string};
  colors: {light:Palette;dark:Palette};
  layout: string;
  motion: string;
  avoid: string;
}>;

/** Invariants: consistent spacing, minimum platform target sizes, reduced motion, and semantic color roles. */
export const FOUNDATIONS = {
  spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64],
  minTouchTarget: { ios: 44, android: 48 },
  layout: { mobileGutter: 20, wideMaxWidth: 720 },
  motion: { quickMs: 140, standardMs: 220, calmMs: 320, reducedMotionMs: 0 },
  minBodyFontSize: 16,
  minimumNormalTextContrast: 4.5,
} as const;

export const brandThemes: readonly BrandTheme[] = [
  {
    "id": "shift-calendar",
    "name": "Signal",
    "audience": "Shift workers & nurses",
    "archetype": "Precision editorial",
    "signature": "A confident timetable; cobalt on crisp paper.",
    "hero": "roster",
    "density": "compact",
    "typography": {
      "headlineSize": 36,
      "bodySize": 16,
      "tracking": -0.6,
      "family": "system",
      "weight": "800"
    },
    "shape": {
      "cardRadius": 10,
      "buttonRadius": 8
    },
    "copy": {
      "eyebrow": "YOUR ROSTER",
      "headline": "Know your next shift.",
      "body": "One glance, even between busy rounds.",
      "metric": "07:00",
      "metricLabel": "Monday · Early shift",
      "primaryAction": "Add shift",
      "secondaryLabel": "This week · 3 shifts"
    },
    "colors": {
      "light": {
        "canvas": "#F2F5FB",
        "surface": "#FFFFFF",
        "ink": "#101E34",
        "muted": "#40536B",
        "accent": "#2349A6",
        "onAccent": "#FFFFFF",
        "border": "#C6D2E3",
        "tint": "#E3EBFF",
        "onTint": "#1B397B"
      },
      "dark": {
        "canvas": "#0B1221",
        "surface": "#151F31",
        "ink": "#F5F7FA",
        "muted": "#B8C3D4",
        "accent": "#9DB9FF",
        "onAccent": "#121C30",
        "border": "#2D405C",
        "tint": "#202E49",
        "onTint": "#DCE6FF"
      }
    },
    "layout": "Time rail, fixed-width numerals, clear shift type labels, week view before charts.",
    "motion": "Instant acknowledgment; no playful bouncing.",
    "avoid": "Calendar heatmap without an explicit legend; excessive status colors."
  },
  {
    "id": "countdown-widget",
    "name": "Orbit",
    "audience": "People anticipating meaningful dates",
    "archetype": "Atmospheric minimal",
    "signature": "A single oversized number surrounded by quiet space.",
    "hero": "orbit",
    "density": "spacious",
    "typography": {
      "headlineSize": 50,
      "bodySize": 16,
      "tracking": -1.5,
      "family": "serif",
      "weight": "700"
    },
    "shape": {
      "cardRadius": 28,
      "buttonRadius": 24
    },
    "copy": {
      "eyebrow": "LOOKING FORWARD",
      "headline": "Moments worth waiting for.",
      "body": "Keep the next good thing close.",
      "metric": "24",
      "metricLabel": "days until our trip",
      "primaryAction": "New countdown",
      "secondaryLabel": "Saturday · 08:30"
    },
    "colors": {
      "light": {
        "canvas": "#F7F4FF",
        "surface": "#FFFFFF",
        "ink": "#211340",
        "muted": "#544570",
        "accent": "#653BAE",
        "onAccent": "#FFFFFF",
        "border": "#E2D9F0",
        "tint": "#EEE5FF",
        "onTint": "#4A227D"
      },
      "dark": {
        "canvas": "#170F2C",
        "surface": "#28193D",
        "ink": "#FAF6FF",
        "muted": "#CEC1E5",
        "accent": "#C9A4FF",
        "onAccent": "#211334",
        "border": "#493660",
        "tint": "#39274E",
        "onTint": "#F4DEFF"
      }
    },
    "layout": "One hero event; secondary events on a calm vertical timeline; widgets are primary canvas.",
    "motion": "Slow, subtle transitions for date change; respect reduced motion.",
    "avoid": "Fake glass effect under text; celebratory clutter for ordinary dates."
  },
  {
    "id": "medication-checklist",
    "name": "Clarity",
    "audience": "Adults managing daily medication with family support",
    "archetype": "Clinical calm",
    "signature": "A large, unambiguous completed/not-completed action.",
    "hero": "care",
    "density": "spacious",
    "typography": {
      "headlineSize": 34,
      "bodySize": 18,
      "tracking": -0.5,
      "family": "system",
      "weight": "700"
    },
    "shape": {
      "cardRadius": 16,
      "buttonRadius": 14
    },
    "copy": {
      "eyebrow": "TODAY'S ROUTINE",
      "headline": "One thing at a time.",
      "body": "A clear record, shared only when you choose.",
      "metric": "08:00",
      "metricLabel": "Morning dose · not yet logged",
      "primaryAction": "Mark as taken",
      "secondaryLabel": "Next reminder · 20:00"
    },
    "colors": {
      "light": {
        "canvas": "#F1F9F7",
        "surface": "#FFFFFF",
        "ink": "#0D3430",
        "muted": "#35635D",
        "accent": "#11675A",
        "onAccent": "#FFFFFF",
        "border": "#CCE6DF",
        "tint": "#DEF4EE",
        "onTint": "#15574D"
      },
      "dark": {
        "canvas": "#081F1D",
        "surface": "#12322F",
        "ink": "#EDFFFA",
        "muted": "#B0D9D0",
        "accent": "#92E6C9",
        "onAccent": "#08251F",
        "border": "#25564F",
        "tint": "#1A413B",
        "onTint": "#D3FFF0"
      }
    },
    "layout": "One medication card per dose; plain labels; separate action, dosage and history.",
    "motion": "Immediate, understated confirmations; undo available; never celebrate doses.",
    "avoid": "Medical efficacy claims; ambiguous status color; hidden medication name."
  },
  {
    "id": "baby-feeding-log",
    "name": "Nest",
    "audience": "Sleep-deprived new parents",
    "archetype": "Warm tactile",
    "signature": "Two soft, unmistakable one-thumb actions.",
    "hero": "nest",
    "density": "spacious",
    "typography": {
      "headlineSize": 36,
      "bodySize": 17,
      "tracking": -0.7,
      "family": "rounded",
      "weight": "700"
    },
    "shape": {
      "cardRadius": 26,
      "buttonRadius": 22
    },
    "copy": {
      "eyebrow": "LITTLE MOMENTS",
      "headline": "The days are full.",
      "body": "Save the details without leaving the moment.",
      "metric": "2h 15m",
      "metricLabel": "since last feeding",
      "primaryAction": "Log feeding",
      "secondaryLabel": "Last feed · 06:45"
    },
    "colors": {
      "light": {
        "canvas": "#FFF8F2",
        "surface": "#FFFFFF",
        "ink": "#4B2A33",
        "muted": "#75535D",
        "accent": "#A34755",
        "onAccent": "#FFFFFF",
        "border": "#F1DBDA",
        "tint": "#FFE6DA",
        "onTint": "#823A49"
      },
      "dark": {
        "canvas": "#29181E",
        "surface": "#39252B",
        "ink": "#FFF5F1",
        "muted": "#E6C6C8",
        "accent": "#FFA4A8",
        "onAccent": "#34191F",
        "border": "#63434B",
        "tint": "#50303A",
        "onTint": "#FFE5DF"
      }
    },
    "layout": "One-tap feeding and diaper controls at thumb reach; history is quiet.",
    "motion": "Soft 160ms feedback and undo; no bouncing that could wake a baby.",
    "avoid": "Pink/blue gender coding, cartoon clutter, judgemental parenting copy."
  },
  {
    "id": "plant-watering",
    "name": "Canopy",
    "audience": "Plant owners seeking a simple routine",
    "archetype": "Botanical editorial",
    "signature": "Organic cropping, spacious titles, earth-toned rhythm.",
    "hero": "canopy",
    "density": "balanced",
    "typography": {
      "headlineSize": 42,
      "bodySize": 16,
      "tracking": -0.8,
      "family": "serif",
      "weight": "700"
    },
    "shape": {
      "cardRadius": 22,
      "buttonRadius": 12
    },
    "copy": {
      "eyebrow": "YOUR GREEN CORNER",
      "headline": "Grow at your pace.",
      "body": "Small care, season after season.",
      "metric": "3",
      "metricLabel": "plants need water today",
      "primaryAction": "Log watering",
      "secondaryLabel": "Next: Monstera · today"
    },
    "colors": {
      "light": {
        "canvas": "#F6F8F0",
        "surface": "#FFFFFF",
        "ink": "#243729",
        "muted": "#526651",
        "accent": "#3D643B",
        "onAccent": "#FFFFFF",
        "border": "#D5E0D0",
        "tint": "#E6EEDF",
        "onTint": "#355331"
      },
      "dark": {
        "canvas": "#131F18",
        "surface": "#223028",
        "ink": "#F7FFF3",
        "muted": "#BDCEBA",
        "accent": "#B4DBA5",
        "onAccent": "#1B311F",
        "border": "#3A5042",
        "tint": "#2C4030",
        "onTint": "#E4F8DA"
      }
    },
    "layout": "Large plant photography with optional image placeholders; cadence grouped by today/upcoming.",
    "motion": "Slow botanical reveal only for informative transitions.",
    "avoid": "Overconfident care advice; fake plant-identification accuracy."
  },
  {
    "id": "pet-medication",
    "name": "Companion",
    "audience": "Pet owners managing recurring care",
    "archetype": "Friendly service",
    "signature": "Pet-first identity badge with reliable treatment timeline.",
    "hero": "pet",
    "density": "balanced",
    "typography": {
      "headlineSize": 37,
      "bodySize": 17,
      "tracking": -0.4,
      "family": "rounded",
      "weight": "700"
    },
    "shape": {
      "cardRadius": 20,
      "buttonRadius": 18
    },
    "copy": {
      "eyebrow": "FOR YOUR BEST FRIEND",
      "headline": "Care made simpler.",
      "body": "Never lose track of the little routines.",
      "metric": "Milo",
      "metricLabel": "Next treatment · 18:00",
      "primaryAction": "Record treatment",
      "secondaryLabel": "Every month · flea prevention"
    },
    "colors": {
      "light": {
        "canvas": "#FFF9EE",
        "surface": "#FFFFFF",
        "ink": "#2C2E40",
        "muted": "#55596B",
        "accent": "#815122",
        "onAccent": "#FFFFFF",
        "border": "#ECDDC4",
        "tint": "#FFE9C8",
        "onTint": "#754116"
      },
      "dark": {
        "canvas": "#1E1E28",
        "surface": "#302C35",
        "ink": "#FFFBF1",
        "muted": "#DACEC3",
        "accent": "#FFD091",
        "onAccent": "#32210F",
        "border": "#564B49",
        "tint": "#473827",
        "onTint": "#FFE7C7"
      }
    },
    "layout": "Pet identity and task status above details; choose pets without changing context accidentally.",
    "motion": "Quick confirmation and visible undo; avoid surprise sounds.",
    "avoid": "Cute illustrations that hide medicine name, dose or date."
  },
  {
    "id": "mileage-log",
    "name": "Ledger",
    "audience": "Freelancers who need reimbursement evidence",
    "archetype": "Technical premium",
    "signature": "Dense tabular numbers with sharp grid and acid-lime mark.",
    "hero": "ledger",
    "density": "compact",
    "typography": {
      "headlineSize": 40,
      "bodySize": 16,
      "tracking": -1.1,
      "family": "system",
      "weight": "800"
    },
    "shape": {
      "cardRadius": 8,
      "buttonRadius": 8
    },
    "copy": {
      "eyebrow": "TRIP LEDGER",
      "headline": "Every mile counts.",
      "body": "Turn travel into records you can trust.",
      "metric": "128.4",
      "metricLabel": "miles logged this week",
      "primaryAction": "Start trip",
      "secondaryLabel": "3 trips · $86.40 estimate"
    },
    "colors": {
      "light": {
        "canvas": "#F5F6F2",
        "surface": "#FFFFFF",
        "ink": "#1F2922",
        "muted": "#4D604D",
        "accent": "#425900",
        "onAccent": "#FFFFFF",
        "border": "#D7DEC9",
        "tint": "#EAF2CB",
        "onTint": "#425900"
      },
      "dark": {
        "canvas": "#101713",
        "surface": "#1D2920",
        "ink": "#F4FAEE",
        "muted": "#BFCEB8",
        "accent": "#D4F26C",
        "onAccent": "#263500",
        "border": "#415442",
        "tint": "#304133",
        "onTint": "#ECFFC8"
      }
    },
    "layout": "Numerals anchored to a fixed baseline; export visible; single clear recording status.",
    "motion": "Fast and utilitarian; never animate financial figures ambiguously.",
    "avoid": "Glossy finance charts, inaccurate expense/tax claims, hidden tracking permissions."
  },
  {
    "id": "warranty-tracker",
    "name": "Archive",
    "audience": "Households safeguarding purchases",
    "archetype": "Paper modernism",
    "signature": "A receipt-inspired editorial shelf, not a generic dashboard.",
    "hero": "archive",
    "density": "balanced",
    "typography": {
      "headlineSize": 41,
      "bodySize": 16,
      "tracking": -0.9,
      "family": "serif",
      "weight": "700"
    },
    "shape": {
      "cardRadius": 4,
      "buttonRadius": 6
    },
    "copy": {
      "eyebrow": "THE LITTLE ARCHIVE",
      "headline": "Keep what matters.",
      "body": "Receipts and warranties, easy to find.",
      "metric": "82",
      "metricLabel": "days of coverage remaining",
      "primaryAction": "Save a receipt",
      "secondaryLabel": "Camera and manual entry"
    },
    "colors": {
      "light": {
        "canvas": "#FBF7F0",
        "surface": "#FFFFFF",
        "ink": "#302820",
        "muted": "#65564C",
        "accent": "#A43422",
        "onAccent": "#FFFFFF",
        "border": "#E8D8C8",
        "tint": "#FCE5DA",
        "onTint": "#843021"
      },
      "dark": {
        "canvas": "#211B17",
        "surface": "#302720",
        "ink": "#FFF9F1",
        "muted": "#D5C5B6",
        "accent": "#FFA48C",
        "onAccent": "#3B1D17",
        "border": "#51463D",
        "tint": "#472E26",
        "onTint": "#FFE6D9"
      }
    },
    "layout": "Document cards with quiet reference numbers; expiration timeline like a ledger margin.",
    "motion": "Barely-there paper reveal; no faux-scanning progress.",
    "avoid": "Vintage visual effects that reduce legibility; uploading documents without consent."
  },
  {
    "id": "cleaning-schedule",
    "name": "Tempo",
    "audience": "People sharing household chores",
    "archetype": "Kinetic clarity",
    "signature": "Big progress number and cheerful, disciplined task rhythm.",
    "hero": "tempo",
    "density": "balanced",
    "typography": {
      "headlineSize": 40,
      "bodySize": 16,
      "tracking": -1,
      "family": "system",
      "weight": "800"
    },
    "shape": {
      "cardRadius": 16,
      "buttonRadius": 16
    },
    "copy": {
      "eyebrow": "FRESH START",
      "headline": "A little every day.",
      "body": "Make space for what you care about.",
      "metric": "3 / 5",
      "metricLabel": "tasks done today",
      "primaryAction": "Complete a task",
      "secondaryLabel": "Next · tidy kitchen"
    },
    "colors": {
      "light": {
        "canvas": "#F1FAFF",
        "surface": "#FFFFFF",
        "ink": "#122A3B",
        "muted": "#456579",
        "accent": "#075C87",
        "onAccent": "#FFFFFF",
        "border": "#D0E8F2",
        "tint": "#DAF4FF",
        "onTint": "#145475"
      },
      "dark": {
        "canvas": "#071F2D",
        "surface": "#123243",
        "ink": "#F0FAFF",
        "muted": "#BDD9E8",
        "accent": "#78D6FF",
        "onAccent": "#0C2B3F",
        "border": "#325466",
        "tint": "#204455",
        "onTint": "#E0F7FF"
      }
    },
    "layout": "Clear completed/remaining sections; next action first; flexible household roles.",
    "motion": "Crisp 140ms completion without confetti or coercive streaks.",
    "avoid": "Shaming language, compulsive notifications, punishment mechanics."
  },
  {
    "id": "elderly-routine",
    "name": "Daylight",
    "audience": "Older adults and caregivers",
    "archetype": "Dignified humanist",
    "signature": "Large type and simple chronological moments, not childlike UI.",
    "hero": "daylight",
    "density": "spacious",
    "typography": {
      "headlineSize": 38,
      "bodySize": 21,
      "tracking": -0.6,
      "family": "system",
      "weight": "700"
    },
    "shape": {
      "cardRadius": 14,
      "buttonRadius": 14
    },
    "copy": {
      "eyebrow": "GOOD MORNING",
      "headline": "Today, made gentle.",
      "body": "Your day, clear and comfortable.",
      "metric": "09:30",
      "metricLabel": "A short morning walk",
      "primaryAction": "Done for now",
      "secondaryLabel": "Later · call family"
    },
    "colors": {
      "light": {
        "canvas": "#F8F5EF",
        "surface": "#FFFFFF",
        "ink": "#2D2835",
        "muted": "#5D5667",
        "accent": "#4D3C80",
        "onAccent": "#FFFFFF",
        "border": "#DED5E3",
        "tint": "#EBE6F4",
        "onTint": "#403168"
      },
      "dark": {
        "canvas": "#1D1A25",
        "surface": "#2C2635",
        "ink": "#FDF9FF",
        "muted": "#DDD3E6",
        "accent": "#C8B2F0",
        "onAccent": "#261B40",
        "border": "#493F56",
        "tint": "#3D3050",
        "onTint": "#F0E4FF"
      }
    },
    "layout": "One task per focus section; clear next/previous; caregiver settings separate.",
    "motion": "No compulsory motion; never require timed gestures.",
    "avoid": "Childish motifs, hidden actions, color-only status, tiny tap targets."
  }
];

export function getBrandTheme(id: string): BrandTheme | undefined {
  return brandThemes.find((theme) => theme.id === id);
}

export function getPalette(theme: BrandTheme, mode: ColorMode): Palette {
  return theme.colors[mode];
}

/** WCAG sRGB contrast, useful for validating authored theme tokens in tests. */
export function contrastRatio(foreground: string, background: string): number {
  const luminance = (hex: string): number => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) throw new TypeError('Expected six-digit hex color');
    const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
    const linear = channels.map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
  };
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
