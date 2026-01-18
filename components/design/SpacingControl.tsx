import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface SpacingControlProps {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  decimals?: number;
}

export function SpacingControl({
  label,
  value,
  unit = "",
  min,
  max,
  step,
  onChange,
  decimals = 0,
}: SpacingControlProps) {
  const displayValue = decimals > 0 ? value.toFixed(decimals) : value;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="px-2 py-0.5 rounded bg-muted text-xs font-mono text-muted-foreground">
          {displayValue}
          {unit}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-md"
          onClick={() =>
            onChange(
              Math.max(min, parseFloat((value - step).toFixed(decimals || 2))),
            )
          }
          disabled={value <= min}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>

        <div className="relative flex-1 group">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-md"
          onClick={() =>
            onChange(
              Math.min(max, parseFloat((value + step).toFixed(decimals || 2))),
            )
          }
          disabled={value >= max}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
