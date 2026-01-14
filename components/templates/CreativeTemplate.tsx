import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
  Link,
} from "@react-pdf/renderer";
import type { Resume } from "@/db";

// Register fonts
Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-italic.ttf",
      fontStyle: "italic",
    },
  ],
});

interface CreativeTemplateProps {
  resume: Resume;
}

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
      flexDirection: "row",
      fontFamily: "Open Sans",
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
    },
    // Left sidebar
    sidebar: {
      width: "35%",
      backgroundColor: themeColor,
      color: "#ffffff",
      padding: 25,
      paddingTop: 40,
    },
    sidebarSection: {
      marginBottom: settings.sectionMargin,
    },
    sidebarTitle: {
      fontSize: settings.fontSize + 1,
      fontWeight: "bold",
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 1,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.3)",
      paddingBottom: 4,
    },
    sidebarText: {
      fontSize: settings.fontSize,
      marginBottom: 3,
      opacity: 0.9,
    },
    sidebarLabel: {
      fontSize: settings.fontSize - 1,
      opacity: 0.7,
      marginBottom: 2,
      textTransform: "uppercase",
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.2)",
      marginBottom: 15,
      alignSelf: "center",
    },
    skillItem: {
      marginBottom: 8,
    },
    skillName: {
      fontSize: settings.fontSize,
      fontWeight: "bold",
      marginBottom: 2,
    },
    skillBar: {
      height: 4,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 2,
    },
    skillBarFill: {
      height: 4,
      backgroundColor: "#ffffff",
      borderRadius: 2,
    },
    profileLink: {
      fontSize: settings.fontSize - 1,
      color: "#ffffff",
      opacity: 0.9,
      marginBottom: 4,
    },
    // Main content
    main: {
      width: "65%",
      padding: 30,
      paddingTop: 40,
      backgroundColor: "#ffffff",
    },
    header: {
      marginBottom: settings.sectionMargin * 1.5,
    },
    name: {
      fontSize: 28,
      fontWeight: "bold",
      color: themeColor,
      marginBottom: 8,
    },
    title: {
      fontSize: settings.fontSize + 3,
      color: "#666",
      marginBottom: 8,
    },
    summary: {
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
      color: "#555",
    },
    section: {
      marginBottom: settings.sectionMargin,
    },
    sectionTitle: {
      fontSize: settings.fontSize + 1,
      fontWeight: "bold",
      color: themeColor,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    entryContainer: {
      marginBottom: 8,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 3,
    },
    entryTitle: {
      fontSize: settings.fontSize + 1,
      fontWeight: "bold",
      color: "#333",
    },
    entrySubtitle: {
      fontSize: settings.fontSize,
      color: "#666",
    },
    entryDate: {
      fontSize: settings.fontSize - 1,
      color: "#888",
    },
    entrySummary: {
      fontSize: settings.fontSize,
      color: "#555",
      marginBottom: 4,
    },
    bulletList: {
      marginLeft: 8,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: settings.bulletMargin,
    },
    bullet: {
      width: 12,
      fontSize: settings.fontSize,
      color: themeColor,
    },
    bulletText: {
      flex: 1,
      fontSize: settings.fontSize - 1,
      color: "#555",
    },
    projectTech: {
      fontSize: settings.fontSize - 1,
      color: "#888",
      fontStyle: "italic",
    },
  });

