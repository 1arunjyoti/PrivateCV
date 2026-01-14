import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { Resume } from "@/db";

// Using standard serif font (Times-Roman) which doesn't need external registration
// or we can register a specific one if needed. Reference: https://react-pdf.org/fonts

const createStyles = (
  themeColor: string,
  settings: {
    fontSize: number;
    lineHeight: number;
    sectionMargin: number;
    bulletMargin: number;
  }
) =>
  StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: "Times-Roman",
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
      color: "#000",
    },
    header: {
      marginBottom: settings.sectionMargin * 1.5,
      textAlign: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      paddingBottom: 10,
    },
    name: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 12,
      textTransform: "uppercase",
    },
    title: {
      fontSize: settings.fontSize + 3,
      marginBottom: 6,
      fontStyle: "italic",
    },
    contactRow: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 12,
      fontSize: settings.fontSize,
    },
    section: {
      marginBottom: settings.sectionMargin,
    },
    sectionTitle: {
      fontSize: settings.fontSize + 1,
      fontWeight: "bold",
      marginBottom: 8,
      textTransform: "uppercase",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      paddingBottom: 2,
      letterSpacing: 0.5,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    entryTitle: {
      fontSize: settings.fontSize + 2,
      fontWeight: "bold",
    },
    entrySubtitle: {
      fontSize: settings.fontSize + 1,
      fontStyle: "italic",
    },
    entryDate: {
      fontSize: settings.fontSize + 1,
    },
    entrySummary: {
      fontSize: settings.fontSize + 1,
      marginTop: 2,
      marginBottom: 2,
    },
    bulletList: {
      paddingLeft: 10,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: settings.bulletMargin,
    },
    bullet: {
      width: 10,
      fontSize: settings.fontSize,
    },
    bulletText: {
      flex: 1,
      fontSize: settings.fontSize,
    },
    skillsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
  });

interface ProfessionalTemplateProps {
  resume: Resume;
}

export function ProfessionalTemplate({ resume }: ProfessionalTemplateProps) {
  const { basics, work, education, skills, projects } = resume;

  const settings = resume.meta.layoutSettings || {
    fontSize: 8.5,
    lineHeight: 1.2,
    sectionMargin: 8,
    bulletMargin: 2,
    useBullets: true,
  };

  const styles = createStyles("#000", settings);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{basics.name || "Your Name"}</Text>
          {basics.label && <Text style={styles.title}>{basics.label}</Text>}
          <View style={styles.contactRow}>
            {basics.email && <Text>{basics.email}</Text>}
            {basics.phone && <Text>• {basics.phone}</Text>}
            {basics.location.city && (
              <Text>
                • {basics.location.city}
                {basics.location.country ? `, ${basics.location.country}` : ""}
              </Text>
            )}
            {basics.url && <Text>• {basics.url}</Text>}
          </View>
        </View>

        {/* Summary */}
        {basics.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={{ fontSize: 10 }}>{basics.summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {work.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {work.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.company}</Text>
                  <Text style={styles.entryDate}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.position}</Text>

                {exp.summary && (
                  <Text style={styles.entrySummary}>{exp.summary}</Text>
                )}

                {exp.highlights.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.highlights.map((highlight, i) => (
                      <View key={i} style={styles.bulletItem}>
                        {settings.useBullets && (
                          <Text style={styles.bullet}>•</Text>
                        )}
                        <Text style={styles.bulletText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.institution}</Text>
                  <Text style={styles.entryDate}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {edu.studyType} {edu.area && `in ${edu.area}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View>
              {skills.map((skill) => (
                <Text key={skill.id} style={{ fontSize: 10, marginBottom: 2 }}>
                  <Text style={{ fontWeight: "bold" }}>{skill.name}: </Text>
                  {skill.keywords.join(", ")}
                </Text>
              ))}
            </View>
          </View>
        )}
        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 6 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{proj.name}</Text>
                  {proj.url && (
                    <Text style={{ fontSize: 9, color: "#444" }}>
                      {proj.url}
                    </Text>
                  )}
                </View>
                {proj.description && (
                  <Text style={styles.entrySummary}>{proj.description}</Text>
                )}
                {proj.keywords.length > 0 && (
                  <Text
                    style={{ fontSize: 9, fontStyle: "italic", marginTop: 2 }}
                  >
                    Technologies: {proj.keywords.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

// Export PDF generation function
export async function generateProfessionalPDF(resume: Resume): Promise<Blob> {
  const doc = <ProfessionalTemplate resume={resume} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}
