# Template Development Guide

Complete guide for creating and modifying resume templates using the factory-based template system.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Creating a New Template](#creating-a-new-template)
3. [Modifying Existing Templates](#modifying-existing-templates)
4. [Configuration Reference](#configuration-reference)
5. [Theme System](#theme-system)
6. [Core Components](#core-components)
7. [Advanced Customization](#advanced-customization)
8. [Best Practices](#best-practices)

---

## Architecture Overview

The template system uses a **factory pattern** with **composable themes** and **universal components**:

```
Template = TemplateConfig + ThemeConfig + Core Components
         = Factory Function + Theme Presets + Universal Sections
```

### System Hierarchy (Priority Order)

1. **TemplateConfig Overrides** (Highest Priority)
   - File: `components/templates/FactoryTemplates.tsx`
   - Purpose: Template-specific layout, colors, and structural options

2. **ThemeConfig Overrides** (High Priority)
   - File: `lib/theme-system.ts` → `TEMPLATE_THEMES[templateId].overrides`
   - Purpose: Template-specific styling using theme presets

3. **Preset Defaults** (Medium Priority)
   - File: `lib/theme-system.ts` → `*_PRESETS` (Typography, Heading, Layout, Entry, Contact)
   - Purpose: Reusable configurations shared across templates

4. **Base Theme** (Lowest Priority)
   - File: `lib/theme-system.ts` → `BASE_THEME`
   - Purpose: Fallback values for all templates

### File Structure

```
lib/
├── template-factory.tsx     # Factory function + layout rendering
├── theme-system.ts          # Theme presets + template themes + base settings
├── constants.ts             # Template types and TEMPLATES array
components/templates/
├── FactoryTemplates.tsx     # Template configs + exports + registry
├── core/                    # Universal components
│   ├── primitives/         # Basic building blocks (ContactInfo, SectionHeading, etc.)
│   └── sections/           # Content sections (WorkSection, SkillsSection, etc.)
├── headers/                # Custom header components
└── index.ts                # Template exports
```

---

## Creating a New Template

### Step 1: Add Theme Configuration

Add your template theme to `TEMPLATE_THEMES` in `lib/theme-system.ts`:

```typescript
export const TEMPLATE_THEMES: Record<string, ThemeConfig> = {
  // ... existing templates

  myTemplate: {
    typography: "modern",           // Pick from TYPOGRAPHY_PRESETS
    headings: "underline",          // Pick from HEADING_PRESETS
    layout: "singleColumn",         // Pick from LAYOUT_PRESETS
    entries: "compact",             // Pick from ENTRY_PRESETS
    contact: "iconPipe",            // Pick from CONTACT_PRESETS
    overrides: {
      // Any LayoutSettings property
      headerBottomMargin: 15,
      sectionMargin: 8,
      fontSize: 10,
      entryTitleSize: "L",
      contactSeparator: "pipe",
    },
  },
};
```

### Step 2: Add Template Configuration

Add your template to `components/templates/FactoryTemplates.tsx`:

```typescript
const myTemplateConfig: TemplateConfig = {
  id: "myTemplate",                    // Must match key in TEMPLATE_THEMES
  name: "My Custom Template",
  layoutType: "single-column",         // Layout structure
  defaultThemeColor: "#3b82f6",        // Default accent color
  
  // Optional: For multi-column layouts
  leftColumnSections: [
    "skills", "education", "languages"
  ],
  rightColumnSections: [
    "summary", "work", "projects"
  ],
  
  // Optional: Additional overrides (highest priority)
  themeOverrides: {
    fontFamily: "Open Sans",
  },
};

// Create template instance
const myTemplate = createTemplate(myTemplateConfig);
```

### Step 3: Export Template

Add exports in the same file:

```typescript
// Export for backwards compatibility
export const MyTemplate = myTemplate.Template;
export const generateMyTemplatePDF = myTemplate.generatePDF;

// Add to FACTORY_TEMPLATES registry
export const FACTORY_TEMPLATES = {
  // ... existing templates
  myTemplate: myTemplate,
};
```

### Step 4: Register in Constants

Add to `lib/constants.ts`:

```typescript
export type TemplateType = "ats" | ... | "myTemplate";

export const TEMPLATES = [
  // ... existing templates
  {
    id: "myTemplate",
    name: "My Custom Template",
    description: "Brief description of your template",
  },
];
```

### Step 5: Test Your Template

The template is now available in the editor's template picker:

```typescript
import { MyTemplate } from "@/components/templates";

// Use in your application
<MyTemplate resume={resumeData} />
```

---

## Modifying Existing Templates

### Quick Styling Changes via Theme System

Edit `lib/theme-system.ts` → `TEMPLATE_THEMES`:

#### Change Presets
```typescript
classic: {
  typography: "modern",      // Changed from "classic"
  headings: "filled",        // Changed heading style
  // ...
}
```

#### Add Overrides
```typescript
classic: {
  typography: "classic",
  headings: "underline",
  // ...
  overrides: {
    headerBottomMargin: 20,  // Custom spacing
    nameFontSize: 28,        // Custom font size
    skillsDisplayStyle: "bubble",
  }
}
```

### Layout & Structure Changes

Edit `components/templates/FactoryTemplates.tsx` for layout-specific changes:

#### Change Layout Type
```typescript
const classicConfig: TemplateConfig = {
  id: "classic",
  layoutType: "two-column-sidebar-left",  // Changed from single-column
  // ...
};
```

#### Adjust Column Sections
```typescript
{
  leftColumnSections: [
    "skills", "education", "languages"
  ],
  rightColumnSections: [
    "summary", "work", "projects", "custom"
  ],
}
```

#### Add Sidebar Background
```typescript
{
  layoutType: "creative-sidebar",
  sidebarBackground: true,
  sidebarBackgroundColor: "#f4f4f0",
  sidebarTextColor: "#333333",
}
```

#### Full-Width Header
```typescript
{
  fullWidthHeader: true,
  headerBackgroundColor: "#1F2937",
  headerTextColor: "#FFFFFF",
}
```

### Common Styling Overrides

#### Typography
```typescript
{
  fontFamily: "Times-Roman",
  fontSize: 9,
  nameFontSize: 24,
  lineHeight: 1.2,
}
```

#### Spacing
```typescript
{
  sectionMargin: 8,           // Space between sections
  headerBottomMargin: 15,     // Space after header
  bulletMargin: 2,            // Space for bullet lists
}
```

#### Section Headings
```typescript
{
  sectionHeadingStyle: 3,            // 1-9, see styles below
  sectionHeadingAlign: "left",       // left, center, right
  sectionHeadingCapitalization: "uppercase",
  sectionHeadingBold: true,
  sectionHeadingSize: "M",           // S, M, L, XL
}
```

#### Entry Styling
```typescript
{
  entryLayoutStyle: 1,              // Layout variant (1-3)
  entryTitleSize: "M",              // S, M, L
  entrySubtitleStyle: "italic",     // normal, bold, italic
  entrySubtitlePlacement: "sameLine", // sameLine, nextLine
  entryListStyle: "bullet",         // bullet, number, hyphen, blank
}
```

---

## Configuration Reference

### Layout Types

| Type | Description | Columns | Header |
|------|-------------|---------|--------|
| `single-column` | Traditional single column | 1 | Top |
| `single-column-centered` | Single column, centered header | 1 | Top (centered) |
| `two-column-sidebar-left` | Sidebar on left | 2 | Top |
| `two-column-sidebar-right` | Sidebar on right | 2 | Top |
| `two-column-equal` | Two equal-width columns | 2 | Top |
| `three-column` | Three columns | 3 | Top |
| `creative-sidebar` | Creative layout with background | 2 | Left column |

### Section Heading Styles

| Style | Visual | Description |
|-------|--------|-------------|
| 1 | `Title` | Plain, no decoration |
| 2 | `Title` ─ | Bottom border only |
| 3 | `Title` ═ | Solid underline |
| 4 | ▐`Title`▌ | Background fill |
| 5 | │ `Title` | Left accent bar |
| 6 | ─`Title`─ | Top and bottom border |
| 7 | `Title` ┄ | Dashed underline |
| 8 | `Title` | Plain/Minimal |
| 9 | `# Title` | Code style with hash prefix |

### Size Options

| Size | Multiplier | Use Case |
|------|------------|----------|
| `S` | +0 | Small headings |
| `M` | +1 | Standard size |
| `L` | +2 | Large headings |
| `XL` | +4 | Extra large |

### List Styles

| Style | Visual | Description |
|-------|--------|-------------|
| `bullet` | • Item | Bullet points |
| `number` | 1. Item | Numbered list |
| `hyphen` | - Item | Hyphen bullets |
| `blank` | Item | No bullets |
| `inline` | Item, Item | Comma-separated |

### Skills Display Styles

| Style | Description |
|-------|-------------|
| `grid` | Grid layout |
| `bubble` | Chip/pill style |
| `boxed` | Bordered boxes |
| `level` | With proficiency indicators |
| `inline` | Comma-separated list |

---

## Theme System

### Available Presets

The theme system provides reusable preset configurations:

#### Typography Presets (`TYPOGRAPHY_PRESETS`)

| Preset | Font Family | Description |
|--------|-------------|-------------|
| `modern` | Open Sans | Clean sans-serif |
| `classic` | Times-Roman | Traditional serif |
| `professional` | Roboto | Clean professional |
| `creative` | Montserrat | Bold geometric |
| `ats` | Roboto | ATS-friendly |
| `minimal` | Helvetica | Clean minimal |
| `monospace` | Courier | Developer style |

#### Heading Presets (`HEADING_PRESETS`)

| Preset | Style | Description |
|--------|-------|-------------|
| `underline` | 3 | Solid underline |
| `bottomBorder` | 2 | Bottom border only |
| `filled` | 4 | Background fill |
| `accent` | 5 | Left accent bar |
| `framed` | 6 | Top and bottom border |
| `plain` | 1 | No decoration |
| `code` | 9 | Code style with hash |

#### Layout Presets (`LAYOUT_PRESETS`)

| Preset | Columns | Description |
|--------|---------|-------------|
| `singleColumn` | 1 | Traditional single column |
| `singleColumnCentered` | 1 | Centered header |
| `twoColumnLeft` | 2 | Sidebar on left |
| `twoColumnWide` | 2 | Wider main content |
| `threeColumn` | 3 | Three columns |

#### Entry Presets (`ENTRY_PRESETS`)

| Preset | Description |
|--------|-------------|
| `traditional` | Clear hierarchy, subtitle on next line |
| `compact` | Subtitle on same line |
| `modern` | Bold subtitles, same line |
| `timeline` | Timeline layout with left date column |

#### Contact Presets (`CONTACT_PRESETS`)

| Preset | Description |
|--------|-------------|
| `iconPipe` | Icons with pipe separator |
| `iconDash` | Icons with dash separator |
| `bullet` | Bullet points |
| `bar` | Plain text with bar |

### Creating Custom Theme Configurations

Add to `TEMPLATE_THEMES` in `lib/theme-system.ts`:

```typescript
myTheme: {
  typography: "modern",              // Pick from TYPOGRAPHY_PRESETS
  headings: "underline",             // Pick from HEADING_PRESETS
  layout: "singleColumn",            // Pick from LAYOUT_PRESETS
  entries: "compact",                // Pick from ENTRY_PRESETS
  contact: "iconPipe",               // Pick from CONTACT_PRESETS
  
  overrides: {
    // Custom overrides (any LayoutSettings property)
    fontSize: 9.5,
    headerBottomMargin: 10,
    sectionHeadingCapitalization: "capitalize",
    skillsDisplayStyle: "bubble",
  },
},
```

### Adding New Presets

You can add new presets to any of the `*_PRESETS` objects:

```typescript
// In TYPOGRAPHY_PRESETS:
myTypography: {
  fontFamily: "Source Sans Pro",
  nameFontSize: 28,
  nameLineHeight: 1.2,
  nameBold: true,
  nameLetterSpacing: 0.5,
  titleFontSize: 12,
  titleBold: false,
  titleItalic: true,
  contactFontSize: 10,
},

// In HEADING_PRESETS:
myHeadings: {
  sectionHeadingStyle: 4,
  sectionHeadingAlign: "left",
  sectionHeadingBold: true,
  sectionHeadingCapitalization: "uppercase",
  sectionHeadingSize: "L",
  sectionHeadingLetterSpacing: 1,
},
```

---

## Core Components

### Available Components

All components are located in `components/templates/core/`:

#### Primitives (`core/primitives/`)
- **SectionHeading**: Section titles with 9 visual styles
- **EntryHeader**: Job titles, company names, dates, URLs
- **ContactInfo**: Email, phone, location, social links
- **BulletList**: Formatted lists with various bullet styles
- **ProfileImage**: Profile photo with shape/border options
- **PDFRichText**: Rich text with bold, italic, links

#### Sections (`core/sections/`)
- **SummarySection**: Professional summary
- **WorkSection**: Employment history
- **EducationSection**: Academic background
- **SkillsSection**: Skills with proficiency levels
- **ProjectsSection**: Projects with descriptions
- **CertificatesSection**: Certifications
- **AwardsSection**: Awards and achievements
- **PublicationsSection**: Published works
- **ReferencesSection**: References
- **LanguagesSection**: Language proficiency
- **InterestsSection**: Personal interests
- **CustomSection**: User-defined content

### Component Props Pattern

All core components follow this pattern:

```typescript
export interface ComponentProps {
  // Data
  data: DataType[];              // The content to render
  
  // Settings  
  settings: LayoutSettings;      // Layout configuration
  fonts: FontConfig;             // Font configuration
  fontSize: number;              // Base font size
  getColor: GetColorFn;          // Color resolver function
  
  // Optional overrides
  lineHeight?: number;           // Line spacing
  sectionTitle?: string;         // Custom section title
  sectionMargin?: number;        // Custom spacing
  containerStyle?: object;       // Custom container styles
  textColor?: string;            // Override text color
}
```

---

## Advanced Customization

### Custom Section Components

Create template-specific section components:

```typescript
// components/templates/myTemplate/MyCustomSection.tsx
import React from "react";
import { View, Text } from "@react-pdf/renderer";

export const MyCustomSection: React.FC<MyCustomSectionProps> = ({
  data, settings, fonts, fontSize, getColor
}) => {
  // Custom implementation
  return (
    <View>
      <Text>Custom section content</Text>
    </View>
  );
};
```

Register in template config:

```typescript
{
  customComponents: {
    work: MyCustomWorkSection,        // Override work section
    skills: MyCustomSkillsSection,    // Override skills section
  }
}
```

### Theme Color Targeting

Control which elements use the theme color:

```typescript
{
  themeColorTarget: [
    "headings",      // Section headings
    "links",         // URLs and links
    "icons",         // Contact icons
    "decorations",   // Borders, underlines
    "accents",       // Accent elements
    "name",          // Name in header
  ]
}
```

### Custom Color Functions

```typescript
// Custom color logic
const getColor = (target: string, fallback: string = "#000000") => {
  const colorTargets = settings.themeColorTarget || [];
  
  if (target === "headings" && colorTargets.includes("headings")) {
    return resume.meta.themeColor;
  }
  
  if (target === "custom") {
    return "#ff6b35";  // Custom orange for special elements
  }
  
  return fallback;
};
```

### Dynamic Layouts

```typescript
// Conditional column assignment
const getSectionColumns = (settings: LayoutSettings) => {
  if (settings.skillsInSidebar) {
    return {
      leftColumnSections: [...defaultLeft, "skills"],
      rightColumnSections: defaultRight.filter(s => s !== "skills")
    };
  }
  return { leftColumnSections: defaultLeft, rightColumnSections: defaultRight };
};
```

---

## Best Practices

### 1. Configuration Hierarchy

**Use the right level for your changes:**

- **Template overrides**: Template-specific styling that should always apply
- **Theme overrides**: Shared styling for related templates
- **Base settings**: Global defaults that work for most templates

### 2. Spacing Guidelines

**Recommended spacing values:**

```typescript
// Compact templates (Classic, Professional)
{ 
  sectionMargin: 4-6,
  headerBottomMargin: 2-8,
  bulletMargin: 1-2 
}

// Standard templates (Modern, Elegant)
{ 
  sectionMargin: 8-10,
  headerBottomMargin: 12-15,
  bulletMargin: 2-3 
}

// Spacious templates (Creative, Designer)
{ 
  sectionMargin: 12-16,
  headerBottomMargin: 20-25,
  bulletMargin: 3-4 
}
```

### 3. Typography Scale

**Font size relationships:**

```typescript
{
  fontSize: 10,           // Base size
  nameFontSize: 24,       // ~2.4x base
  titleFontSize: 12,      // ~1.2x base  
  contactFontSize: 9,     // ~0.9x base
  sectionHeadingSize: "L" // +2 from base = 12pt
}
```

### 4. Theme Consistency

**Keep related templates consistent:**

```typescript
// All "professional" variants should share:
{
  typography: "professional",
  headings: "bottomBorder", 
  contact: "iconPipe",
  // Then customize with overrides
}
```

### 5. Component Reuse

**Leverage existing components:**

```typescript
// Good: Use existing primitives
<EntryHeader 
  title={job.company}
  subtitle={job.position}
  date={job.dateRange}
  // ... other props
/>

// Avoid: Custom implementations unless necessary
<Text>{job.company}</Text>
<Text>{job.position}</Text>  
```

### 6. Performance

**Minimize StyleSheet.create() calls:**

```typescript
// Good: Single stylesheet per component
const styles = StyleSheet.create({
  container: { marginBottom: sectionMargin },
  entry: { marginBottom: 8 },
  // ... all styles
});

// Avoid: Multiple stylesheets
const containerStyles = StyleSheet.create({...});
const entryStyles = StyleSheet.create({...});
```

### 7. Testing

**Test your templates:**

1. **Multiple resume sizes**: Test with minimal and extensive content
2. **Column layouts**: Ensure sections fit properly in assigned columns  
3. **Color combinations**: Test with different theme colors
4. **Font variations**: Test with different font families
5. **Spacing edge cases**: Very long names, many entries, etc.

---

## Migration from Legacy Templates

### Converting Existing Templates

1. **Identify unique styling** in the legacy template
2. **Map to configuration options** in the new system
3. **Create template config** with appropriate overrides
4. **Test and refine** spacing and styling
5. **Remove legacy files** once verified

### Example Migration

**Before (Legacy):**
```typescript
// 300+ lines of custom component code
export const MyLegacyTemplate = ({ resume }) => {
  // Lots of custom styling and layout code
};
```

**After (Factory):**
```typescript
// ~20 lines of configuration
myTemplate: {
  id: "myTemplate", 
  name: "My Template",
  layoutType: "single-column",
  defaultThemeColor: "#3b82f6",
  themeOverrides: {
    fontFamily: "Open Sans",
    sectionMargin: 8,
    sectionHeadingStyle: 2,
    // ... other unique styling
  },
}
```

---

## Troubleshooting

### Common Issues

**1. Styles not applying:**
- Check configuration hierarchy (TemplateConfig > ThemeConfig > Presets > BASE_THEME)
- Verify property names match `LayoutSettings` interface
- Ensure template ID matches in both `FactoryTemplates.tsx` and `theme-system.ts`

**2. Layout problems:**
- Check column section assignments (`leftColumnSections`, `rightColumnSections`)
- Verify `layoutType` matches intended structure
- Test with different content amounts

**3. Spacing issues:**
- Check `sectionMargin`, `headerBottomMargin`, `bulletMargin`
- Verify `lineHeight` isn't too tight/loose
- Test with varying content lengths

**4. Typography problems:**
- Ensure font family is registered in `lib/fonts.ts`
- Check fontSize relationships (name, title, contact)
- Verify `letterSpacing` values are reasonable

**5. Colors not showing:**
- Check `themeColorTarget` array includes the target element
- Verify `defaultThemeColor` is set in TemplateConfig
- Ensure `getColor` function is called correctly

---

## Quick Reference

### Template Creation Checklist

- [ ] Add theme to `TEMPLATE_THEMES` in `lib/theme-system.ts`
- [ ] Add config to `components/templates/FactoryTemplates.tsx`
- [ ] Create template with `createTemplate(config)`
- [ ] Export template component and PDF generator
- [ ] Add to `FACTORY_TEMPLATES` registry
- [ ] Add to `TemplateType` and `TEMPLATES` in `lib/constants.ts`
- [ ] Test with sample resume data
- [ ] Verify spacing and typography
- [ ] Test column layouts (if applicable)
- [ ] Check theme color integration
- [ ] Validate with different content sizes

### Essential TemplateConfig Properties

```typescript
interface TemplateConfig {
  // Required
  id: string;                      // Unique identifier
  name: string;                    // Display name
  layoutType: LayoutType;          // Layout structure
  
  // Common
  defaultThemeColor?: string;      // Default accent color
  leftColumnSections?: string[];   // Sections for left/sidebar column
  rightColumnSections?: string[];  // Sections for right/main column
  middleColumnSections?: string[]; // Sections for middle column (3-col)
  themeOverrides?: Partial<LayoutSettings>;  // Style overrides
  
  // Advanced
  headerComponent?: React.ComponentType;     // Custom header
  fullWidthHeader?: boolean;                 // Full-width header
  headerBackgroundColor?: string;            // Header background
  headerTextColor?: string;                  // Header text color
  sidebarBackground?: boolean;               // Enable sidebar background
  sidebarBackgroundColor?: string;
  sidebarTextColor?: string;
  rightColumnBackgroundColor?: string;
  rightColumnTextColor?: string;
  pageBackgroundColor?: string;
  cardBackgroundColor?: string;
  cardBorderColor?: string;
}
```

### Available Templates (14 total)

| ID | Name | Layout Type |
|----|------|-------------|
| `ats` | ATS Scanner | single-column |
| `classic` | Classic | single-column-centered |
| `modern` | Modern | single-column |
| `creative` | Creative | creative-sidebar |
| `professional` | Professional | two-column-sidebar-left |
| `elegant` | Elegant | single-column |
| `classic-slate` | Classic Slate | two-column-sidebar-left |
| `glow` | Glow | single-column |
| `multicolumn` | Multicolumn | three-column |
| `stylish` | Stylish | two-column-sidebar-left |
| `timeline` | Timeline | single-column |
| `polished` | Polished | creative-sidebar |
| `developer` | Developer | creative-sidebar |
| `developer2` | Developer 2 | creative-sidebar |

This guide covers the complete template development workflow. The factory-based system provides powerful customization while maintaining consistency and reducing code duplication.