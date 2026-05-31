import {
  Circle,
  Document,
  Font,
  G,
  Image,
  Link,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ReactElement } from "react";

// Disable automatic word hyphenation so words always wrap whole, never split.
Font.registerHyphenationCallback((word) => [word]);

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
  description?: string;
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
  website: string;
  linkedin: string;
  github: string;
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
const ICON_SIZE = 9;

// ---------------------------------------------------------------------------
// Brand SVG icons
// ---------------------------------------------------------------------------

function EmailIcon() {
  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      style={{ marginRight: 2 }}
    >
      {/* Envelope body outline */}
      <Rect
        x="0.5"
        y="3"
        width="15"
        height="10"
        fill="none"
        stroke={TEAL}
        strokeWidth="1.2"
      />
      {/* Envelope fold (V-line) */}
      <Path
        d="M0.5 3.5 L8 9 L15.5 3.5"
        fill="none"
        stroke={TEAL}
        strokeWidth="1.2"
      />
    </Svg>
  );
}

function WhatsAppIcon() {
  // Official WhatsApp icon mark — green bubble + phone handset
  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      style={{ marginRight: 2 }}
    >
      <Path
        d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
        fill={TEAL}
      />
    </Svg>
  );
}

function LinkedInIcon() {
  // Official LinkedIn mark
  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 24 24"
      style={{ marginRight: 2 }}
    >
      <Path
        d="M19 0H5C2.239 0 0 2.239 0 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z"
        fill={TEAL}
      />
    </Svg>
  );
}

function GitHubIcon() {
  // Official GitHub mark (Invertocat)
  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      style={{ marginRight: 2 }}
    >
      <G>
        <Circle cx="8" cy="8" r="8" fill={TEAL} />
        <Path
          d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8c0 2.87 1.86 5.3 4.44 6.16.32.06.44-.14.44-.31 0-.15-.01-.66-.01-1.21-1.62.3-2.05-.4-2.18-.76-.07-.19-.39-.76-.67-.92-.23-.12-.55-.42-.01-.43.51-.01.87.47 1 .66.58.98 1.52.7 1.89.53.06-.42.23-.7.41-.86-1.45-.16-2.96-.72-2.96-3.21 0-.71.25-1.29.66-1.74-.06-.16-.29-.82.06-1.72 0 0 .54-.17 1.78.66a6.18 6.18 0 0 1 1.62-.22c.55 0 1.1.07 1.62.22 1.24-.84 1.78-.66 1.78-.66.35.9.13 1.56.06 1.72.41.45.66 1.02.66 1.74 0 2.49-1.52 3.05-2.96 3.21.23.2.44.6.44 1.2 0 .87-.01 1.57-.01 1.78 0 .17.12.37.44.31A6.54 6.54 0 0 0 14.5 8c0-3.59-2.91-6.5-6.5-6.5z"
          fill="white"
        />
      </G>
    </Svg>
  );
}

function LocationIcon() {
  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      style={{ marginRight: 2 }}
    >
      {/* Teardrop pin body */}
      <Path
        d="M8 1C5.24 1 3 3.24 3 6C3 9.75 8 15 8 15S13 9.75 13 6C13 3.24 10.76 1 8 1Z"
        fill={TEAL}
      />
      {/* White centre dot */}
      <Circle cx="8" cy="6" r="2" fill="white" />
    </Svg>
  );
}

function WebIcon() {
  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      style={{ marginRight: 2 }}
    >
      <Circle cx="8" cy="8" r="7" fill="none" stroke={TEAL} strokeWidth="1.2" />
      {/* Vertical ellipse (meridian) */}
      <Path
        d="M8 1 Q5 8 8 15 Q11 8 8 1"
        fill="none"
        stroke={TEAL}
        strokeWidth="1.2"
      />
      {/* Horizontal lines (parallels) */}
      <Path d="M1.5 8 L14.5 8" fill="none" stroke={TEAL} strokeWidth="1.2" />
      <Path
        d="M2.5 5 Q8 6.5 13.5 5"
        fill="none"
        stroke={TEAL}
        strokeWidth="1.0"
      />
      <Path
        d="M2.5 11 Q8 9.5 13.5 11"
        fill="none"
        stroke={TEAL}
        strokeWidth="1.0"
      />
    </Svg>
  );
}

