export const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "as", "is", "was", "are", "were", "been", "be", "have", "has", "had",
  "do", "does", "did", "will", "would", "could", "should", "may", "might", "must",
  "shall", "can", "could", "need", "used", "it", "its", "you", "your", "we", "our",
  "they", "their", "this", "that", "these", "those", "i", "me", "my", "myself",
  "he", "him", "his", "she", "her", "who", "whom", "which", "what", "where", "when",
  "why", "how", "all", "any", "each", "every", "both", "few", "more", "most", "other",
  "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too",
  "very", "just", "also", "now", "here", "there", "then", "once", "if", "up", "out",
  "into", "through", "during", "before", "after", "above", "below", "between",
  "under", "again", "further", "about", "against", "while", "etc", "eg", "ie",
  "via", "per",
  // Common resume/job filler words that aren't strict stop words but add noise
  "role", "position", "seeking", "looking", "responsibilities", "requirements",
  "required", "preferred", "plus", "including", "experience", "work", "job",
  "opportunity", "able", "ability", "excellent", "strong", "good", "knowledge",
  "understanding", "skills", "proficient", "familiar", "years", "year",
  "candidate", "applicant", "team", "company", "clients"
]);

// Tech Synonyms Map: normalized key -> array of variations
// The key should be the "canonical" term we prefer to display
export const TECH_SYNONYMS: Record<string, string[]> = {
  "javascript": ["js", "es6", "es2015", "ecmascript"],
  "typescript": ["ts"],
  "react": ["reactjs", "react.js"],
  "react native": ["rn"],
  "node.js": ["node", "nodejs"],
  "amazon web services": ["aws"],
  "google cloud platform": ["gcp", "google cloud"],
  "microsoft azure": ["azure"],
  "kubernetes": ["k8s"],
  "ci/cd": ["cicd"],
  "ui/ux": ["uiux", "user interface experience"],
  "machine learning": ["ml"],
  "artificial intelligence": ["ai"],
  "qa": ["quality assurance"],
  "api": ["apis", "rest", "restful", "soap"],
  "database": ["databases", "db", "sql", "nosql"],
  "frontend": ["front-end", "front end"],
  "backend": ["back-end", "back end"],
  "fullstack": ["full-stack", "full stack"],
};

// Normalize text: lowercase, remove punctuation (mostly), handle special chars in tech names
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    // preserve typical tech symbols like +, #, .
    // Replace other punctuation with space
    .replace(/[^a-z0-9\s.+#\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Generate N-grams from an array of words
const generateNGrams = (words: string[], n: number): string[] => {
  if (words.length < n) return [];
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    const chunk = words.slice(i, i + n);
    
    // Filter bad n-grams:
    // 1. Should not start or end with a stop word
    if (STOP_WORDS.has(chunk[0]) || STOP_WORDS.has(chunk[n - 1])) continue;
    
    // 2. Should not consist entirely of numbers or symbols
    if (chunk.every(w => /^[\d\W]+$/.test(w))) continue;

    ngrams.push(chunk.join(" "));
  }
  return ngrams;
};

export interface KeywordMatch {
  keyword: string;
  count: number;
}

export const extractKeywords = (text: string): string[] => {
  const clean = normalizeText(text);
  const words = clean.split(" ");
  
  const frequencyMap = new Map<string, number>();

  // Helper to add/increment
  const add = (phrase: string, weight: number = 1) => {
    // Basic deduplication via synonyms could happen here, or later during matching.
    // For extraction, we leave them as is, but maybe prioritize longer phrases.
    const count = frequencyMap.get(phrase) || 0;
    frequencyMap.set(phrase, count + weight);
  };

  // 1. Unigrams
  words.forEach(word => {
    if (word.length > 2 && !STOP_WORDS.has(word)) {
      add(word, 1);
    }
  });

  // 2. Bigrams (2 words)
  const bigrams = generateNGrams(words, 2);
  bigrams.forEach(bg => add(bg, 1.5)); // Heigher weight for phrases

  // 3. Trigrams (3 words)
  const trigrams = generateNGrams(words, 3);
  trigrams.forEach(tg => add(tg, 2));

  // Convert to sorted array
  return Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1]) // Sort by frequency/weight desc
    .slice(0, 40) // Top 40
    .map(([keyword]) => keyword);
};

// Check if a keyword exists in text, considering synonyms
export const checkLikelyMatch = (keyword: string, targetText: string): boolean => {
  const normalizedKeyword = normalizeText(keyword);
  const normalizedTarget = normalizeText(targetText);
  
  // 1. Direct match
  if (normalizedTarget.includes(normalizedKeyword)) return true;

  // 2. Synonym match
  // Check if keyword matches any key or value in TECH_SYNONYMS
  for (const [canonical, aliases] of Object.entries(TECH_SYNONYMS)) {
    const allVariations = [canonical, ...aliases];
    
    // If the keyword IS one of the variations
    if (allVariations.includes(normalizedKeyword)) {
      // Check if any OTHER variation exists in text
      for (const variation of allVariations) {
         if (normalizedTarget.includes(variation)) return true;
      }
    }
  }

  return false;
};
