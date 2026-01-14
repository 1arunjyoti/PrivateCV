"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { useState, useRef, useEffect } from "react";
import {
  Type,
  AlignJustify,
  LayoutList,
  List,
  RotateCcw,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";

interface DropdownProps {
  value: string;
  options: { label: string; value: number }[];
  onChange: (value: number) => void;
  icon: React.ReactNode;
  label: string;
}

function ToolbarDropdown({
  value,
  options,
  onChange,
  icon,
  label,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-medium text-foreground/80 hover:text-foreground"
        title={label}
      >
        {icon}
        <span className="hidden sm:inline text-xs">{value}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[120px] z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-1.5 text-left text-sm hover:bg-muted transition-colors ${
                value === option.label ? "bg-muted font-medium" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface StepperProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  label: string;
  unit?: string;
}

function ToolbarStepper({
  value,
  min,
  max,
  step,
  onChange,
  icon,
  label,
  unit = "",
}: StepperProps) {
  return (
    <div className="flex items-center gap-1" title={label}>
      <span className="text-foreground/60">{icon}</span>
      <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-md overflow-hidden">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          className="h-7 w-6 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/15 disabled:opacity-30 transition-colors"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="text-xs font-mono w-10 text-center tabular-nums">
          {value}
          {unit}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
          className="h-7 w-6 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/15 disabled:opacity-30 transition-colors"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function ToolbarDivider() {
  return <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />;
}

export function LayoutSettingsToolbar() {
  const { currentResume, updateCurrentResume } = useResumeStore();

  if (!currentResume) return null;

  const layoutSettings = currentResume.meta.layoutSettings || {
    fontSize: 8.5,
    lineHeight: 1.2,
    sectionMargin: 8,
    bulletMargin: 2,
    useBullets: true,
  };

  const updateSetting = (
    key: keyof typeof layoutSettings,
    value: number | boolean
  ) => {
    updateCurrentResume({
      meta: {
        ...currentResume.meta,
        layoutSettings: {
          ...layoutSettings,
          [key]: value,
        },
      },
    });
  };

  const resetToDefaults = () => {
    updateCurrentResume({
      meta: {
        ...currentResume.meta,
        layoutSettings: {
          fontSize: 8.5,
          lineHeight: 1.2,
          sectionMargin: 8,
          bulletMargin: 2,
          useBullets: true,
        },
      },
    });
  };

  const fontSizeOptions = [
    { label: "7pt", value: 7 },
    { label: "7.5pt", value: 7.5 },
    { label: "8pt", value: 8 },
    { label: "8.5pt", value: 8.5 },
    { label: "9pt", value: 9 },
    { label: "9.5pt", value: 9.5 },
    { label: "10pt", value: 10 },
    { label: "10.5pt", value: 10.5 },
    { label: "11pt", value: 11 },
    { label: "12pt", value: 12 },
  ];

  const lineHeightOptions = [
    { label: "1.0", value: 1.0 },
    { label: "1.15", value: 1.15 },
    { label: "1.2", value: 1.2 },
    { label: "1.4", value: 1.4 },
    { label: "1.5", value: 1.5 },
    { label: "1.6", value: 1.6 },
    { label: "1.8", value: 1.8 },
    { label: "2.0", value: 2.0 },
  ];

  return (
    <div className="w-full flex justify-center px-4 py-2 bg-muted/20 border-b">
      {/* Pill-shaped toolbar container */}
      <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-background border border-border/50 rounded-full shadow-sm">
        {/* Font Size Dropdown */}
        <ToolbarDropdown
          value={`${layoutSettings.fontSize}pt`}
          options={fontSizeOptions}
          onChange={(v) => updateSetting("fontSize", v)}
          icon={<Type className="h-4 w-4" />}
          label="Font Size"
        />

        <ToolbarDivider />

        {/* Line Spacing Dropdown */}
        <ToolbarDropdown
          value={layoutSettings.lineHeight.toFixed(1)}
          options={lineHeightOptions}
          onChange={(v) => updateSetting("lineHeight", v)}
          icon={<AlignJustify className="h-4 w-4" />}
          label="Line Spacing"
        />

        <ToolbarDivider />

        {/* Section Margin Stepper */}
        <ToolbarStepper
          value={layoutSettings.sectionMargin}
          min={6}
          max={24}
          step={2}
          onChange={(v) => updateSetting("sectionMargin", v)}
          icon={<LayoutList className="h-4 w-4" />}
          label="Section Spacing"
          unit="px"
        />

        <ToolbarDivider />

        {/* Bullet Margin Stepper */}
        <ToolbarStepper
          value={layoutSettings.bulletMargin}
          min={1}
          max={8}
          step={1}
          onChange={(v) => updateSetting("bulletMargin", v)}
          icon={<List className="h-4 w-4" />}
          label="Bullet Spacing"
          unit="px"
        />

        <ToolbarDivider />

        {/* Bullet Toggle */}
        <button
          onClick={() =>
            updateSetting("useBullets", !layoutSettings.useBullets)
          }
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors text-sm ${
            layoutSettings.useBullets
              ? "bg-primary text-primary-foreground"
              : "hover:bg-black/5 dark:hover:bg-white/10 text-foreground/60"
          }`}
          title="Toggle Bullets"
        >
          <span className="text-base leading-none">•</span>
          <span className="hidden sm:inline text-xs">Bullets</span>
        </button>

        <ToolbarDivider />

        {/* Reset Button */}
        <button
          onClick={resetToDefaults}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground/60 hover:text-foreground"
          title="Reset to defaults"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Reset</span>
        </button>
      </div>
    </div>
  );
}