function EUIcon() {
  // 12 stars arranged in a circle, matching the EU flag emblem.
  // Teal background + white stars to stay consistent with the CV colour theme.
  const R = 4.2; // orbit radius
  const CX = 8;
  const CY = 8;
  const starPositions = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    return [CX + R * Math.cos(angle), CY + R * Math.sin(angle)] as const;
  });
  return (
    <Svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 16 16"
      style={{ marginRight: 2 }}
    >
      <Circle cx={CX} cy={CY} r="7.5" fill={TEAL} />
      {starPositions.map(([cx, cy]) => (
        <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.9" fill="white" />
      ))}
    </Svg>
  );
}

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
    paddingBottom: 22,
    backgroundColor: "#ffffff",
  },

  // --- Header ---
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: TEAL,
    marginBottom: 1,
  },
  titleLine: {
    fontSize: 11,
    color: TEAL,
    marginBottom: 2,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
    alignItems: "center",
  },
  contactTeal: {
    fontSize: 9,
    color: TEAL,
  },
  contactBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: TEAL,
  },
  contactSep: {
    fontSize: 8.5,
    color: GRAY,
    marginHorizontal: 2,
  },
  photo: {
    width: 80,
    height: 80,
    objectFit: "contain",
  },

  // --- Summary ---
  summaryRow: {
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: DARK,
  },

  // --- Horizontal rule between header and body ---
  pageRule: {
    borderBottomWidth: 0.75,
    borderBottomColor: RULE_COLOR,
    marginBottom: 6,
  },

  // --- Body (two columns) ---
  body: {
    flexDirection: "row",
  },
  leftCol: {
    flex: 1.3,
    paddingRight: 10,
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
    marginBottom: 1,
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
    marginBottom: 0,
  },
  entryOrg: {
    fontSize: 9.5,
    color: DARK,
    marginBottom: 0,
  },
  entryMeta: {
    flexDirection: "row",
    marginBottom: 3,
    flexWrap: "wrap",
    alignItems: "center",
  },
  entryDate: {
    fontSize: 9,
    color: GRAY,
  },
  entryLocation: {
    fontSize: 9,
    color: GRAY,
    marginLeft: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 2,
  },
  bulletDash: {
    fontSize: 9,
    marginRight: 3,
    color: DARK,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: DARK,
  },
  entryNote: {
    fontSize: 9,
    color: GRAY,
    lineHeight: 1.4,
    marginBottom: 3,
    marginTop: 1,
  },
  entrySep: {
    height: 0.75,
    backgroundColor: RULE_COLOR,
    marginVertical: 6,
  },

  // Education specific
  eduDegreeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  eduDegree: {
    fontSize: 9.5,
    color: DARK,
    flex: 1,
  },
  eduYear: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: DARK,
  },
  eduOrgRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  eduOrg: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: DARK,
    flex: 1,
  },
  eduGpa: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: DARK,
    flexShrink: 0,
  },

  // --- Achievements ---
  achievementItem: {
    marginBottom: 4,
  },
  achievementLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: DARK,
    lineHeight: 1.35,
  },
  achievementDesc: {
    fontSize: 9,
    color: DARK,
    lineHeight: 1.35,
    marginBottom: 1,
  },

  // --- Languages ---
  languagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  languageItem: {
    width: "50%",
    fontSize: 9,
    color: DARK,
    marginBottom: 3,
  },

  // --- Skills ---
  skillsSection: {
    marginTop: 12,
  },
  skillLine: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 2,
  },
});

// ---------------------------------------------------------------------------
// Inline bold renderer
// ---------------------------------------------------------------------------

// Parses **word** markers in i18n strings and renders them as Helvetica-Bold
// inline segments, matching the original PDF's bold usage for key terms.
function parseBold(text: string): ReactElement[] {
  return text.split(/(\*\*.*?\*\*)/g).map((part) => {
    const isBold = part.startsWith("**") && part.endsWith("**");
    const content = isBold ? part.slice(2, -2) : part;
    return (
      <Text
        key={content}
        style={isBold ? { fontFamily: "Helvetica-Bold" } : undefined}
      >
        {content}
      </Text>
    );
  });
}

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
  showSepAfter,
}: {
  entry: CVEntry;
  showOrg: boolean;
  showSepAfter: boolean;
}) {
  return (
    <View>
      <Text style={s.entryRole}>{entry.role}</Text>
      {showOrg && <Text style={s.entryOrg}>{entry.org}</Text>}
      <View style={s.entryMeta}>
        <Text style={s.entryDate}>{entry.dateRange}</Text>
        {entry.location ? (
          <Text style={s.entryLocation}>
            <Text style={{ color: TEAL }}>{"  •  "}</Text>
            {entry.location}
          </Text>
        ) : null}
      </View>
      {entry.bullets?.map((b) => (
        <View key={b} style={s.bulletRow}>
          <Text style={s.bulletDash}>{"-"}</Text>
          <Text style={s.bulletText}>{parseBold(b)}</Text>
        </View>
      ))}
      {entry.note
        ? entry.note.split("\n").map((line) => {
            // Auto-link bare URLs (e.g. "Work GitHub: github.com/...") so
            // they remain clickable without needing a separate data field.
            const urlPat = /(https?:\/\/\S+|[\w-]+\.[\w.-]+\/\S+)/;
            const match = urlPat.exec(line);
            if (match) {
              const href = match[0].startsWith("http")
                ? match[0]
                : `https://${match[0]}`;
              const before = line.slice(0, match.index);
              const after = line.slice(match.index + match[0].length);
              return (
                <Text key={line} style={s.entryNote}>
                  {before}
                  <Link style={{ textDecoration: "none" }} src={href}>
                    <Text style={{ color: TEAL }}>{match[0]}</Text>
                  </Link>
                  {after}
                </Text>
              );
            }
            return (
              <Text key={line} style={s.entryNote}>
                {line}
              </Text>
            );
          })
        : null}
      {showSepAfter && <View style={s.entrySep} />}
    </View>
  );
}

