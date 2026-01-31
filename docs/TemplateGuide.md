# Template System Guide

The project uses a **Template Factory** system with **composable themes**. This removes the need for individual `*Template.tsx` files and allows creating new templates with minimal configuration.

## 📁 Key Files

| File                                            | Purpose                                                                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **`lib/theme-system.ts`**                       | **Start Here.** The central database for all template themes, presets, and configurations.                            |
| **`lib/template-factory.tsx`**                  | The "engine" that renders PDFs based on configs. Handles layouts, sections, and styling.                              |
| **`components/templates/FactoryTemplates.tsx`** | Template configurations and exports. New templates are defined and registered here.                                   |
| **`lib/constants.ts`**                          | Template type definitions and TEMPLATES array for UI display.                                                         |

---

## 🏗 Architecture Overview

```
Template = TemplateConfig + ThemeConfig + Core Components
         = Factory Function + Theme Presets + Universal Sections
```

### Configuration Hierarchy (Priority Order)

1. **TemplateConfig Overrides** (`FactoryTemplates.tsx`) - Highest Priority
   - Template-specific layout and styling
2. **ThemeConfig Overrides** (`theme-system.ts` → `TEMPLATE_THEMES`)
   - Theme-specific styling using presets
3. **Preset Defaults** (`theme-system.ts` → Various `*_PRESETS`)
   - Reusable configurations for typography, headings, etc.
4. **Base Theme** (`theme-system.ts` → `BASE_THEME`) - Lowest Priority
   - Core defaults shared by all templates

---

## 🛠 How to Modify an Existing Template

### Quick Changes via Theme System

1. Open `lib/theme-system.ts`
2. Find `TEMPLATE_THEMES` (near line 570)
3. Locate the template ID (e.g., `creative`, `modern`)
4. Modify the configuration:

```typescript
creative: {
  typography: "creative",     // Use a different preset
  headings: "accent",         // Change heading style
  layout: "twoColumnWide",
  entries: "modern",
  contact: "iconDash",
  overrides: {
    headerBottomMargin: 30,   // Custom spacing
    nameFontSize: 24,         // Override preset value
    skillsDisplayStyle: "bubble",
  }
}
```

### Layout & Structure Changes

For layout-specific changes (columns, sidebar, header), edit `FactoryTemplates.tsx`:

```typescript
const creativeConfig: TemplateConfig = {
  id: "creative",
  name: "Creative",
  layoutType: "creative-sidebar",           // Layout structure
  sidebarBackground: true,
  sidebarBackgroundColor: "#f4f4f0",
  leftColumnSections: ["summary", "certificates", "languages"],
  rightColumnSections: ["work", "education", "skills"],
  themeOverrides: { /* additional overrides */ },
};
```

---

## ➕ How to Add a New Template

### Step 1: Define the Theme (`lib/theme-system.ts`)

Add a new entry to `TEMPLATE_THEMES`:

```typescript
export const TEMPLATE_THEMES: Record<string, ThemeConfig> = {
  // ... existing templates ...

  myNewTemplate: {
    typography: "modern",        // Pick from TYPOGRAPHY_PRESETS
    headings: "underline",       // Pick from HEADING_PRESETS
    layout: "singleColumn",      // Pick from LAYOUT_PRESETS
    entries: "compact",          // Pick from ENTRY_PRESETS
    contact: "iconPipe",         // Pick from CONTACT_PRESETS
    overrides: {
      headerBottomMargin: 15,
      fontSize: 10,
      // Any LayoutSettings property
    }
  }
};
```

### Step 2: Create Template Config (`FactoryTemplates.tsx`)

Add a configuration object:

```typescript
const myNewConfig: TemplateConfig = {
  id: "myNewTemplate",          // Must match key in TEMPLATE_THEMES
  name: "My New Template",
  layoutType: "single-column",  // Layout type
  defaultThemeColor: "#3b82f6",
  // Optional: For multi-column layouts
  leftColumnSections: ["skills", "education"],
  rightColumnSections: ["summary", "work", "projects"],
};

// Create template instance
const myNew = createTemplate(myNewConfig);

// Export for backwards compatibility
export const MyNewTemplate = myNew.Template;
export const generateMyNewPDF = myNew.generatePDF;
```

### Step 3: Register in FACTORY_TEMPLATES

```typescript
export const FACTORY_TEMPLATES = {
  // ... existing templates ...
  myNewTemplate: myNew,
};
```

### Step 4: Add to Constants (`lib/constants.ts`)

```typescript
export type TemplateType = "ats" | ... | "myNewTemplate";

export const TEMPLATES = [
  // ... existing templates ...
  {
    id: "myNewTemplate",
    name: "My New Template",
    description: "Brief description of your template",
  },
];
```

---

## 📐 Available Presets

### Typography Presets (`TYPOGRAPHY_PRESETS`)

| Preset       | Font Family   | Description                    |
|--------------|---------------|--------------------------------|
| `modern`     | Open Sans     | Clean sans-serif               |
| `classic`    | Times-Roman   | Traditional serif              |
| `professional`| Roboto       | Clean professional sans-serif  |
| `creative`   | Montserrat    | Bold geometric sans-serif      |
| `ats`        | Roboto        | ATS-friendly, larger sizes     |
| `minimal`    | Helvetica     | Clean minimal look             |
| `monospace`  | Courier       | Developer/code style           |

### Heading Presets (`HEADING_PRESETS`)

