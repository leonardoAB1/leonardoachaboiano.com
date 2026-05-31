export type TimelineEntryType = "work" | "education" | "exchange";

// A point in time. month is 1-12 and omitted for year-only ranges (e.g. the
// Rotary exchange "2018 - 2019"). Storing structured dates - rather than a
// pre-formatted "Aug 2025 - Present" string - lets us render month names in the
// active locale via Intl. See @/lib/format-date-range.
export interface DateMark {
  year: number;
  month?: number;
}

export type TimelineDate = DateMark | "present";

// Structural, locale-agnostic data for each timeline entry. Translatable text
// (role, location, note, bullets) lives in messages under Timeline.entries.<id>
// and is merged in at render time keyed by `id`. Proper nouns (org names) and
// geometry (coordinates) stay here because they do not translate.
export interface TimelineEntry {
  id: string;
  org: string;
  website?: string;
  orgSubtitle?: string;
  orgSubtitleWebsite?: string;
  coordinates: [number, number]; // [lat_deg, lng_deg]
  start: DateMark;
  end: TimelineDate;
  type?: TimelineEntryType;
  cvVisible?: boolean; // false = exclude from CV page (default: true)
}

export const timelineEntries: TimelineEntry[] = [
  {
    id: "cryowriteEngineer",
    org: "cryoWrite AG",
    website: "https://www.cryowrite.ch",
    coordinates: [47.5596, 7.5886],
    start: { year: 2025, month: 8 },
    end: "present",
    type: "work",
  },
  {
    id: "cryowriteIntern",
    org: "cryoWrite AG",
    website: "https://www.cryowrite.ch",
    coordinates: [47.5596, 7.5886],
    start: { year: 2025, month: 2 },
    end: { year: 2025, month: 7 },
    type: "work",
  },
  {
    id: "lumiphase",
    org: "Lumiphase AG",
    website: "https://www.lumiphase.com",
    coordinates: [47.2292, 8.73],
    start: { year: 2024, month: 8 },
    end: { year: 2025, month: 1 },
    type: "work",
  },
  {
    id: "mobiEngineer",
    org: "Mobi Latam",
    website: "https://www.mobi.lat",
    coordinates: [-17.7833, -63.1821],
    start: { year: 2024, month: 6 },
    end: { year: 2024, month: 7 },
    type: "work",
  },
  {
    id: "mobiIntern",
    org: "Mobi Latam",
    website: "https://www.mobi.lat",
    coordinates: [-17.7833, -63.1821],
    start: { year: 2024, month: 1 },
    end: { year: 2024, month: 6 },
    type: "work",
  },
  {
    id: "realityHc",
    org: "Reality Herramientas Creativas",
    website: "https://realityherramientascreativas.com",
    coordinates: [-17.7833, -63.1821],
    start: { year: 2023, month: 3 },
    end: { year: 2023, month: 5 },
    type: "work",
  },
  {
    id: "ucbMechatronics",
    org: "San Pablo Bolivian Catholic University",
    website: "https://scz.ucb.edu.bo",
    coordinates: [-17.7833, -63.1821],
    start: { year: 2020, month: 2 },
    end: { year: 2024, month: 8 },
    type: "education",
  },
  {
    id: "rotaryExchange",
    org: "Rotary Youth Exchange",
    website: "https://www.rotary.org/en/our-programs/youth-exchanges",
    orgSubtitle: "South Kamloops Secondary School",
    orgSubtitleWebsite: "https://www.sd73.bc.ca/skss",
    coordinates: [50.6745, -120.3273],
    start: { year: 2018, month: 8 },
    end: { year: 2019, month: 7 },
    type: "exchange",
    cvVisible: false,
  },
  {
    id: "laSalle",
    org: "Colegio La Salle",
    website: "https://www.facebook.com/p/Colegio-La-Salle-Santa-Cruz-Particular-100057245988246",
    coordinates: [-17.7833, -63.1821],
    start: { year: 2006, month: 2 },
    end: { year: 2019, month: 12 },
    type: "education",
    cvVisible: false,
  },
];
