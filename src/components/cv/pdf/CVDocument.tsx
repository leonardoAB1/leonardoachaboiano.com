import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CVEntry {
  id: string;
  org: string;
  role: string;
  location: string;
  dateRange: string;
  bullets?: string[];
  note?: string;
}

export interface CVAchievement {
  label: string;
  date: string;
}

export interface CVLanguage {
  name: string;
  level: string;
}

export interface CVDocumentProps {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  githubAlt: string;
  summary: string;
  workEntries: CVEntry[];
  educationEntries: CVEntry[];
  achievements: CVAchievement[];
  languages: CVLanguage[];
  hardSkills: string[];
  softSkills: string[];
  photoDataUrl: string;
}

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

const TEAL = "#02777C";
const DARK = "#1a1a1a";
const GRAY = "#555555";
const RULE_COLOR = "#cccccc";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: DARK,
    paddingHorizontal: 36,
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: "#ffffff",
  },

  // --- Header ---
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 14,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: DARK,
    marginBottom: 2,
  },
  titleLine: {
    fontSize: 11,
    color: TEAL,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 2,
    alignItems: "center",
  },
  contactText: {
    fontSize: 8.5,
    color: DARK,
  },
  contactBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: TEAL,
  },
  contactSep: {
    fontSize: 8.5,
    color: GRAY,
    marginHorizontal: 3,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 4,
  },

  // --- Summary ---
  summaryRow: {
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: DARK,
  },

  // --- Horizontal rule between header and body ---
  pageRule: {
    borderBottomWidth: 0.75,
    borderBottomColor: RULE_COLOR,
    marginBottom: 4,
  },

  // --- Body (two columns) ---
  body: {
    flexDirection: "row",
    flex: 1,
  },
  leftCol: {
    flex: 1.38,
    paddingRight: 12,
    borderRightWidth: 0,
  },
  rightCol: {
    flex: 1,
    paddingLeft: 0,
  },

  // --- Section headers ---
  sectionHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: TEAL,
    marginTop: 6,
    marginBottom: 2,
  },
  sectionRule: {
    borderBottomWidth: 1,
    borderBottomColor: TEAL,
    marginBottom: 5,
  },

  // --- Work / Education entries ---
  entryRole: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: DARK,
    marginBottom: 1,
  },
  entryOrg: {
    fontSize: 9,
    color: DARK,
    marginBottom: 1,
  },
  entryMeta: {
    flexDirection: "row",
    marginBottom: 3,
    flexWrap: "wrap",
  },
  entryDate: {
    fontSize: 8.5,
    color: GRAY,
  },
  entryLocation: {
    fontSize: 8.5,
    color: GRAY,
    marginLeft: 4,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 2,
  },
  bulletDash: {
    fontSize: 8.5,
    marginRight: 4,
    color: DARK,
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.35,
    color: DARK,
  },
  entryNote: {
    fontSize: 8.5,
    color: GRAY,
    lineHeight: 1.35,
    marginBottom: 2,
    marginTop: 1,
  },
  entrySep: {
    borderBottomWidth: 0.5,
    borderBottomColor: RULE_COLOR,
    marginVertical: 5,
  },

  // Education specific
  eduDegreeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  eduDegree: {
    fontSize: 9,
    color: DARK,
    flex: 1,
  },
  eduYear: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: DARK,
  },
  eduOrgRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  eduOrg: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: DARK,
    flex: 1,
  },

  // --- Achievements ---
  achievementItem: {
    marginBottom: 4,
  },
  achievementLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: DARK,
    lineHeight: 1.3,
  },
  achievementDate: {
    fontSize: 8,
    color: GRAY,
  },

  // --- Languages ---
  languagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  languageItem: {
    width: "50%",
    fontSize: 8.5,
    color: DARK,
    marginBottom: 3,
  },

  // --- Skills ---
  skillsSection: {
    marginTop: 4,
  },
  skillLine: {
    fontSize: 8.5,
    lineHeight: 1.4,
    marginBottom: 2,
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Groups consecutive work entries with the same org so the company name only
// appears once per employer block, matching the original PDF layout.
interface OrgGroup {
  org: string;
  entries: CVEntry[];
}

function groupByOrg(entries: CVEntry[]): OrgGroup[] {
  const groups: OrgGroup[] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.org === entry.org) {
      last.entries.push(entry);
    } else {
      groups.push({ org: entry.org, entries: [entry] });
    }
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function WorkEntry({
  entry,
  showOrg,
  isLast,
}: {
  entry: CVEntry;
  showOrg: boolean;
  isLast: boolean;
}) {
  return (
    <View>
      <Text style={s.entryRole}>{entry.role}</Text>
      {showOrg && <Text style={s.entryOrg}>{entry.org}</Text>}
      <View style={s.entryMeta}>
        <Text style={s.entryDate}>{entry.dateRange}</Text>
        {entry.location ? (
          <Text style={s.entryLocation}>{"  ⬥  " + entry.location}</Text>
        ) : null}
      </View>
      {entry.bullets?.map((b, i) => (
        <View key={i} style={s.bulletRow}>
          <Text style={s.bulletDash}>-</Text>
          <Text style={s.bulletText}>{b}</Text>
        </View>
      ))}
      {entry.note
        ? entry.note.split("\n").map((line, i) => (
            <Text key={i} style={s.entryNote}>
              {line}
            </Text>
          ))
        : null}
      {!isLast && <View style={s.entrySep} />}
    </View>
  );
}

function EducationEntry({ entry }: { entry: CVEntry }) {
  const noteLines = entry.note ? entry.note.split("\n") : [];
  return (
    <View style={{ marginBottom: 6 }}>
      <View style={s.eduDegreeRow}>
        <Text style={s.eduDegree}>{entry.role}</Text>
        <Text style={s.eduYear}>{entry.dateRange}</Text>
      </View>
      <Text style={s.eduOrg}>{entry.org}</Text>
      <Text style={{ fontSize: 8.5, color: GRAY, marginBottom: 2 }}>
        {entry.location}
      </Text>
      {noteLines.map((line, i) => (
        <Text key={i} style={s.entryNote}>
          {line}
        </Text>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main document
// ---------------------------------------------------------------------------

export function CVDocument({
  name,
  title,
  email,
  phone,
  location,
  linkedin,
  github,
  githubAlt,
  summary,
  workEntries,
  educationEntries,
  achievements,
  languages,
  hardSkills,
  softSkills,
  photoDataUrl,
}: CVDocumentProps) {
  const orgGroups = groupByOrg(workEntries);
  const totalWorkGroups = orgGroups.length;

  // Strip "https://www." prefix for display
  const linkedinDisplay = linkedin.replace("https://www.", "").replace("https://", "");
  const githubDisplay = github.replace("https://", "");
  const githubAltDisplay = githubAlt.replace("https://", "");

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.name}>{name.toUpperCase()}</Text>
            <Text style={s.titleLine}>{title}</Text>

            {/* Contact row: email | phone | location */}
            <View style={s.contactRow}>
              <Text style={s.contactText}>{email}</Text>
              <Text style={s.contactSep}>{"  "}</Text>
              <Text style={s.contactText}>{phone}</Text>
              <Text style={s.contactSep}>{"  "}</Text>
              <Text style={s.contactText}>{location}</Text>
            </View>

            {/* LinkedIn + EU Nationality */}
            <View style={s.contactRow}>
              <Text style={s.contactBold}>{"LinkedIn: "}</Text>
              <Text style={s.contactText}>{linkedinDisplay}</Text>
              <Text style={s.contactSep}>{"    "}</Text>
              <Text style={s.contactBold}>{"EU Nationality (B permit)"}</Text>
            </View>

            {/* GitHub */}
            <View style={s.contactRow}>
              <Text style={s.contactBold}>{"Github: "}</Text>
              <Text style={s.contactText}>{githubDisplay}</Text>
            </View>
            <View style={s.contactRow}>
              <Text style={s.contactText}>{"        " + githubAltDisplay}</Text>
            </View>
          </View>

          <Image style={s.photo} src={photoDataUrl} />
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Summary                                                          */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.summaryRow}>
          <Text style={s.summaryText}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{"Summary: "}</Text>
            {summary}
          </Text>
        </View>

        <View style={s.pageRule} />

        {/* ---------------------------------------------------------------- */}
        {/* Two-column body                                                  */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.body}>
          {/* Left column: Work Experience */}
          <View style={s.leftCol}>
            <Text style={s.sectionHeader}>{"WORK EXPERIENCE"}</Text>
            <View style={s.sectionRule} />

            {orgGroups.map((group, groupIdx) => (
              <View key={group.org}>
                {group.entries.map((entry, entryIdx) => (
                  <WorkEntry
                    key={entry.id}
                    entry={entry}
                    showOrg={entryIdx === 0}
                    isLast={
                      groupIdx === totalWorkGroups - 1 &&
                      entryIdx === group.entries.length - 1
                    }
                  />
                ))}
                {groupIdx < totalWorkGroups - 1 && (
                  <View style={s.entrySep} />
                )}
              </View>
            ))}
          </View>

          {/* Right column: Education, Achievements, Languages */}
          <View style={s.rightCol}>
            {/* Education */}
            <Text style={s.sectionHeader}>{"EDUCATION"}</Text>
            <View style={s.sectionRule} />
            {educationEntries.map((entry) => (
              <EducationEntry key={entry.id} entry={entry} />
            ))}

            {/* Achievements */}
            <Text style={s.sectionHeader}>{"ACHIEVEMENTS"}</Text>
            <View style={s.sectionRule} />
            {achievements.map((a, i) => (
              <View key={i} style={s.achievementItem}>
                <Text style={s.achievementLabel}>
                  {a.label}
                </Text>
                <Text style={s.achievementDate}>{a.date}</Text>
              </View>
            ))}

            {/* Languages */}
            <Text style={s.sectionHeader}>{"LANGUAGES"}</Text>
            <View style={s.sectionRule} />
            <View style={s.languagesGrid}>
              {languages.map((lang) => (
                <Text key={lang.name} style={s.languageItem}>
                  {lang.name}{" "}
                  <Text style={{ color: GRAY }}>{"(" + lang.level + ")"}</Text>
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Skills (full-width footer)                                       */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.skillsSection}>
          <Text style={s.sectionHeader}>{"SKILLS"}</Text>
          <View style={s.sectionRule} />
          <Text style={s.skillLine}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {"Hard Skills: "}
            </Text>
            {hardSkills.join(", ")}
          </Text>
          <Text style={s.skillLine}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {"Soft Skills: "}
            </Text>
            {softSkills.join(", ")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