export function CreativeTemplate({ resume }: CreativeTemplateProps) {
  const { basics, work, education, skills, projects } = resume;
  const themeColor = resume.meta.themeColor || "#3b82f6";

  const settings = resume.meta.layoutSettings || {
    fontSize: 8.5,
    lineHeight: 1.2,
    sectionMargin: 8,
    bulletMargin: 2,
    useBullets: true,
  };

  const styles = createStyles(themeColor, settings);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getSkillLevel = (level: string): number => {
    const levels: Record<string, number> = {
      beginner: 25,
      intermediate: 50,
      advanced: 75,
      expert: 100,
    };
    return levels[level.toLowerCase()] || 60;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            {basics.email && (
              <View style={{ marginBottom: 6 }}>
                <Text style={styles.sidebarLabel}>Email</Text>
                <Text style={styles.sidebarText}>{basics.email}</Text>
              </View>
            )}
            {basics.phone && (
              <View style={{ marginBottom: 6 }}>
                <Text style={styles.sidebarLabel}>Phone</Text>
                <Text style={styles.sidebarText}>{basics.phone}</Text>
              </View>
            )}
            {(basics.location.city || basics.location.country) && (
              <View style={{ marginBottom: 6 }}>
                <Text style={styles.sidebarLabel}>Location</Text>
                <Text style={styles.sidebarText}>
                  {basics.location.city}
                  {basics.location.city && basics.location.country ? ", " : ""}
                  {basics.location.country}
                </Text>
              </View>
            )}
            {basics.url && (
              <View style={{ marginBottom: 6 }}>
                <Text style={styles.sidebarLabel}>Website</Text>
                <Link src={basics.url} style={styles.profileLink}>
                  {basics.url.replace(/^https?:\/\//, "")}
                </Link>
              </View>
            )}
          </View>

          {/* Social Profiles */}
          {basics.profiles.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Profiles</Text>
              {basics.profiles.map((profile, index) => (
                <View key={index} style={{ marginBottom: 6 }}>
                  <Text style={styles.sidebarLabel}>{profile.network}</Text>
                  <Link src={profile.url} style={styles.profileLink}>
                    @{profile.username}
                  </Link>
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Skills</Text>
              {skills.map((skill) => (
                <View key={skill.id} style={styles.skillItem}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <View style={styles.skillBar}>
                    <View
                      style={[
                        styles.skillBarFill,
                        { width: `${getSkillLevel(skill.level)}%` },
                      ]}
                    />
                  </View>
                  {skill.keywords.length > 0 && (
                    <Text
                      style={[
                        styles.sidebarText,
                        { fontSize: 7, marginTop: 2 },
                      ]}
                    >
                      {skill.keywords.slice(0, 4).join(" • ")}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Education (compact) */}
          {education.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Education</Text>
              {education.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 8 }}>
                  <Text style={styles.skillName}>
                    {edu.studyType} {edu.area && `in ${edu.area}`}
                  </Text>
                  <Text style={styles.sidebarText}>{edu.institution}</Text>
                  <Text style={[styles.sidebarText, { fontSize: 7 }]}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>{basics.name || "Your Name"}</Text>
            {basics.label && <Text style={styles.title}>{basics.label}</Text>}
            {basics.summary && (
              <Text style={styles.summary}>{basics.summary}</Text>
            )}
          </View>

          {/* Work Experience */}
          {work.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {work.map((exp) => (
                <View key={exp.id} style={styles.entryContainer}>
                  <View style={styles.entryHeader}>
                    <View>
                      <Text style={styles.entryTitle}>{exp.position}</Text>
                      <Text style={styles.entrySubtitle}>{exp.company}</Text>
                    </View>
                    <Text style={styles.entryDate}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </Text>
                  </View>
                  {exp.summary && (
                    <Text style={styles.entrySummary}>{exp.summary}</Text>
                  )}
                  {exp.highlights.length > 0 && (
                    <View style={styles.bulletList}>
                      {exp.highlights.slice(0, 3).map((highlight, i) => (
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

          {/* Projects */}
          {projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {projects.map((proj) => (
                <View key={proj.id} style={styles.entryContainer}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{proj.name}</Text>
                    {proj.url && (
                      <Link src={proj.url} style={styles.entryDate}>
                        View Project
                      </Link>
                    )}
                  </View>
                  {proj.description && (
                    <Text style={styles.entrySummary}>{proj.description}</Text>
                  )}
                  {proj.keywords.length > 0 && (
                    <Text style={styles.projectTech}>
                      {proj.keywords.join(" • ")}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

// Export PDF generation function
export async function generateCreativePDF(resume: Resume): Promise<Blob> {
  const doc = <CreativeTemplate resume={resume} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}
