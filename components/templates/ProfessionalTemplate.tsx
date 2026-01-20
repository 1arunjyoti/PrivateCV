import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
  Link,
} from "@react-pdf/renderer";
import type { Resume } from "@/db";
import { PDFRichText } from "./PDFRichText";
import { getTemplateDefaults } from "@/lib/template-defaults";
import { mmToPt, formatDate, PROFILE_IMAGE_SIZES } from "@/lib/template-utils";
import "@/lib/fonts";
import { getSectionHeadingWrapperStyles } from "@/lib/template-styles";

interface ProfessionalTemplateProps {
  resume: Resume;
}

export function ProfessionalTemplate({ resume }: ProfessionalTemplateProps) {
  const {
    basics,
    work,
    education,
    skills,
    projects,
    certificates,
    languages,
    interests,
    publications,
    awards,
    references,
    custom,
  } = resume;

  // Merge template defaults with resume settings
  const templateDefaults = getTemplateDefaults(
    resume.meta.templateId || "professional",
  );
  const settings = { ...templateDefaults, ...resume.meta.layoutSettings };

  // Defaults and calculations
  const fontSize = settings.fontSize || 9;
  const lineHeight = settings.lineHeight || 1.4;
  const sectionMargin = settings.sectionMargin || 10;
  const bulletMargin = settings.bulletMargin || 1;
  const marginH = mmToPt(settings.marginHorizontal || 15);
  const marginV = mmToPt(settings.marginVertical || 15);

  // Column sizing
  const leftColumnWidthPercent = settings.leftColumnWidth || 30;
  const rightColumnWidthPercent = 100 - leftColumnWidthPercent - 4; // 4% gap

  // Typography
  const baseFont = settings.fontFamily || "Roboto";
  const boldFont = settings.fontFamily || "Roboto";
  const italicFont = settings.fontFamily || "Roboto";

  const colorTargets = settings.themeColorTarget || [];
  const getColor = (target: string, fallback: string = "#000000") => {
    return colorTargets.includes(target) ? resume.meta.themeColor : fallback;
  };

  const styles = StyleSheet.create({
    page: {
      paddingHorizontal: marginH,
      paddingVertical: marginV,
      fontFamily: baseFont,
      fontSize: fontSize,
      lineHeight: lineHeight,
      color: "#000",
      flexDirection: "column",
    },
    header: {
      marginBottom: settings.headerBottomMargin ?? sectionMargin,
      borderBottomWidth: settings.sectionHeadingStyle === 1 ? 1 : 0,
      borderBottomColor: getColor("decorations"),
      paddingBottom: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    mainContainer: {
      flexDirection: "row",
      gap: "4%",
    },
    leftColumn: {
      width: `${leftColumnWidthPercent}%`,
    },
    rightColumn: {
      width: `${rightColumnWidthPercent}%`,
    },

    // Text elements
    name: {
      fontSize: settings.nameFontSize || 24,
      fontWeight: settings.nameBold ? "bold" : "normal",
      fontFamily:
        settings.nameFont === "creative"
          ? "Helvetica"
          : settings.nameBold
            ? boldFont
            : baseFont,
      textTransform: "uppercase",
      color: getColor("name"),
      lineHeight: settings.nameLineHeight || 1.2,
    },
    title: {
      fontSize: settings.titleFontSize || 14,
      color: getColor("title", "#444"),
      marginBottom: 4,
      fontWeight: settings.titleBold ? "bold" : "normal",
      fontStyle: settings.titleItalic ? "italic" : "normal",
      fontFamily: settings.titleBold
        ? boldFont
        : settings.titleItalic
          ? italicFont
          : baseFont,
      lineHeight: settings.titleLineHeight || 1.2,
    },

    // Section Common
    section: {
      marginBottom: sectionMargin,
    },
    sidebarSection: {
      marginBottom: sectionMargin,
    },

    sectionTitleWrapper: {
      ...getSectionHeadingWrapperStyles(settings, getColor),
      marginBottom: 6,
    },
    sectionTitle: {
      fontSize:
        settings.sectionHeadingSize === "L" ? fontSize + 2 : fontSize + 1,
      fontWeight: settings.sectionHeadingBold ? "bold" : "normal",
      fontFamily: settings.sectionHeadingBold ? boldFont : baseFont,
      textTransform: settings.sectionHeadingCapitalization,
      color: getColor("headings"),
    },

    // Entry Styles
    entryBlock: {
      marginBottom: 6,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 2,
    },
    entryTitle: {
      fontSize: settings.entryTitleSize === "L" ? fontSize + 2 : fontSize + 1,
      fontWeight: "bold",
      fontFamily: boldFont,
    },
    entrySubtitle: {
      fontSize: fontSize,
      fontWeight: settings.entrySubtitleStyle === "bold" ? "bold" : "normal",
      fontStyle: settings.entrySubtitleStyle === "italic" ? "italic" : "normal",
      fontFamily:
        settings.entrySubtitleStyle === "bold"
          ? boldFont
          : settings.entrySubtitleStyle === "italic"
            ? italicFont
            : baseFont,
      marginBottom: 1,
    },
    entryDate: {
      fontSize: fontSize - 0.5,
      color: "#666",
      textAlign: "right",
      fontFamily: italicFont,
      fontStyle: "italic",
    },
    entryLocation: {
      fontSize: fontSize - 0.5,
      fontStyle: "italic",
      fontFamily: italicFont,
      color: "#666",
    },
    entrySummary: {
      marginTop: 2,
      marginBottom: 2,
      marginLeft: settings.entryIndentBody ? 8 : 0,
    },

    // Lists
    bulletList: {
      marginLeft: settings.entryIndentBody ? 16 : 8,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: bulletMargin,
    },
    bullet: {
      width: 6,
      fontSize: fontSize,
      lineHeight: 1.3,
    },
    bulletText: {
      flex: 1,
      fontSize: fontSize,
      lineHeight: 1.3,
    },

    // Sidebar specific
    contactItem: {
      fontSize: fontSize,
      marginBottom: 3,
    },
    link: {
      textDecoration: "none",
      color: getColor("links", "#000"),
    },
  });

  // --- Renderers ---

  const renderProfileImage = () => {
    if (!basics.image || !settings.showProfileImage) return null;
    const size = PROFILE_IMAGE_SIZES[settings.profileImageSize || "M"];
    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image
        src={basics.image}
        style={{
          width: size,
          height: size,
          borderRadius: settings.profileImageShape === "square" ? 0 : size / 2,
          borderWidth: settings.profileImageBorder ? 1 : 0,
          borderColor: getColor("decorations"),
          objectFit: "cover",
          marginBottom: 10,
        }}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={styles.name}>{basics.name}</Text>
        <Text style={styles.title}>{basics.label}</Text>
      </View>
      {settings.showProfileImage && <View>{renderProfileImage()}</View>}
    </View>
  );

  const renderSectionTitle = (title: string) => (
    <View style={styles.sectionTitleWrapper}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  // --- Sidebar Content ---

  const renderContactSidebar = () => (
    <View style={styles.sidebarSection}>
      {renderSectionTitle("Contact")}
      <View>
        {basics.email && (
          <View style={styles.contactItem}>
            <Link src={`mailto:${basics.email}`} style={styles.link}>
              {basics.email}
            </Link>
          </View>
        )}
        {basics.phone && (
          <View style={styles.contactItem}>
            <Text>{basics.phone}</Text>
          </View>
        )}
        {basics.location.city && (
          <View style={styles.contactItem}>
            <Text>
              {basics.location.city}
              {basics.location.country ? `, ${basics.location.country}` : ""}
            </Text>
          </View>
        )}
        {basics.url && (
          <View style={styles.contactItem}>
            <Link src={basics.url} style={styles.link}>
              {basics.url.replace(/^https?:\/\//, "")}
            </Link>
          </View>
        )}
        {basics.profiles?.map((p) => (
          <View key={p.network} style={styles.contactItem}>
            <Link src={p.url || ""} style={styles.link}>
              {p.network}
            </Link>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;
    return (
      <View style={styles.sidebarSection}>
        {((settings.skillsHeadingVisible ?? true) as boolean) &&
          renderSectionTitle("Skills")}
        <View>
          {skills.map((skill, i) => (
            <View key={i} style={{ marginBottom: 6 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: fontSize,
                  fontFamily: boldFont,
                }}
              >
                {skill.name}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                {skill.keywords.map((kw, k) => (
                  <Text
                    key={k}
                    style={{ fontSize: fontSize - 0.5, color: "#444" }}
                  >
                    {kw}
                    {k < skill.keywords.length - 1 ? "," : ""}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderEducationSidebar = () => {
    if (!education || education.length === 0) return null;
    return (
      <View style={styles.sidebarSection}>
        {((settings.educationHeadingVisible ?? true) as boolean) &&
          renderSectionTitle("Education")}
        {education.map((edu) => (
          <View key={edu.id} style={{ marginBottom: 6 }}>
            <Text
              style={{
                fontWeight: settings.educationInstitutionBold
                  ? "bold"
                  : "normal",
                fontStyle: settings.educationInstitutionItalic
                  ? "italic"
                  : "normal",
                fontSize: fontSize,
                fontFamily: settings.educationInstitutionBold
                  ? boldFont
                  : settings.educationInstitutionItalic
                    ? italicFont
                    : baseFont,
              }}
            >
              {edu.institution}
            </Text>

            <Text
              style={{
                fontSize: fontSize,
                fontWeight: settings.educationDegreeBold ? "bold" : "normal",
                fontStyle: settings.educationDegreeItalic ? "italic" : "normal",
                fontFamily: settings.educationDegreeBold
                  ? boldFont
                  : settings.educationDegreeItalic
                    ? italicFont
                    : baseFont,
              }}
            >
              {edu.studyType} {edu.area}
            </Text>

            <Text
              style={{
                fontSize: fontSize - 1,
                color: "#666",
                fontStyle: "italic",
                fontFamily: italicFont,
              }}
            >
              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
            </Text>
            {edu.score && (
              <Text style={{ fontSize: fontSize - 1 }}>{edu.score}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null;
    return (
      <View style={styles.sidebarSection}>
        {renderSectionTitle("Languages")}
        {languages.map((lang) => (
          <View
            key={lang.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Text>{lang.language}</Text>
            <Text
              style={{
                color: "#666",
                fontStyle: "italic",
                fontFamily: italicFont,
              }}
            >
              {lang.fluency}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCertificates = () => {
    if (!certificates || certificates.length === 0) return null;
    return (
      <View style={styles.sidebarSection}>
        {((settings.certificatesHeadingVisible ?? true) as boolean) &&
          renderSectionTitle("Certifications")}
        {certificates.map((cert) => (
          <View key={cert.id} style={{ marginBottom: 4 }}>
            <Link
              src={cert.url || ""}
              style={[
                styles.link,
                {
                  fontWeight: "bold",
                  fontSize: fontSize,
                  fontFamily: boldFont,
                },
              ]}
            >
              {cert.name}
            </Link>
            <Text style={{ fontSize: fontSize - 0.5, color: "#444" }}>
              {cert.issuer} | {formatDate(cert.date)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderAwards = () => {
    if (!awards || awards.length === 0) return null;
    return (
      <View style={styles.sidebarSection}>
        {((settings.awardsHeadingVisible ?? true) as boolean) &&
          renderSectionTitle("Awards")}
        {awards.map((award) => (
          <View key={award.id} style={{ marginBottom: 4 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: fontSize,
                fontFamily: boldFont,
              }}
            >
              {award.title}
            </Text>
            <Text style={{ fontSize: fontSize - 0.5, color: "#444" }}>
              {award.awarder} | {formatDate(award.date)}
            </Text>
            <Text style={{ fontSize: fontSize - 0.5 }}>{award.summary}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderInterests = () => {
    if (!interests || interests.length === 0) return null;
    return (
      <View style={styles.sidebarSection}>
        {renderSectionTitle("Interests")}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
          {interests.map((int, i) => (
            <Text key={i} style={{ fontSize: fontSize }}>
              {int.name}
              {i < interests.length - 1 ? " • " : ""}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  // --- Main Column Content ---

  const renderSummary = () => {
    if (!basics.summary) return null;
    return (
      <View style={styles.section}>
        {((settings.summaryHeadingVisible ?? true) as boolean) &&
          renderSectionTitle("Professional Summary")}
        <PDFRichText
          text={basics.summary}
          style={{ fontSize: fontSize, lineHeight: lineHeight }}
          fontSize={fontSize}
        />
      </View>
    );
  };

  const renderExperience = () => {
    if (!work || work.length === 0) return null;
    return (
      <View style={styles.section}>
        {((settings.workHeadingVisible ?? true) as boolean) &&
          renderSectionTitle("Experience")}
        {work.map((exp) => (
          <View key={exp.id} style={styles.entryBlock}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>{exp.company}</Text>
              <Text style={styles.entryDate}>
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <Text style={styles.entrySubtitle}>{exp.position}</Text>
            </View>

            {exp.summary && (
              <View style={styles.entrySummary}>
                <PDFRichText
                  text={exp.summary}
                  fontSize={fontSize}
                  style={{ fontSize }}
                />
              </View>
            )}

            {exp.highlights && exp.highlights.length > 0 && (
              <View style={styles.bulletList}>
                {exp.highlights.map((h, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{h}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <View style={styles.section}>
        {((settings.projectsHeadingVisible ?? true) as boolean) &&
          renderSectionTitle("Projects")}
        {projects.map((proj) => (
          <View key={proj.id} style={styles.entryBlock}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>{proj.name}</Text>
              <View>
                {proj.startDate && (
                  <Text style={styles.entryDate}>
                    {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.entrySubtitle}>{proj.description}</Text>
              {proj.url && (
                <Link
                  src={proj.url}
                  style={{
                    fontSize: fontSize - 1,
                    color: getColor("links"),
                    fontWeight: settings.projectsUrlBold ? "bold" : "normal",
                    fontStyle: settings.projectsUrlItalic ? "italic" : "normal",
                    fontFamily: settings.projectsUrlBold
                      ? boldFont
                      : settings.projectsUrlItalic
                        ? italicFont
                        : baseFont,
                  }}
                >
                  {proj.url.replace(/^https?:\/\//, "")}
                </Link>
              )}
            </View>
            {proj.highlights && proj.highlights.length > 0 && (
              <View style={styles.bulletList}>
                {proj.highlights.map((h, i) => (
                  <View key={i} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{h}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderPublications = () => {
    if (!publications || publications.length === 0) return null;
    return (
      <View style={styles.section}>
        {renderSectionTitle("Publications")}
        {publications.map((pub) => (
          <View key={pub.id} style={{ marginBottom: 4 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: fontSize,
                  fontFamily: boldFont,
                }}
              >
                {pub.name}
              </Text>
              <Text
                style={{
                  fontSize: fontSize - 1,
                  color: "#666",
                  fontFamily: italicFont,
                }}
              >
                {formatDate(pub.releaseDate)}
              </Text>
            </View>
            <Text
              style={{
                fontSize: fontSize,
                fontStyle: "italic",
                fontFamily: italicFont,
              }}
            >
              {pub.publisher}
            </Text>
            <Text style={{ fontSize: fontSize }}>{pub.summary}</Text>
            {pub.url && (
              <Link src={pub.url} style={styles.link}>
                {pub.url}
              </Link>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderReferences = () => {
    if (!references || references.length === 0) return null;
    return (
      <View style={styles.section}>
        {renderSectionTitle("References")}
        {references.map((ref) => (
          <View key={ref.id} style={{ marginBottom: 4 }}>
            <Text
              style={{
                fontWeight: settings.referencesNameBold ? "bold" : "normal",
                fontSize: fontSize,
                fontFamily: settings.referencesNameBold ? boldFont : baseFont,
              }}
            >
              {ref.name}
            </Text>
            <Text
              style={{
                fontSize: fontSize,
                fontStyle: settings.referencesPositionItalic
                  ? "italic"
                  : "normal",
                fontFamily: settings.referencesPositionItalic
                  ? italicFont
                  : baseFont,
              }}
            >
              {ref.reference}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCustom = () => {
    if (!custom) return null;
    return null;
  };

  // --- Dynamic Layout ---

  const SECTION_RENDERERS = {
    summary: renderSummary,
    work: renderExperience,
    education: renderEducationSidebar, // Intentionally Sidebar Style
    skills: renderSkills,
    projects: renderProjects,
    certificates: renderCertificates,
    awards: renderAwards,
    publications: renderPublications,
    languages: renderLanguages,
    interests: renderInterests,
    references: renderReferences,
    custom: renderCustom,
  };

  // Define sidebar vs main sections
  // This categorization enforces the 2-column structure preference
  // If the user moves 'Experience' to position 1, it will be the first item in the Main Column.
  // If they move 'Skills' to position 1, it will be the first item in the Sidebar.
  const LHS_SECTIONS = [
    "skills",
    "education",
    "languages",
    "certificates",
    "awards",
    "interests",
  ];

  // Note: Sidebar also includes Contact (hardcoded at top usually)

  const RHS_SECTIONS = [
    "summary",
    "work",
    "projects",
    "publications",
    "references",
    "custom",
  ];

  const order =
    settings.sectionOrder && settings.sectionOrder.length > 0
      ? settings.sectionOrder
      : [...RHS_SECTIONS, ...LHS_SECTIONS]; // Fail-safe default

  // Split content based on order preference
  const leftColumnContent = order.filter((id) => LHS_SECTIONS.includes(id));
  const rightColumnContent = order.filter((id) => RHS_SECTIONS.includes(id));

  // Handle orphans (unknown sections go to main)
  const knownSections = [...LHS_SECTIONS, ...RHS_SECTIONS];
  const orphans = order.filter((id) => !knownSections.includes(id));
  if (orphans.length > 0) {
    rightColumnContent.push(...orphans);
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}

        <View style={styles.mainContainer}>
          {/* Left Column / Sidebar */}
          <View style={styles.leftColumn}>
            {renderContactSidebar()}
            {leftColumnContent.map((sectionId) => {
              const renderer =
                SECTION_RENDERERS[sectionId as keyof typeof SECTION_RENDERERS];
              return renderer ? (
                <View key={sectionId}>{renderer()}</View>
              ) : null;
            })}
          </View>

          {/* Right Column / Main */}
          <View style={styles.rightColumn}>
            {rightColumnContent.map((sectionId) => {
              const renderer =
                SECTION_RENDERERS[sectionId as keyof typeof SECTION_RENDERERS];
              return renderer ? (
                <View key={sectionId}>{renderer()}</View>
              ) : null;
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function generateProfessionalPDF(resume: Resume): Promise<Blob> {
  const doc = <ProfessionalTemplate resume={resume} />;
  return await pdf(doc).toBlob();
}
