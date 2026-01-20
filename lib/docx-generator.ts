import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  UnderlineType,
  TableLayoutType,
} from "docx";
import type { Resume, LayoutSettings } from "@/db";

// ============================================================
// Types
// ============================================================

/** Context passed to all section generators */
interface DocxContext {
  resume: Resume;
  baseFontSize: number;
  sectionMargin: number;
  lineHeight: number;
  getColor: (target: string, fallback?: string) => string;
}

// ============================================================
// Helper Functions
// ============================================================

/** Sanitize text by removing invalid XML characters */
const sanitize = (str: string): string => {
  if (!str) return "";
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
};

/** Parse markdown-like bold/italic to TextRun[] */
const parseMarkdown = (text: string, fontSize: number): TextRun[] => {
  if (!text) return [];
  const safeText = sanitize(text);
  const parts = safeText.split(/(\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|\[.*?\]\(.*?\))/g);
  return parts.map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return new TextRun({
        text: part.slice(2, -2),
        bold: true,
        size: fontSize * 2,
      });
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return new TextRun({
        text: part.slice(1, -1),
        italics: true,
        size: fontSize * 2,
      });
    }
    if (part.startsWith("<u>") && part.endsWith("</u>")) {
      return new TextRun({
        text: part.slice(3, -4),
        underline: { type: UnderlineType.SINGLE },
        size: fontSize * 2,
      });
    }
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const split = part.slice(1, -1).split("](");
      return new TextRun({
        text: split[0],
        size: fontSize * 2,
        color: "0563C1",
        underline: { type: UnderlineType.SINGLE },
      });
    }
    return new TextRun({
      text: part,
      size: fontSize * 2,
    });
  });
};

/** Format date string */
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "Present";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// ============================================================
// Section Title Generator
// ============================================================

const createSectionTitle = (title: string, ctx: DocxContext): Paragraph => {
  return new Paragraph({
    text: sanitize(title).toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: ctx.sectionMargin, after: 100, line: ctx.lineHeight },
    border: {
      bottom: {
        color: ctx.getColor("decorations"),
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    run: {
      color: ctx.getColor("headings"),
      bold: true,
      size: (ctx.baseFontSize + 4) * 2,
      font: "Times New Roman",
    },
  });
};

// ============================================================
// Section Generators
// ============================================================

const createSummary = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.basics.summary) return null;
  return [
    createSectionTitle("Summary", ctx),
    new Paragraph({
      children: parseMarkdown(ctx.resume.basics.summary, ctx.baseFontSize),
      spacing: { after: 200, line: ctx.lineHeight },
    }),
  ];
};

const createWork = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.work || ctx.resume.work.length === 0) return null;
  return [
    createSectionTitle("Professional Experience", ctx),
    ...ctx.resume.work.flatMap((exp) => [
      new Paragraph({
        children: [
          new TextRun({
            text: sanitize(exp.company),
            bold: true,
            size: (ctx.baseFontSize + 1) * 2,
          }),
          ...(exp.url
            ? [
                new TextRun({
                  text: ` | ${sanitize(exp.url)}`,
                  size: ctx.baseFontSize * 2,
                  color: ctx.getColor("links", "0563C1"),
                }),
              ]
            : []),
          new TextRun({
            text: `\t${formatDate(exp.startDate)} — ${formatDate(exp.endDate)}`,
            italics: true,
            size: ctx.baseFontSize * 2,
          }),
        ],
        tabStops: [{ type: "right", position: 9000 }],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: sanitize(exp.position),
            italics: true,
            size: ctx.baseFontSize * 2,
          }),
        ],
        spacing: { after: 100, line: ctx.lineHeight },
      }),
      ...(exp.summary
        ? [
            new Paragraph({
              children: parseMarkdown(exp.summary, ctx.baseFontSize),
            }),
          ]
        : []),
      ...(exp.highlights
        ? exp.highlights.map(
            (h) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: sanitize(h),
                    size: ctx.baseFontSize * 2,
                  }),
                ],
                bullet: { level: 0 },
              }),
          )
        : []),
      new Paragraph({ text: "", spacing: { after: 200, line: ctx.lineHeight } }),
    ]),
  ];
};

