import { LegalStatus, SafetySummary, SafetyRating, QueerSpot } from "@/types/city";

// Define weights for different factors in the queer index calculation
const WEIGHTS = {
  LEGAL: 0.4,   // Legal protections
  SAFETY: 0.4,  // Safety and social acceptance
  SPOTS: 0.2    // Community spaces and resources
};

/**
 * Calculate legal score component (0-100)
 * Based on legal protections and rights for LGBTQ+ individuals
 */
export function calculateLegalScore(legalStatus: LegalStatus): number {
  let score = 0;
  
  // Base points for each legal protection
  if (legalStatus.same_sex_marriage) score += 20;
  if (legalStatus.anti_discrimination) score += 20;
  if (legalStatus.workplace_protection) score += 15;
  if (legalStatus.hate_crime_protection) score += 15;
  if (legalStatus.adoption) score += 15;
  
  // Points for gender recognition
  switch (legalStatus.gender_recognition) {
    case "self-id":
      score += 15;
      break;
    case "medical":
      score += 8;
      break;
    case "none":
      score += 0;
      break;
  }
  
  // Cap at 100
  return Math.min(100, score);
}

/**
 * Calculate safety score component (0-100)
 * Based on safety summary and reported incidents
 */
export function calculateSafetyScore(safetySummary: SafetySummary): number {
  let score = 0;
  
  // Base points for overall rating
  switch (safetySummary.overall_rating) {
    case "very_safe":
      score += 75;
      break;
    case "moderately_safe":
      score += 50;
      break;
    case "less_safe":
      score += 25;
      break;
  }
  
  // Additional points based on specific factors
  
  // Incidents reporting
  if (safetySummary.incidents.includes("Low rate")) {
    score += 10;
  } else if (safetySummary.incidents.includes("Occasional")) {
    score += 5;
  }
  
  // Healthcare access
  if (
    safetySummary.healthcare.includes("Excellent") || 
    safetySummary.healthcare.includes("Good")
  ) {
    score += 10;
  } else if (safetySummary.healthcare.includes("Some")) {
    score += 5;
  }
  
  // Nightlife scene
  if (
    safetySummary.nightlife.includes("Vibrant") || 
    safetySummary.nightlife.includes("Extensive")
  ) {
    score += 5;
  } else if (safetySummary.nightlife.includes("Several") || safetySummary.nightlife.includes("Some")) {
    score += 2;
  }
  
  // Cap at 100
  return Math.min(100, score);
}

/**
 * Calculate spots score component (0-100)
 * Based on number and variety of LGBTQ+ venues and resources
 */
export function calculateSpotsScore(spots: QueerSpot[]): number {
  if (!spots || spots.length === 0) {
    return 0;
  }
  
  // Base score from number of spots (max 60 points)
  const countScore = Math.min(60, spots.length * 10);
  
  // Diversity score based on unique spot types (max 30 points)
  const uniqueTypes = new Set(spots.map(spot => spot.type)).size;
  const diversityScore = Math.min(30, uniqueTypes * 7);
  
  // Quality score based on average rating (max 10 points)
  const avgRating = spots.reduce((sum, spot) => sum + spot.rating, 0) / spots.length;
  const qualityScore = Math.round(avgRating * 2);
  
  // Total capped at 100
  return Math.min(100, countScore + diversityScore + qualityScore);
}

/**
 * Calculate the overall queer index score (0-100)
 * Weighted combination of legal, safety, and spots scores
 */
export function calculateQueerIndex(
  legalScore: number, 
  safetyScore: number, 
  spotsScore: number
): number {
  return Math.round(
    (legalScore * WEIGHTS.LEGAL) +
    (safetyScore * WEIGHTS.SAFETY) +
    (spotsScore * WEIGHTS.SPOTS)
  );
}

/**
 * Main function to generate the overall queer index
 * Takes city data components and returns a final score
 */
export function generateQueerIndex(
  legalStatus: LegalStatus,
  safetySummary: SafetySummary,
  spots: QueerSpot[]
): number {
  const legalScore = calculateLegalScore(legalStatus);
  const safetyScore = calculateSafetyScore(safetySummary);
  const spotsScore = calculateSpotsScore(spots);
  
  return calculateQueerIndex(legalScore, safetyScore, spotsScore);
}

/**
 * Interface for queer index breakdown component
 */
export interface ScoreComponent {
  rawScore: number;
  weightedScore: number;
  weight: number;
}

/**
 * Interface for queer index breakdown
 */
export interface QueerIndexBreakdown {
  total: number;
  components: {
    legal: ScoreComponent;
    safety: ScoreComponent;
    spots: ScoreComponent;
  };
}

/**
 * Generate a breakdown of the queer index score
 * Returns component scores and their weighted contributions
 */
export function getQueerIndexBreakdown(
  legalStatus: LegalStatus,
  safetySummary: SafetySummary,
  spots: QueerSpot[]
): QueerIndexBreakdown {
  const legalScore = calculateLegalScore(legalStatus);
  const safetyScore = calculateSafetyScore(safetySummary);
  const spotsScore = calculateSpotsScore(spots);
  
  const weightedLegal = Math.round(legalScore * WEIGHTS.LEGAL);
  const weightedSafety = Math.round(safetyScore * WEIGHTS.SAFETY);
  const weightedSpots = Math.round(spotsScore * WEIGHTS.SPOTS);
  
  return {
    total: calculateQueerIndex(legalScore, safetyScore, spotsScore),
    components: {
      legal: {
        rawScore: legalScore,
        weightedScore: weightedLegal,
        weight: WEIGHTS.LEGAL
      },
      safety: {
        rawScore: safetyScore,
        weightedScore: weightedSafety,
        weight: WEIGHTS.SAFETY
      },
      spots: {
        rawScore: spotsScore,
        weightedScore: weightedSpots,
        weight: WEIGHTS.SPOTS
      }
    }
  };
} 