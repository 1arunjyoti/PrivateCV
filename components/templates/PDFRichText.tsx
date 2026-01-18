import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";

// Define a recursive style type to match React-PDF's behavior
type PdfStyle = Style | Style[];

interface PDFRichTextProps {
  text: string;
  style?: PdfStyle;
  fontSize?: number;
  fontFamily?: string;
  boldFontFamily?: string;
  italicFontFamily?: string;
}

interface Context {
  fontSize: number;
  fontFamily: string;
  boldFontFamily: string;
  italicFontFamily: string;
  style: PdfStyle;
}

export const PDFRichText = ({
  text,
  style,
  fontSize = 10,
  fontFamily = "Times-Roman",
  boldFontFamily = "Times-Bold",
  italicFontFamily = "Times-Italic",
}: PDFRichTextProps) => {
  if (!text) return null;

  // Split text by newlines first to handle paragraphs/lists
  const lines = text.split("\n");

  return (
    <View style={{ flexDirection: "column" }}>
      {lines.map((line, lineIndex) => {
        // Handle Lists
        if (line.trim().startsWith("- ")) {
          const content = line.trim().substring(2);
          return (
            <View
              key={lineIndex}
              style={{ flexDirection: "row", marginLeft: 10, marginBottom: 2 }}
            >
              <Text style={{ fontSize, fontFamily, marginRight: 5 }}>•</Text>
              <Text style={{ flex: 1 }}>
                {renderInline(content, {
                  fontSize,
                  fontFamily,
                  boldFontFamily,
                  italicFontFamily,
                  style: style || {},
                })}
              </Text>
            </View>
          );
        }

        // Handle empty lines (spacing)
        if (!line.trim()) {
          return <View key={lineIndex} style={{ height: fontSize * 0.5 }} />;
        }

        // Handle Div Alignment (Basic support for wrapper divs)
        let align: "left" | "center" | "right" | "justify" = "justify"; // Default alignment
        let lineContent = line;

        if (line.includes('align="center"')) align = "center";
        if (line.includes('align="right"')) align = "right";
        if (line.includes('align="left"')) align = "left";
        if (line.includes('align="justify"')) align = "justify";

        // Strip div tags if present to just show text (naive strip)
        if (line.includes("<div")) {
          lineContent = lineContent
            .replace(/<div[^>]*>/g, "")
            .replace(/<\/div>/g, "");
        }

        return (
          <View key={lineIndex} style={{ marginBottom: 2 }}>
            <Text style={{ textAlign: align }}>
              {renderInline(lineContent, {
                fontSize,
                fontFamily,
                boldFontFamily,
                italicFontFamily,
                style: style || {},
              })}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

// Helper to render bold/italic/links inline
const renderInline = (text: string, ctx: Context) => {
  // We need a proper tokenizer for nested styles, but for now we'll do simplistic sequential replacement
  // or splitting. Since recursion is tricky with multiple regexes, let's try a split approach.

  // Supported: **bold**, *italic*, <u>underline</u>, [link](url)

  // We will split by one token type at a time.
  // Order: Bold -> Italic -> Underline -> Link

  // 1. Bold: **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const content = part.substring(2, part.length - 2);
      return (
        <Text
          key={i}
          style={{ fontFamily: ctx.boldFontFamily, fontWeight: "bold" }}
        >
          {renderItalic(content, ctx)}
        </Text>
      );
    }
    return renderItalic(part, ctx);
  });
};

const renderItalic = (text: string, ctx: Context) => {
  const parts = text.split(/(\*.*?\*)/g);
  return parts.map((part, i) => {
    // Only match *text* if it's not empty and valid
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      const content = part.substring(1, part.length - 1);
      return (
        <Text
          key={i}
          style={{ fontFamily: ctx.italicFontFamily, fontStyle: "italic" }}
        >
          {renderUnderline(content, ctx)}
        </Text>
      );
    }
    return renderUnderline(part, ctx);
  });
};

const renderUnderline = (text: string, ctx: Context) => {
  const parts = text.split(/(<u>.*?<\/u>)/g);
  return parts.map((part, i) => {
    if (part.startsWith("<u>") && part.endsWith("</u>")) {
      const content = part.substring(3, part.length - 4);
      return (
        <Text key={i} style={{ textDecoration: "underline" }}>
          {renderText(content, ctx)}
        </Text>
      );
    }
    return renderText(part, ctx);
  });
};

const renderText = (text: string, ctx: Context) => {
  // Determine style based on context/props
  // For now just return text node
  return (
    <Text
      key={Math.random()}
      style={[
        {
          fontSize: ctx.fontSize,
          fontFamily: ctx.fontFamily,
        },
        ctx.style as unknown as Style,
      ]}
    >
      {text}
    </Text>
  );
};