const createEducation = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.education || ctx.resume.education.length === 0) return null;
  return [
    createSectionTitle("Education", ctx),
    ...ctx.resume.education.flatMap((edu) => [
      new Paragraph({
        children: [
          new TextRun({
            text: sanitize(edu.institution),
            bold: true,
            size: (ctx.baseFontSize + 1) * 2,
          }),
          ...(edu.url
            ? [
                new TextRun({
                  text: ` | ${sanitize(edu.url)}`,
                  size: ctx.baseFontSize * 2,
                  color: ctx.getColor("links", "0563C1"),
                }),
              ]
            : []),
          new TextRun({
            text: `\t${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}`,
            italics: true,
            size: ctx.baseFontSize * 2,
          }),
        ],
        tabStops: [{ type: "right", position: 9000 }],
        spacing: { line: ctx.lineHeight },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${sanitize(edu.studyType)} in ${sanitize(edu.area)}`,
            size: ctx.baseFontSize * 2,
          }),
        ],
        spacing: { line: ctx.lineHeight },
      }),
      ...(edu.score
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `GPA: ${edu.score}`,
                  size: ctx.baseFontSize * 2,
                }),
              ],
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
      ...(edu.courses && edu.courses.length > 0
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Courses: ${sanitize(edu.courses.join(", "))}`,
                  size: ctx.baseFontSize * 2,
                  italics: true,
                }),
              ],
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
      ...(edu.summary
        ? [
            new Paragraph({
              children: parseMarkdown(edu.summary, ctx.baseFontSize),
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
      new Paragraph({ text: "", spacing: { after: 200, line: ctx.lineHeight } }),
    ]),
  ];
};

const createSkills = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.skills || ctx.resume.skills.length === 0) return null;
  return [
    createSectionTitle("Skills", ctx),
    ...ctx.resume.skills.map(
      (skill) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `${sanitize(skill.name)}: `,
              bold: true,
              size: ctx.baseFontSize * 2,
            }),
            new TextRun({
              text: sanitize(skill.keywords.join(", ")),
              size: ctx.baseFontSize * 2,
            }),
          ],
          bullet: { level: 0 },
          spacing: { line: ctx.lineHeight },
        }),
    ),
  ];
};

