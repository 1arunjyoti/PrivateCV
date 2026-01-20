import { describe, it, expect } from 'vitest';
import { extractKeywords, checkLikelyMatch, normalizeText } from './text-processing';

describe('Text Processing', () => {
  describe('normalizeText', () => {
    it('lowercases and handles punctuation', () => {
      expect(normalizeText('Hello World!')).toBe('hello world');
      expect(normalizeText('Node.js Developer')).toBe('node.js developer'); // preserves dots in words hopefully, or my regex might separate them
      // My regex: /[^a-z0-9\s.+#\-]/g => keeps . + # -
    });
  });

  describe('extractKeywords', () => {
    it('extracts single words', () => {
      const text = "We need a Java Developer";
      const keywords = extractKeywords(text);
      expect(keywords).toContain('java');
      expect(keywords).toContain('developer');
    });

    it('extracts bigrams', () => {
      const text = "Looking for a Project Manager with Agile experience";
      const keywords = extractKeywords(text);
      expect(keywords).toContain('project manager');
    });

    it('extracts trigrams', () => {
      const text = "Experience with Amazon Web Services is required";
      const keywords = extractKeywords(text);
      expect(keywords).toContain('amazon web services');
    });

    it('ignores stop words', () => {
      const text = "The quick brown fox";
      const keywords = extractKeywords(text);
      expect(keywords).not.toContain('the');
      expect(keywords).toContain('quick');
    });
  });

  describe('checkLikelyMatch', () => {
    it('matches exact words', () => {
      expect(checkLikelyMatch('java', 'I know Java well')).toBe(true);
    });

    it('matches synonyms (JS -> JavaScript)', () => {
      // Keyword: JS, Text: JavaScript
      expect(checkLikelyMatch('js', 'I use JavaScript daily')).toBe(true);
    });

    it('matches synonyms (JavaScript -> JS)', () => {
      // Keyword: JavaScript, Text: JS
      expect(checkLikelyMatch('javascript', 'I use JS daily')).toBe(true);
    });

    it('matches tech variations (React -> React.js)', () => {
      expect(checkLikelyMatch('react', 'Experience with React.js')).toBe(true);
    });
    
    it('matches phrases', () => {
      expect(checkLikelyMatch('project manager', 'I was a Project Manager')).toBe(true);
    });

    it('handling plurals/stems (basic substring match for now)', () => {
      // "algorithm" in "algorithms" -> true because substring
      expect(checkLikelyMatch('algorithm', 'Strong knowledge of algorithms')).toBe(true);
    });
  });
});