| Preset       | Style | Description                          |
|--------------|-------|--------------------------------------|
| `underline`  | 3     | Solid underline                      |
| `bottomBorder`| 2    | Bottom border only                   |
| `filled`     | 4     | Background fill                      |
| `accent`     | 5     | Left accent bar                      |
| `framed`     | 6     | Top and bottom border                |
| `plain`      | 1     | No decoration                        |
| `code`       | 9     | Code style with hash prefix          |

### Layout Presets (`LAYOUT_PRESETS`)

| Preset              | Columns | Description                    |
|---------------------|---------|--------------------------------|
| `singleColumn`      | 1       | Traditional single column      |
| `singleColumnCentered`| 1     | Single column, centered header |
| `twoColumnLeft`     | 2       | Sidebar on left                |
| `twoColumnWide`     | 2       | Wider main content             |
| `threeColumn`       | 3       | Three columns                  |

### Entry Presets (`ENTRY_PRESETS`)

| Preset       | Description                              |
|--------------|------------------------------------------|
| `traditional`| Clear hierarchy, subtitle on next line   |
| `compact`    | Subtitle on same line                    |
| `modern`     | Bold subtitles, same line                |
| `timeline`   | Timeline layout with left date column    |

### Contact Presets (`CONTACT_PRESETS`)

| Preset     | Description                    |
|------------|--------------------------------|
| `iconPipe` | Icons with pipe separator      |
| `iconDash` | Icons with dash separator      |
| `bullet`   | Bullet points                  |
| `bar`      | Plain text with bar            |

---

## 🎨 Layout Types

| Type                      | Description                           |
|---------------------------|---------------------------------------|
| `single-column`           | Traditional single column             |
| `single-column-centered`  | Single column, centered header        |
| `two-column-sidebar-left` | Sidebar on left                       |
| `two-column-sidebar-right`| Sidebar on right                      |
| `two-column-equal`        | Two equal-width columns               |
| `three-column`            | Three columns                         |
| `creative-sidebar`        | Creative layout with background color |

---

## 🔧 TemplateConfig Properties

```typescript
interface TemplateConfig {
  id: string;                      // Unique identifier
  name: string;                    // Display name
  layoutType: LayoutType;          // Layout structure
  baseTheme?: string;              // Base theme to inherit
  themeOverrides?: Partial<LayoutSettings>;  // Style overrides
  defaultThemeColor?: string;      // Default accent color
  
  // Column sections (for multi-column layouts)
  leftColumnSections?: string[];
  middleColumnSections?: string[];
  rightColumnSections?: string[];
  
  // Advanced options
  headerComponent?: React.ComponentType;  // Custom header
  fullWidthHeader?: boolean;              // Full-width header
  headerBackgroundColor?: string;         // Header background
  headerTextColor?: string;               // Header text color
  sidebarBackground?: boolean;            // Sidebar background
  sidebarBackgroundColor?: string;
  sidebarTextColor?: string;
  rightColumnBackgroundColor?: string;
  rightColumnTextColor?: string;
  pageBackgroundColor?: string;
  cardBackgroundColor?: string;
  cardBorderColor?: string;
}
```

---

## 📋 Available Templates

| ID            | Layout                    | Description                     |
|---------------|---------------------------|---------------------------------|
| `ats`         | Single column             | ATS-friendly, clean layout      |
| `classic`     | Single column centered    | Traditional serif design        |
| `modern`      | Single column             | Minimalist, modern typography   |
| `creative`    | Creative sidebar          | Two-column with sidebar         |
| `professional`| Two-column sidebar left   | Professional two-column         |
| `elegant`     | Single column             | Sophisticated single column     |
| `classic-slate`| Two-column sidebar left  | Elegant bordered sections       |
| `glow`        | Single column             | Dark header, high contrast      |
| `multicolumn` | Three column              | Dense three-column layout       |
| `stylish`     | Two-column sidebar left   | Wave header, modern design      |
| `timeline`    | Single column             | Timeline entry layout           |
| `polished`    | Creative sidebar          | Colored sidebar, clean design   |
| `developer`   | Creative sidebar          | Dark theme, code style          |
| `developer2`  | Creative sidebar          | Vertical name, dark theme       |

---

## 🐛 Troubleshooting

### Styles not applying
1. Check configuration hierarchy (TemplateConfig > ThemeConfig > Presets > BASE_THEME)
2. Verify property names match `LayoutSettings` interface
3. Ensure template ID matches in both `FactoryTemplates.tsx` and `theme-system.ts`

### Layout problems
1. Verify `layoutType` matches intended structure
2. Check column section assignments
3. Test with different content amounts

### Typography issues
1. Ensure font family is registered in `lib/fonts.ts`
2. Check fontSize relationships (name, title, contact)
3. Verify preset is correctly referenced

---

## 🚀 Quick Reference

### Adding a Simple Template

```typescript
// 1. theme-system.ts - Add theme
myTemplate: {
  typography: "modern",
  headings: "underline",
  layout: "singleColumn",
  entries: "compact",
  contact: "iconPipe",
}

// 2. FactoryTemplates.tsx - Add config and create
const myConfig: TemplateConfig = {
  id: "myTemplate",
  name: "My Template",
  layoutType: "single-column",
};
const my = createTemplate(myConfig);
export const MyTemplate = my.Template;

// 3. Add to FACTORY_TEMPLATES
myTemplate: my,

// 4. constants.ts - Add type and entry
{ id: "myTemplate", name: "My Template", description: "..." }
```