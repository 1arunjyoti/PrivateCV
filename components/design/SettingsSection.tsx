import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import React from "react";

export function SettingsSection({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="border-b last:border-0 border-border/40"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 px-2 hover:bg-muted/30 transition-colors group rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-md transition-colors ${
              isOpen
                ? "bg-primary/10 text-primary"
                : "bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-6 pt-2 px-3 animate-in fade-in-0 slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2">
        <div className="space-y-6 pt-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
