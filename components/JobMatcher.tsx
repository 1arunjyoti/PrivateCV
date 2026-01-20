"use client";

import { useState, useMemo, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Target, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { Resume } from "@/db";
import { extractKeywords, checkLikelyMatch } from "@/lib/text-processing";

interface JobMatcherProps {
  resume: Resume;
}

interface MatchResult {
  keyword: string;
  found: boolean;
  locations: string[];
}

export function JobMatcher({ resume }: JobMatcherProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Find where keyword appears - wrapped in useCallback
  const findKeywordLocation = useCallback(
    (keyword: string): string[] => {
      const locations: string[] = [];

      // Check Summary
      if (
        checkLikelyMatch(keyword, resume.basics.summary) ||
        checkLikelyMatch(keyword, resume.basics.label)
      ) {
        locations.push("Summary");
      }

      // Check Work
      resume.work.forEach((w) => {
        const workText = [w.position, w.summary, ...w.highlights].join(" ");
        if (checkLikelyMatch(keyword, workText)) {
          locations.push(`Work: ${w.company || "Experience"}`);
        }
      });

      // Check Skills
      resume.skills.forEach((s) => {
        const skillText = [s.name, ...s.keywords].join(" ");
        if (checkLikelyMatch(keyword, skillText)) {
          locations.push(`Skills: ${s.name || "Skills"}`);
        }
      });

      // Check Projects
      resume.projects.forEach((p) => {
        const projText = [
          p.name,
          p.description,
          ...p.highlights,
          ...p.keywords,
        ].join(" ");
        if (checkLikelyMatch(keyword, projText)) {
          locations.push(`Project: ${p.name || "Project"}`);
        }
      });

      return locations;
    },
    [resume],
  );

  // Match results
  const matchResults = useMemo((): MatchResult[] => {
    if (!jobDescription.trim()) return [];

    const keywords = extractKeywords(jobDescription);

    return keywords.map((keyword) => {
      const locations = findKeywordLocation(keyword);
      return {
        keyword,
        found: locations.length > 0,
        locations,
      };
    });
  }, [jobDescription, findKeywordLocation]);

  const matchedCount = matchResults.filter((r) => r.found).length;
  const totalCount = matchResults.length;
  const matchPercentage =
    totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 70)
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (percentage >= 50)
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Job Description Matcher</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Paste Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jd">
              Paste the job description to see how well your resume matches
            </Label>
            <Textarea
              id="jd"
              placeholder="Paste the job description here..."
              className="min-h-[200px]"
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setShowResults(false);
              }}
            />
          </div>
          <Button
            onClick={() => setShowResults(true)}
            disabled={!jobDescription.trim()}
            className="w-full sm:w-auto"
          >
            <Target className="h-4 w-4" />
            Analyze Match
          </Button>
        </CardContent>
      </Card>

      {showResults && matchResults.length > 0 && (
        <>
          {/* Score Card */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-4">
                {getScoreIcon(matchPercentage)}
                <div className="text-center">
                  <p
                    className={`text-4xl font-bold ${getScoreColor(
                      matchPercentage,
                    )}`}
                  >
                    {matchPercentage}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {matchedCount} of {totalCount} keywords matched
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    matchPercentage >= 70
                      ? "bg-green-500"
                      : matchPercentage >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${matchPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Keywords Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Found Keywords */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Found in Resume ({matchResults.filter((r) => r.found).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {matchResults
                    .filter((r) => r.found)
                    .map((result) => (
                      <span
                        key={result.keyword}
                        className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md cursor-help border border-green-200"
                        title={result.locations.join(", ")}
                      >
                        {result.keyword}
                      </span>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Keywords */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Missing from Resume (
                  {matchResults.filter((r) => !r.found).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {matchResults
                    .filter((r) => !r.found)
                    .map((result) => (
                      <span
                        key={result.keyword}
                        className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-md border border-red-200"
                      >
                        {result.keyword}
                      </span>
                    ))}
                </div>
                {matchResults.filter((r) => !r.found).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Consider adding these keywords or their variations (e.g.
                    synonyms) to your resume.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
