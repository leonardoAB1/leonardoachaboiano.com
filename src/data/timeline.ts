export interface TimelineEntry {
  date: string;
  role: string;
  org: string;
  location: string;
  coordinates: [number, number]; // [lat_deg, lng_deg]
  note?: string;
}

export const timelineEntries: TimelineEntry[] = [
  {
    date: "Aug 2025 - Present",
    role: "Robotics Engineer",
    org: "cryoWrite AG",
    location: "Basel, Switzerland",
    coordinates: [47.5596, 7.5886],
  },
  {
    date: "Feb - Jul 2025",
    role: "Robotics Intern",
    org: "cryoWrite AG",
    location: "Basel, Switzerland",
    coordinates: [47.5596, 7.5886],
  },
  {
    date: "Aug 2024 - Jan 2025",
    role: "Reliability Testing & Hardware Design Intern",
    org: "Lumiphase AG",
    location: "Stafa, Switzerland",
    coordinates: [47.2292, 8.73],
  },
  {
    date: "Jun - Jul 2024",
    role: "Hardware Engineer",
    org: "Mobi Latam",
    location: "Santa Cruz, Bolivia",
    coordinates: [-17.7833, -63.1821],
  },
  {
    date: "Jan - Jun 2024",
    role: "Hardware Engineer Intern",
    org: "Mobi Latam",
    location: "Santa Cruz, Bolivia",
    coordinates: [-17.7833, -63.1821],
  },
  {
    date: "2020 - 2024",
    role: "B.S. Mechatronics Engineering",
    org: "San Pablo Catholic University",
    location: "Santa Cruz, Bolivia",
    coordinates: [-17.7833, -63.1821],
    note: "GPA 3.7/4 - Graduated with Honours",
  },
];
