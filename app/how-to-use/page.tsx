import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  FileText,
  Layout,
  PenLine,
  Palette,
  Download,
  ArrowRight,
  FileJson,
  Save,
  Target,
  Briefcase,
  Wand2,
  RotateCcw,
} from "lucide-react";

export default function HowToUsePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                PrivateCV
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/templates">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
              How to Build Your Perfect Resume
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A comprehensive guide to creating, customizing, and exporting your
              resume using PrivateCV.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-20">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Layout className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary">
                    Step 1
                  </span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
                <h2 className="text-2xl font-bold">Choose a Template</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Start by visiting the{" "}
                  <Link
                    href="/templates"
                    className="text-primary hover:underline"
                  >
                    Templates page
                  </Link>
                  . We offer various styles tailored to different needs:
                </p>
                <ul className="grid sm:grid-cols-2 gap-4 mt-4">
                  <li className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2">Classic</h3>
                    <p className="text-sm text-muted-foreground">
                      Simple, clean, and text-focused.
                    </p>
                  </li>
                  <li className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2">
                      Professional & Creative
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Modern layouts with columns and accent colors for a
                      standout look.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PenLine className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary">
                    Step 2
                  </span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
                <h2 className="text-2xl font-bold">Enter Your Details</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Use the editor tabs to fill in your information. The editor is
                  broken down into sections:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    <strong>Basics:</strong> Contact info, summary, and social
                    profiles.
                  </li>
                  <li>
                    <strong>Experience & Education:</strong> Your work history
                    and academic background.
                  </li>
                  <li>
                    <strong>Skills & Projects:</strong> Showcase your technical
                    abilities and portfolio.
                  </li>
                  <li>
                    <strong>Job Matcher:</strong> Paste a job description to see
                    how well your resume matches.
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Palette className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary">
                    Step 3
                  </span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
                <h2 className="text-2xl font-bold">Customize Design</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Switch to the <strong>Customize</strong> tab in the editor (or
                  check the sidebar on desktop) to tweak the look:
                </p>
                <ul className="grid sm:grid-cols-2 gap-4 mt-4">
                  <li className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2">Theme Colors</h3>
                    <p className="text-sm text-muted-foreground">
                      Pick a primary color that matches your personal brand.
                    </p>
                  </li>
                  <li className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2">Typography</h3>
                    <p className="text-sm text-muted-foreground">
                      Select professional fonts and adjust font sizes for
                      readability.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Download className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-primary">
                    Step 4
                  </span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
                <h2 className="text-2xl font-bold">Export & Save</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  When you are ready, you have two export options:
                </p>
                <div className="space-y-4 mt-4">
                  <div className="bg-card p-4 rounded-lg border flex gap-4">
                    <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-full shrink-0">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Download PDF</h3>
                      <p className="text-sm text-muted-foreground">
                        Get a high-quality PDF ready for job applications.
                      </p>
                    </div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border flex gap-4">
                    <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-full shrink-0">
                      <FileJson className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Export JSON</h3>
                      <p className="text-sm text-muted-foreground">
                        Save your raw data to a JSON file. Use the &quot;Import
                        JSON&quot; feature to restore your data on another
                        device.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important note - Saving */}
            <div className="bg-red-200 dark:bg-red-900 border border-red-500 dark:border-red-700 p-4 rounded-lg flex items-start gap-3 mt-4">
              <Save className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-md font-bold">Saving your progress</p>
                <p className="text-md">
                  Your progress is automatically saved to your browser&apos;s
                  local storage. You can close the tab and come back later.
                  However it is not reliable and we recommend to{" "}
                  <b>export your resume as JSON</b> and keep it safe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Tools */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Smart Tools & Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* ATS Score */}
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center rounded-lg mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-Time ATS Score</h3>
                <p className="text-muted-foreground">
                  As you type, our smart analyzer checks your content against
                  common Applicant Tracking System criteria. Aim for a score of
                  70+ to ensure your resume gets seen by recruiters.
                </p>
              </div>

              {/* Job Matcher */}
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center rounded-lg mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Job Description Matcher
                </h3>
                <p className="text-muted-foreground">
                  Paste the job description you are applying for into the
                  &quot;Job Match&quot; tab. We&apos;ll tell you exactly which
                  keywords you are missing to increase your relevance score.
                </p>
              </div>

              {/* Sample Data */}
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center rounded-lg mb-4">
                  <Wand2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fill Sample Data</h3>
                <p className="text-muted-foreground">
                  In a hurry to see how a template looks? Use the &quot;Fill
                  Sample Data&quot; tool (wand icon) to populate the fields with
                  dummy text, then replace it with your own.
                </p>
              </div>

              {/* Reset */}
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center rounded-lg mb-4">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Reset & Start Over</h3>
                <p className="text-muted-foreground">
                  Need a fresh start? The &quot;Reset All Data&quot; option
                  clears everything. <strong>Warning:</strong> This cannot be
                  undone, so make sure to export your JSON backup first!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <Link href="/templates">
              <Button size="lg" className="h-12 px-8 text-lg">
                Build My Resume <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-background">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
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