const createProjects = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.projects || ctx.resume.projects.length === 0) return null;
  return [
    createSectionTitle("Projects", ctx),
    ...ctx.resume.projects.flatMap((proj) => [
      new Paragraph({
        children: [
          new TextRun({
            text: sanitize(proj.name),
            bold: true,
            size: (ctx.baseFontSize + 1) * 2,
          }),
          new TextRun({
            text: `\t${formatDate(proj.startDate)} — ${formatDate(proj.endDate || "")}`,
            italics: true,
            size: ctx.baseFontSize * 2,
          }),
        ],
        tabStops: [{ type: "right", position: 9000 }],
        spacing: { line: ctx.lineHeight },
      }),
      ...(proj.url
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: sanitize(proj.url),
                  size: ctx.baseFontSize * 2,
                  color: ctx.getColor("links", "0563C1"),
                }),
              ],
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
      new Paragraph({
        children: parseMarkdown(proj.description, ctx.baseFontSize),
        spacing: { line: ctx.lineHeight },
      }),
      ...(proj.highlights
        ? proj.highlights.map(
            (h) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: sanitize(h),
                    size: ctx.baseFontSize * 2,
                  }),
                ],
                bullet: { level: 0 },
              }),
          )
        : []),
      ...(proj.keywords && proj.keywords.length > 0
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Technologies: ${sanitize(proj.keywords.join(", "))}`,
                  size: ctx.baseFontSize * 2,
                  italics: true,
                }),
              ],
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
      new Paragraph({ text: "", spacing: { after: 200, line: ctx.lineHeight } }),
    ]),
  ];
};

const createCertificates = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.certificates || ctx.resume.certificates.length === 0) return null;
  return [
    createSectionTitle("Certificates", ctx),
    ...ctx.resume.certificates.flatMap((cert) => [
      new Paragraph({
        children: [
          new TextRun({
            text: `${sanitize(cert.name)} - ${sanitize(cert.issuer)}`,
            bold: true,
            size: ctx.baseFontSize * 2,
          }),
          new TextRun({
            text: `\t${formatDate(cert.date)}`,
            italics: true,
            size: ctx.baseFontSize * 2,
          }),
        ],
        tabStops: [{ type: "right", position: 9000 }],
        bullet: { level: 0 },
        spacing: { line: ctx.lineHeight },
      }),
      ...(cert.url
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: sanitize(cert.url),
                  size: ctx.baseFontSize * 2,
                  color: ctx.getColor("links", "0563C1"),
                }),
              ],
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
      ...(cert.summary
        ? [
            new Paragraph({
              children: parseMarkdown(cert.summary, ctx.baseFontSize),
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
    ]),
  ];
};

const createLanguages = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.languages || ctx.resume.languages.length === 0) return null;
  return [
    createSectionTitle("Languages", ctx),
    new Paragraph({
      children: ctx.resume.languages.flatMap((lang, index) => [
        new TextRun({
          text: `${sanitize(lang.language)} (${sanitize(lang.fluency)})`,
          size: ctx.baseFontSize * 2,
        }),
        index < ctx.resume.languages.length - 1
          ? new TextRun({ text: " • ", size: ctx.baseFontSize * 2 })
          : new TextRun(""),
      ]),
      spacing: { line: ctx.lineHeight },
    }),
  ];
};

const createInterests = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.interests || ctx.resume.interests.length === 0) return null;
  return [
    createSectionTitle("Interests", ctx),
    ...ctx.resume.interests.map(
      (interest) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `${sanitize(interest.name)}: `,
              bold: true,
              size: ctx.baseFontSize * 2,
            }),
            new TextRun({
              text: sanitize(interest.keywords?.join(", ") || ""),
              size: ctx.baseFontSize * 2,
            }),
          ],
          bullet: { level: 0 },
          spacing: { line: ctx.lineHeight },
        }),
    ),
  ];
};

const createPublications = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.publications || ctx.resume.publications.length === 0) return null;
  return [
    createSectionTitle("Publications", ctx),
    ...ctx.resume.publications.flatMap((pub) => [
      new Paragraph({
        children: [
          new TextRun({
            text: sanitize(pub.name),
            bold: true,
            size: ctx.baseFontSize * 2,
          }),
          new TextRun({
            text: ` - ${sanitize(pub.publisher)}`,
            size: ctx.baseFontSize * 2,
          }),
          new TextRun({
            text: `\t${formatDate(pub.releaseDate)}`,
            italics: true,
            size: ctx.baseFontSize * 2,
          }),
        ],
        tabStops: [{ type: "right", position: 9000 }],
        bullet: { level: 0 },
        spacing: { line: ctx.lineHeight },
      }),
      ...(pub.url
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: sanitize(pub.url),
                  size: ctx.baseFontSize * 2,
                  color: ctx.getColor("links", "0563C1"),
                }),
              ],
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
      ...(pub.summary
        ? [
            new Paragraph({
              children: parseMarkdown(pub.summary, ctx.baseFontSize),
              spacing: { after: 100, line: ctx.lineHeight },
            }),
          ]
        : []),
    ]),
  ];
};

const createAwards = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.awards || ctx.resume.awards.length === 0) return null;
  return [
    createSectionTitle("Awards", ctx),
    ...ctx.resume.awards.flatMap((award) => [
      new Paragraph({
        children: [
          new TextRun({
            text: sanitize(award.title),
            bold: true,
            size: ctx.baseFontSize * 2,
          }),
          new TextRun({
            text: ` - ${sanitize(award.awarder)}`,
            size: ctx.baseFontSize * 2,
          }),
          new TextRun({
            text: `\t${formatDate(award.date)}`,
            italics: true,
            size: ctx.baseFontSize * 2,
          }),
        ],
        tabStops: [{ type: "right", position: 9000 }],
        bullet: { level: 0 },
        spacing: { line: ctx.lineHeight },
      }),
      ...(award.summary
        ? [
            new Paragraph({
              children: parseMarkdown(award.summary, ctx.baseFontSize),
              spacing: { after: 100, line: ctx.lineHeight },
            }),
          ]
        : []),
    ]),
  ];
};

const createReferences = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.references || ctx.resume.references.length === 0) return null;
  return [
    createSectionTitle("References", ctx),
    ...ctx.resume.references.flatMap((ref) => [
      new Paragraph({
        children: [
          new TextRun({
            text: sanitize(ref.name),
            bold: true,
            size: ctx.baseFontSize * 2,
          }),
          new TextRun({
            text: ` - ${sanitize(ref.position || "")}`,
            italics: true,
            size: ctx.baseFontSize * 2,
          }),
        ],
        bullet: { level: 0 },
      }),
      ...(ref.reference
        ? [
            new Paragraph({
              children: parseMarkdown(ref.reference, ctx.baseFontSize),
              spacing: { after: 200, line: ctx.lineHeight },
            }),
          ]
        : []),
    ]),
  ];
};

const createCustom = (ctx: DocxContext): (Paragraph | Table)[] | null => {
  if (!ctx.resume.custom || ctx.resume.custom.length === 0) return null;
  return ctx.resume.custom.flatMap((section) => [
    createSectionTitle(section.name || "Custom Section", ctx),
    ...(section.items || []).flatMap((item) => [
      new Paragraph({
        children: [
          new TextRun({
            text: sanitize(item.name),
            bold: true,
            size: ctx.baseFontSize * 2,
          }),
          ...(item.date
            ? [
                new TextRun({
                  text: `\t${formatDate(item.date)}`,
                  italics: true,
                  size: ctx.baseFontSize * 2,
                }),
              ]
            : []),
        ],
        tabStops: [{ type: "right", position: 9000 }],
        bullet: { level: 0 },
        spacing: { line: ctx.lineHeight },
      }),
      ...(item.description
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: sanitize(item.description),
                  size: ctx.baseFontSize * 2,
                }),
              ],
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
      ...(item.url
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: sanitize(item.url),
                  size: ctx.baseFontSize * 2,
                  color: ctx.getColor("links", "0563C1"),
                }),
              ],
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
      ...(item.summary
        ? [
            new Paragraph({
              children: parseMarkdown(item.summary, ctx.baseFontSize),
              spacing: { line: ctx.lineHeight },
            }),
          ]
        : []),
    ]),
  ]);
};

// ============================================================
// Section Generator Map
// ============================================================

const sectionGenerators: Record<string, (ctx: DocxContext) => (Paragraph | Table)[] | null> = {
  summary: createSummary,
  work: createWork,
  education: createEducation,
  skills: createSkills,
  projects: createProjects,
  certificates: createCertificates,
  languages: createLanguages,
  interests: createInterests,
  publications: createPublications,
  awards: createAwards,
  references: createReferences,
  custom: createCustom,
};

// ============================================================
// Header Generator
// ============================================================

const createHeader = (ctx: DocxContext): Paragraph[] => {
  const { resume, baseFontSize, lineHeight, getColor } = ctx;
  
  const paragraphs: Paragraph[] = [];

  // Name
  paragraphs.push(
    new Paragraph({
      text: sanitize(resume.basics.name || "YOUR NAME").toUpperCase(),
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      run: {
        size: 28 * 2,
        bold: true,
        color: getColor("name"),
        font: "Times New Roman",
      },
      spacing: { line: lineHeight },
    }),
  );

  // Title/Label
  paragraphs.push(
    new Paragraph({
      text: sanitize(resume.basics.label || ""),
      alignment: AlignmentType.CENTER,
      run: {
        size: 14 * 2,
        color: getColor("title", "666666"),
        font: "Times New Roman",
      },
      spacing: { after: 200, line: lineHeight },
    }),
  );

  // Contact Info
  const locationStr = [resume.basics.location.city, resume.basics.location.country]
    .filter(Boolean)
    .join(", ");
  const contactParts = [
    resume.basics.email,
    resume.basics.phone,
    locationStr,
    resume.basics.url,
  ].filter(Boolean);

  const profileNames = resume.basics.profiles?.map((p) => p.network) || [];

  paragraphs.push(
    new Paragraph({
      children: [
        ...contactParts.flatMap((part, index) => [
          new TextRun({
            text: sanitize(part!),
            size: baseFontSize * 2,
          }),
          index < contactParts.length - 1 || profileNames.length > 0
            ? new TextRun({ text: " | ", size: baseFontSize * 2 })
            : new TextRun(""),
        ]),
        ...profileNames.flatMap((name, index) => [
          new TextRun({
            text: sanitize(name),
            size: baseFontSize * 2,
            color: getColor("links", "0563C1"),
          }),
          index < profileNames.length - 1
            ? new TextRun({ text: " | ", size: baseFontSize * 2 })
            : new TextRun(""),
        ]),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400, line: lineHeight },
      border: {
        bottom: {
          color: getColor("decorations"),
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    }),
  );

  return paragraphs;
};

// ============================================================
// Two-Column Layout Generator
// ============================================================

const createTwoColumnLayout = (
  ctx: DocxContext,
  order: string[],
  leftColWidth: number
): Table => {
  const LHS_SECTIONS = [
    "skills",
    "education",
    "languages",
    "interests",
    "awards",
    "certificates",
    "references",
  ];

  const leftSections = order.filter((id) => LHS_SECTIONS.includes(id));
  const rightSections = order.filter((id) => !LHS_SECTIONS.includes(id));

  const leftContent: (Paragraph | Table)[] = [];
  leftSections.forEach((id) => {
    const gen = sectionGenerators[id];
    if (gen) {
      const c = gen(ctx);
      if (c) leftContent.push(...c);
    }
  });

  const rightContent: (Paragraph | Table)[] = [];
  rightSections.forEach((id) => {
    const gen = sectionGenerators[id];
    if (gen) {
      const c = gen(ctx);
      if (c) rightContent.push(...c);
    }
  });

  const tableWidth = 10906;
  const col1Width = Math.floor((tableWidth * leftColWidth) / 100);
  const col2Width = tableWidth - col1Width;

  return new Table({
    layout: TableLayoutType.FIXED,
    width: { size: tableWidth, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "auto" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
      left: { style: BorderStyle.NONE, size: 0, color: "auto" },
      right: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
    },
    rows: [
      new TableRow({
        cantSplit: false,
        children: [
          new TableCell({
            width: { size: col1Width, type: WidthType.DXA },
            children: leftContent.length ? leftContent : [new Paragraph("")],
          }),
          new TableCell({
            width: { size: col2Width, type: WidthType.DXA },
            children: rightContent.length ? rightContent : [new Paragraph("")],
            margins: { left: 400 },
          }),
        ],
      }),
    ],
  });
};

// ============================================================
// Main Export Function
// ============================================================

export const generateDocx = async (resume: Resume): Promise<Blob> => {
  const settings = (resume.meta.layoutSettings || {}) as LayoutSettings;
  const baseFontSize = settings.fontSize || 10;
  const sectionMargin = settings.sectionMargin ? settings.sectionMargin * 20 : 200;
  const columnCount = 1; // Force single column for ATS compatibility
  const leftColWidth = settings.leftColumnWidth || 30;
  const lineHeight = (settings.lineHeight || 1.2) * 240;

  // Theme colors
  const themeColor = resume.meta.themeColor || "#000000";
  const colorTargets = settings.themeColorTarget || [
    "headings",
    "links",
    "icons",
    "decorations",
  ];

  const getColor = (target: string, fallback: string = "000000"): string => {
    return colorTargets.includes(target)
      ? themeColor.replace("#", "")
      : fallback;
  };

  // Create context
  const ctx: DocxContext = {
    resume,
    baseFontSize,
    sectionMargin,
    lineHeight,
    getColor,
  };

  // Section order
  const order = settings.sectionOrder || [
    "summary",
    "work",
    "education",
    "skills",
    "projects",
  ];

  // Build document content
  const children: (Paragraph | Table)[] = [];

  // Add header
  children.push(...createHeader(ctx));

  // Add body sections
  if (columnCount === 1) {
    order.forEach((sectionId) => {
      const gen = sectionGenerators[sectionId];
      if (gen) {
        const content = gen(ctx);
        if (content) children.push(...content);
      }
    });
  } else {
    children.push(createTwoColumnLayout(ctx, order, leftColWidth));
  }

  // Create document
  try {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 12240, // 8.5 inches in twips
                height: 15840, // 11 inches in twips (US Letter)
              },
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const uint8Array = new Uint8Array(buffer);
    return new Blob([uint8Array], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  } catch (error) {
    console.error("[DOCX Generator] Error creating document:", error);
    throw error;
  }
};