function EducationEntry({ entry }: { entry: CVEntry }) {
  const noteLines = entry.note ? entry.note.split("\n") : [];
  // First line starting with "GPA" is shown right-aligned next to the org name,
  // matching the layout of the original PDF.
  const gpaLine =
    noteLines.length > 0 && noteLines[0].startsWith("GPA")
      ? noteLines[0]
      : null;
  const bodyNotes = gpaLine ? noteLines.slice(1) : noteLines;

  return (
    <View style={{ marginBottom: 6 }}>
      <View style={s.eduDegreeRow}>
        <Text style={s.eduDegree}>{entry.role}</Text>
        <Text style={s.eduYear}>{entry.dateRange}</Text>
      </View>
      <View style={s.eduOrgRow}>
        <Text style={s.eduOrg}>{entry.org}</Text>
        {gpaLine ? <Text style={s.eduGpa}>{gpaLine}</Text> : null}
      </View>
      <Text style={{ fontSize: 8.5, color: GRAY, marginBottom: 2 }}>
        {entry.location}
      </Text>
      {bodyNotes.map((line) => (
        <Text key={line} style={s.entryNote}>
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
  website,
  linkedin,
  github,
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

  // Strip "https://www." prefix for display
  const linkedinDisplay = linkedin
    .replace("https://www.", "")
    .replace("https://", "");
  const githubDisplay = github.replace("https://", "");
  const websiteDisplay = website.replace("https://", "").replace("http://", "");

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

            {/* Row 1: email  |  phone */}
            <View style={s.contactRow}>
              <EmailIcon />
              <Link style={{ textDecoration: "none" }} src={`mailto:${email}`}>
                <Text style={s.contactTeal}>{email}</Text>
              </Link>
              <Text style={s.contactSep}>{"  •  "}</Text>
              <WhatsAppIcon />
              <Link
                style={{ textDecoration: "none" }}
                src={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
              >
                <Text style={s.contactTeal}>{phone}</Text>
              </Link>
            </View>

            {/* Row 2: LinkedIn  |  GitHub  |  Website */}
            <View style={s.contactRow}>
              <LinkedInIcon />
              <Link style={{ textDecoration: "none" }} src={linkedin}>
                <Text style={s.contactBold}>{linkedinDisplay}</Text>
              </Link>
              <Text style={s.contactSep}>{"  •  "}</Text>
              <GitHubIcon />
              <Link style={{ textDecoration: "none" }} src={github}>
                <Text style={s.contactBold}>{githubDisplay}</Text>
              </Link>
              <Text style={s.contactSep}>{"  •  "}</Text>
              <WebIcon />
              <Link style={{ textDecoration: "none" }} src={website}>
                <Text style={s.contactBold}>{websiteDisplay}</Text>
              </Link>
            </View>

            {/* Row 3: location  •  EU Nationality */}
            <View style={s.contactRow}>
              <LocationIcon />
              <Text style={s.contactTeal}>{location}</Text>
              <Text style={{ ...s.contactSep, marginHorizontal: 5 }}>
                {"•"}
              </Text>
              <EUIcon />
              <Text style={s.contactBold}>{"EU Nationality (B permit)"}</Text>
            </View>
          </View>

          {/* Photo — height sized to border the Summary section */}
          <Image style={s.photo} src={photoDataUrl} />
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Summary                                                          */}
        {/* ---------------------------------------------------------------- */}
        <View style={s.summaryRow}>
          <Text style={s.summaryText}>
            <Text style={{ fontFamily: "Helvetica-Bold", color: TEAL }}>
              {"Summary: "}
            </Text>
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
                    // Only draw a separator after the last role in each employer
                    // block, and never after the very last employer.
                    showSepAfter={
                      entryIdx === group.entries.length - 1 &&
                      groupIdx < orgGroups.length - 1
                    }
                  />
                ))}
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
            {achievements.map((a) => (
              <View key={a.label} style={s.achievementItem}>
                <Text style={s.achievementLabel}>{a.label}</Text>
                {a.description ? (
                  <Text style={s.achievementDesc}>{a.description}</Text>
                ) : null}
              </View>
            ))}

            {/* Languages */}
            <Text style={s.sectionHeader}>{"LANGUAGES"}</Text>
            <View style={s.sectionRule} />
            <View style={s.languagesGrid}>
              {languages.map((lang) => (
                <Text key={lang.name} style={s.languageItem}>
                  {lang.name}{" "}
                  <Text style={{ color: GRAY }}>{`(${lang.level})`}</Text>
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
