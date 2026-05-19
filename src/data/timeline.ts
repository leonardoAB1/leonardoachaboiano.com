export type TimelineEntryType = "work" | "education" | "exchange";

export interface TimelineEntry {
  dateRange: string;
  role: string;
  org: string;
  location: string;
  coordinates: [number, number]; // [lat_deg, lng_deg]
  type?: TimelineEntryType;
  note?: string;
  bullets?: readonly string[];
  cvVisible?: boolean; // false = exclude from CV page (default: true)
}

export const timelineEntries: TimelineEntry[] = [
  {
    dateRange: "Aug 2025 - Present",
    role: "Robotics Engineer",
    org: "cryoWrite AG",
    location: "Basel, Switzerland",
    coordinates: [47.5596, 7.5886],
    type: "work",
    bullets: [
      "Developing and maintaining ROS2 robotic systems with concurrent actions and hardware integration",
      "On-site system installation, servicing, and preventive maintenance for deployed client systems",
    ],
  },
  {
    dateRange: "Feb - Jul 2025",
    role: "Robotics Intern",
    org: "cryoWrite AG",
    location: "Basel, Switzerland",
    coordinates: [47.5596, 7.5886],
    type: "work",
    bullets: [
      "Spearheaded company-wide documentation strategy in Confluence for internal knowledge sharing",
    ],
  },
  {
    dateRange: "Aug 2024 - Jan 2025",
    role: "Reliability Testing & Hardware Design Intern",
    org: "Lumiphase AG",
    location: "Stafa, Switzerland",
    coordinates: [47.2292, 8.73],
    type: "work",
    bullets: [
      "Implemented new test methods: instrument selection, integration, and measurement routine coding",
      "Designed PCBs for sample fixation and electrical routing",
      "Lab operations: instrument setup, hardware installation, calibration routine development",
    ],
  },
  {
    dateRange: "Jun - Jul 2024",
    role: "Hardware Engineer",
    org: "Mobi Latam",
    location: "Santa Cruz, Bolivia",
    coordinates: [-17.7833, -63.1821],
    type: "work",
    bullets: [
      "Integrated MQTT and CAN-based IoT batteries into existing workflow via APIs",
      "Designed and prototyped solenoid actuators and control PCB for electric motorcycle battery security",
      "Product development and logistics coordination with Chinese business partners",
    ],
  },
  {
    dateRange: "Jan - Jun 2024",
    role: "Hardware Engineer Intern",
    org: "Mobi Latam",
    location: "Santa Cruz, Bolivia",
    coordinates: [-17.7833, -63.1821],
    type: "work",
  },
  {
    dateRange: "Mar - May 2023",
    role: "Mechanical Design Intern",
    org: "Reality HC",
    location: "Santa Cruz, Bolivia",
    coordinates: [-17.7833, -63.1821],
    type: "work",
  },
  {
    dateRange: "Feb 2020 - Aug 2024",
    role: "B.S. Mechatronics Engineering",
    org: "San Pablo Bolivian Catholic University",
    location: "Santa Cruz, Bolivia",
    coordinates: [-17.7833, -63.1821],
    type: "education",
    note: "GPA 3.7/4 - Graduated with Honours - President of the Scientific Society (2023-2024)",
  },
  {
    dateRange: "2018 - 2019",
    role: "Exchange Student",
    org: "Rotary Youth Exchange",
    location: "Kamloops, BC, Canada",
    coordinates: [50.6745, -120.3273],
    type: "exchange",
    note: "Rotary Youth Exchange Ambassador",
    cvVisible: false,
  },
  {
    dateRange: "Feb 2006 - Dec 2019",
    role: "Primary & Secondary Education",
    org: "Colegio La Salle",
    location: "Santa Cruz, Bolivia",
    coordinates: [-17.7833, -63.1821],
    type: "education",
    cvVisible: false,
  },
];
