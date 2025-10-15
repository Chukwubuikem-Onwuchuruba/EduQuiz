import { compareTwoStrings } from "string-similarity";
import { distance } from "fastest-levenshtein";

export function evaluateAnswer(
  correctAnswer: string,
  userAnswer: string
): number {
  const correct = correctAnswer.toLowerCase().trim();
  const user = userAnswer.toLowerCase().trim();

  // If user answer is empty
  if (user.length === 0) return 0;

  // If answers match exactly
  if (correct === user) return 100;

  // If user answer is too short, be very strict
  if (user.length < 3 || user.split(/\s+/).length < 2) {
    return compareTwoStrings(correct, user) > 0.9 ? 100 : 0;
  }

  // Calculate multiple metrics
  const similarityScore = compareTwoStrings(correct, user) * 100;

  // Levenshtein distance (edit distance)
  const maxLength = Math.max(correct.length, user.length);
  const levenshteinDistance = distance(correct, user);
  const levenshteinScore = Math.max(
    0,
    100 - (levenshteinDistance / maxLength) * 100
  );

  // Word overlap score
  const wordOverlapScore = calculateWordOverlap(correct, user);

  // Key terms score
  const keyTermScore = calculateKeyTermScore(correct, user);

  // Weighted average - adjust weights based on what works best for your use case
  const finalScore =
    similarityScore * 0.25 + // Reduced weight for basic similarity
    levenshteinScore * 0.25 + // Edit distance
    wordOverlapScore * 0.3 + // Increased weight for word overlap
    keyTermScore * 0.2; // Key terms matching

  return Math.min(100, Math.round(finalScore));
}

function calculateWordOverlap(correct: string, user: string): number {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
  ]);

  const correctWords = new Set(
    correct
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word))
  );

  const userWords = new Set(
    user.split(/\s+/).filter((word) => word.length > 2 && !stopWords.has(word))
  );

  if (correctWords.size === 0) return 0;

  const commonWords = [...userWords].filter((word) => correctWords.has(word));
  return (commonWords.length / correctWords.size) * 100;
}

function calculateKeyTermScore(correct: string, user: string): number {
  const keyTerms = extractKeyTerms(correct);
  if (keyTerms.length === 0) return 0;

  let matchedTerms = 0;
  keyTerms.forEach((term) => {
    if (user.includes(term.toLowerCase())) {
      matchedTerms++;
    }
  });

  return (matchedTerms / keyTerms.length) * 100;
}

function extractKeyTerms(text: string): string[] {
  // Remove punctuation and split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3); // Focus on longer, more meaningful words

  // Simple frequency-based approach - take unique words
  const uniqueWords = [...new Set(words)];

  // Return the most important terms (longer words first)
  return uniqueWords.sort((a, b) => b.length - a.length).slice(0, 5); // Top 5 key terms
}
