import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlignLeft } from "lucide-react";
import React from "react";
import { SettingsSection } from "../SettingsSection";

import { LayoutSettings, LayoutSettingValue } from "../types";

interface EntryLayoutSettingsProps {
  layoutSettings: LayoutSettings;
  updateSetting: (key: keyof LayoutSettings, value: LayoutSettingValue) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function EntryLayoutSettings({
  layoutSettings,
  updateSetting,
  isOpen,
  onToggle,
}: EntryLayoutSettingsProps) {
  return (
    <SettingsSection
      title="Entry Layouts"
      icon={AlignLeft}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      {/* Entry Style */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Layout Variation
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {[1, 2, 3, 4, 5].map((style) => (
            <button
              key={style}
              onClick={() => updateSetting("entryLayoutStyle", style)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                (layoutSettings.entryLayoutStyle || 1) === style
                  ? "border-primary bg-accent"
                  : "border-transparent bg-muted/20 hover:border-border"
              }`}
            >
              {/* Style 1: Title left, dates right */}
              {style === 1 && (
                <div className="flex items-center justify-between w-full gap-2 opacity-80">
                  <span className="text-xs font-semibold">Standard</span>
                  <div className="h-1.5 w-1/3 bg-foreground/20 rounded-sm" />
                </div>
              )}
              {/* Style 2: Dates left, content right */}
              {style === 2 && (
                <div className="flex items-center gap-3 w-full opacity-80">
                  <div className="h-1.5 w-1/4 bg-foreground/20 rounded-sm" />
                  <div className="h-px bg-border flex-1 mx-2" />
                  <span className="text-xs font-semibold">Sidebar Date</span>
                </div>
              )}

              {/* Style 3... etc placeholders */}
              {style > 2 && (
                <span className="text-xs font-medium pl-1">
                  Variation {style}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Subtitle Style</Label>
          <select
            className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm"
            value={layoutSettings.entrySubtitleStyle || "italic"}
            onChange={(e) =>
              updateSetting("entrySubtitleStyle", e.target.value)
            }
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="italic">Italic</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Placement</Label>
          <select
            className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm"
            value={layoutSettings.entrySubtitlePlacement || "nextLine"}
            onChange={(e) =>
              updateSetting("entrySubtitlePlacement", e.target.value)
            }
          >
            <option value="nextLine">Next Line</option>
            <option value="sameLine">Same Line</option>
          </select>
        </div>
      </div>
    </SettingsSection>
  );
}
