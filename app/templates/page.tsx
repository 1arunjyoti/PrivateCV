import Link from "next/link";
import { ArrowLeft, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { TemplatesGallery } from "./TemplatesGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Templates | PrivateCV",
  description:
    "Choose from our collection of professional, creative, and ATS-friendly resume templates. All templates are free and privacy-focused.",
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        <div className="landing-container mx-auto px-4 h-16 flex items-center justify-between relative">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 pl-2 pr-2 sm:pr-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
          </Link>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-lg flex items-center gap-2 whitespace-nowrap">
            <Layout className="h-5 w-5" />
            Template Catalog
          </div>
          <div className="w-25 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 landing-container mx-auto px-4 py-8 md:py-12">
        <TemplatesGallery />
      </main>

      <footer className="border-t py-6 bg-background">
        <div className="landing-container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} PrivateCV. Open Source & Privacy-First.
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link
              href="https://github.com/1arunjyoti/resume-builder"
              className="hover:text-foreground transition-colors"
              target="_blank"
            >
              GitHub
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
