# Contributing New Templates

This guide will help you create and integrate new resume templates into the Resume Builder using the **factory-based template system**.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Step-by-Step Guide](#step-by-step-guide)
- [Configuration Options](#configuration-options)
- [Testing Your Template](#testing-your-template)
- [Best Practices](#best-practices)
- [Submission Checklist](#submission-checklist)

## Overview

Templates use a **factory pattern** with **composable themes**. Instead of writing 500+ lines of custom rendering code, you define configuration objects (~20-50 lines) that describe your template's appearance.

The system provides:
- **Preset configurations** for typography, headings, layouts, and more
- **Universal section components** for consistent rendering
- **Automatic PDF generation** from configuration

### Key Files

| File | Purpose |
|------|---------|
| `lib/theme-system.ts` | Theme presets and template theme definitions |
| `components/templates/FactoryTemplates.tsx` | Template configurations and exports |
| `lib/constants.ts` | Template type definitions and TEMPLATES array |

## Quick Start

**Fastest way to add a template:**

1. Add theme to `TEMPLATE_THEMES` in `lib/theme-system.ts`
2. Add config to `FactoryTemplates.tsx`
3. Register in `lib/constants.ts`

That's it! See [Step-by-Step Guide](#step-by-step-guide) for details.

## Step-by-Step Guide

### Step 1: Define the Theme

Add your template theme to `TEMPLATE_THEMES` in `lib/theme-system.ts`:

```typescript
export const TEMPLATE_THEMES: Record<string, ThemeConfig> = {
  // ... existing templates ...

  yourTemplate: {
    typography: "modern",        // Pick from: modern, classic, professional, creative, ats, minimal, monospace
    headings: "underline",       // Pick from: underline, bottomBorder, filled, accent, framed, plain, code
    layout: "singleColumn",      // Pick from: singleColumn, singleColumnCentered, twoColumnLeft, twoColumnWide, threeColumn
    entries: "compact",          // Pick from: traditional, compact, modern, timeline
    contact: "iconPipe",         // Pick from: iconPipe, iconDash, bullet, bar
    overrides: {
      // Custom overrides (any LayoutSettings property)
      headerBottomMargin: 15,
      sectionMargin: 8,
      fontSize: 10,
    },
  },
};
```

### Step 2: Add Template Configuration

Add your template config in `components/templates/FactoryTemplates.tsx`:

```typescript
const yourTemplateConfig: TemplateConfig = {
  id: "yourTemplate",              // Must match key in TEMPLATE_THEMES
  name: "Your Template",
  layoutType: "single-column",     // Layout structure
  defaultThemeColor: "#3b82f6",    // Default accent color
  
  // Optional: For multi-column layouts
  leftColumnSections: ["skills", "education", "languages"],
  rightColumnSections: ["summary", "work", "projects"],
  
  // Optional: Additional overrides
  themeOverrides: {
    fontFamily: "Open Sans",
  },
};

// Create template instance
const yourTemplate = createTemplate(yourTemplateConfig);

// Export for backwards compatibility
export const YourTemplate = yourTemplate.Template;
export const generateYourTemplatePDF = yourTemplate.generatePDF;

// Add to FACTORY_TEMPLATES registry
export const FACTORY_TEMPLATES = {
  // ... existing templates ...
  yourTemplate: yourTemplate,
};
```

### Step 3: Register in Constants

Add to `lib/constants.ts`:

```typescript
export type TemplateType = "ats" | ... | "yourTemplate";

export const TEMPLATES = [
  // ... existing templates ...
  {
    id: "yourTemplate",
    name: "Your Template",
    description: "Brief description of your template",
  },
];
```

### Step 4: Test Your Template

Your template is now available in the editor's template picker!

---

## Configuration Options

### Layout Types

| Type | Description |
|------|-------------|
| `single-column` | Traditional single column |
| `single-column-centered` | Single column, centered header |
| `two-column-sidebar-left` | Sidebar on left |
| `two-column-sidebar-right` | Sidebar on right |
| `two-column-equal` | Two equal-width columns |
| `three-column` | Three columns |
| `creative-sidebar` | Creative layout with background |

### Advanced TemplateConfig Options

```typescript
interface TemplateConfig {
  // Required
  id: string;
  name: string;
  layoutType: LayoutType;
  
  // Common
  defaultThemeColor?: string;
  leftColumnSections?: string[];
  rightColumnSections?: string[];
  middleColumnSections?: string[];  // For three-column
  themeOverrides?: Partial<LayoutSettings>;
  
  // Custom Header
  headerComponent?: React.ComponentType<HeaderProps>;
  
  // Full-Width Header
  fullWidthHeader?: boolean;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  
  // Sidebar Styling
  sidebarBackground?: boolean;
  sidebarBackgroundColor?: string;
  sidebarTextColor?: string;
  sidebarPaddingRight?: number;
  sidebarPaddingLeft?: number;
  
  // Right Column Styling
  rightColumnBackgroundColor?: string;
  rightColumnTextColor?: string;
  
  // Page Styling
  pageBackgroundColor?: string;
  cardBackgroundColor?: string;
  cardBorderColor?: string;
}
```

### Theme Presets Reference

**Typography Presets:**
- `modern` - Open Sans, clean sans-serif
- `classic` - Times-Roman, traditional serif
- `professional` - Roboto, professional sans-serif
- `creative` - Montserrat, bold geometric
- `ats` - Roboto, ATS-friendly sizing
- `minimal` - Helvetica, minimal look
- `monospace` - Courier, developer style

**Heading Presets:**
- `underline` - Solid underline (style 3)
- `bottomBorder` - Bottom border only (style 2)
- `filled` - Background fill (style 4)
- `accent` - Left accent bar (style 5)
- `framed` - Top and bottom border (style 6)
- `plain` - No decoration (style 1)
- `code` - Code style with hash (style 9)

**Entry Presets:**
- `traditional` - Subtitle on next line
- `compact` - Subtitle on same line
- `modern` - Bold subtitles
- `timeline` - Timeline layout with date column

---

## Testing Your Template

### 1. Local Development

```bash
npm run dev
```

Navigate to `/editor` and select your template from the design settings.

### 2. Test with Different Data

- Test with minimal data (just name and one job)
- Test with extensive data (multiple jobs, education, skills)
- Test with rich text formatting (bold, italic, bullets)
- Test with and without profile image
- Test different theme colors

### 3. Check Layout

- Ensure content doesn't overflow pages
- Test page breaks (long work histories)
- Verify spacing is consistent
- Check multi-column layouts don't overlap

### 4. Print Quality

Download the PDF and verify:
- Fonts render correctly
- Colors print well (not too light)
- Text is readable at actual size
- No pixelation or artifacts

---

## Best Practices

### 1. Use Existing Presets

Leverage the preset system instead of custom overrides when possible:

```typescript
// Good: Use presets
{
  typography: "modern",
  headings: "underline",
}

// Avoid: Lots of custom overrides for common patterns
{
  overrides: {
    fontFamily: "Open Sans",
    nameFontSize: 32,
    sectionHeadingStyle: 3,
    // ... many more
  }
}
```

### 2. Keep Overrides Minimal

Only override what's truly unique to your template:

```typescript
{
  typography: "modern",
  headings: "accent",
  overrides: {
    headerBottomMargin: 20,  // Just the unique parts
    skillsDisplayStyle: "bubble",
  }
}
```

### 3. Test Edge Cases

- Very long names
- Many work entries (page breaks)
- Missing optional fields
- Different theme colors

### 4. Consistent Spacing

Use the spacing guidelines:
- Compact: `sectionMargin: 4-6`
- Standard: `sectionMargin: 8-10`
- Spacious: `sectionMargin: 12-16`

---

## Submission Checklist

Before submitting your template:

- [ ] Theme added to `TEMPLATE_THEMES` in `lib/theme-system.ts`
- [ ] Config added to `FactoryTemplates.tsx`
- [ ] Template created with `createTemplate(config)`
- [ ] Exports added for component and PDF generator
- [ ] Added to `FACTORY_TEMPLATES` registry
- [ ] Type and entry added to `lib/constants.ts`
- [ ] Tested with minimal and extensive data
- [ ] Tested all layout settings
- [ ] Tested theme color changes
- [ ] PDF renders without errors
- [ ] No content overflow issues
- [ ] All sections render correctly

---

## Advanced: Custom Header Components

For templates needing unique headers (like `stylish` or `developer2`), create a custom header component:

```typescript
// components/templates/headers/MyCustomHeader.tsx
import { View, Text } from "@react-pdf/renderer";
import type { HeaderProps } from "@/lib/template-factory";

export const MyCustomHeader: React.FC<HeaderProps> = ({
  basics,
  settings,
  fonts,
  getColor,
  fontSize,
  align,
  headerTextColor,
}) => {
  return (
    <View>
      <Text style={{ color: headerTextColor || getColor("name") }}>
        {basics.name}
      </Text>
      {/* Custom header layout */}
    </View>
  );
};

// Use in config:
const myConfig: TemplateConfig = {
  id: "myTemplate",
  name: "My Template",
  layoutType: "creative-sidebar",
  headerComponent: MyCustomHeader,
  // ...
};
```

---

## Need Help?

- Review existing templates in `FactoryTemplates.tsx` for examples
- Check `lib/theme-system.ts` for available presets
- See `TEMPLATE_DEVELOPMENT_GUIDE.md` for detailed documentation
- Test frequently during development

---

**Happy template designing! 🎨** We look forward to your contributions!