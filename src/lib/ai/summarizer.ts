import { DataSourceResult } from "./datasources";
import { SafetySummary, LegalStatus, CityData, SafetyRating } from "@/types/city";

/**
 * Request interface for city summarization
 */
export interface SummaryRequest {
  city: string;
  country: string;
  sources: DataSourceResult[];
}

/**
 * Response interface for city summarization
 */
export interface SummaryResponse {
  safety_summary: SafetySummary;
  history: string;
  confidence: number;
}

/**
 * This is a mock AI summarizer function that would normally call an API like OpenAI or Claude
 * In a production environment, this would be replaced with actual API calls
 */
export async function generateSafetySummary(
  city: string,
  country: string,
  sources: DataSourceResult[]
): Promise<SafetySummary> {
  // For now, we'll parse the content from sources to generate a summary
  // In a real implementation, this would be an AI call
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Extract all content
  const allContent = sources.map(s => s.content).join("\n");
  
  // Determine safety rating based on keywords in content
  let safetyRating: SafetyRating = "moderately_safe";
  
  if (
    allContent.includes("very LGBTQ+ friendly") || 
    allContent.includes("thriving") ||
    allContent.includes("progressive") ||
    allContent.includes("Strong anti-discrimination")
  ) {
    safetyRating = "very_safe";
  } else if (
    allContent.includes("exercise some caution") ||
    allContent.includes("limited protections") ||
    allContent.includes("challenges") ||
    allContent.includes("opposition") ||
    allContent.includes("banned")
  ) {
    safetyRating = "less_safe";
  }
  
  // Predefined safety summaries based on city
  const safetyMap: Record<string, SafetySummary> = {
    "Berlin": {
      overall_rating: "very_safe",
      public_safety: "Generally very safe in urban areas with visible LGBTQ+ presence",
      nightlife: "Extensive queer nightlife scene, particularly in Schöneberg and Kreuzberg",
      healthcare: "Good access to LGBTQ+-specific healthcare and HIV services",
      incidents: "Low rate of reported hate crimes",
      tips: [
        "Popular LGBTQ+ areas include Schöneberg and Kreuzberg",
        "Pride events are well-attended and police-protected",
        "Many establishments display rainbow flags year-round"
      ]
    },
    "Amsterdam": {
      overall_rating: "very_safe",
      public_safety: "Generally very safe with high visibility and acceptance of LGBTQ+ people",
      nightlife: "Vibrant scene centered around Reguliersdwarsstraat and Warmoesstraat",
      healthcare: "Excellent access to LGBTQ+-inclusive healthcare",
      incidents: "Low rate of reported hate crimes",
      tips: [
        "The city center is generally very LGBTQ+ friendly",
        "Canal Pride in August is a major celebration",
        "Most venues are welcoming to all identities"
      ]
    },
    "Warsaw": {
      overall_rating: "moderately_safe",
      public_safety: "Generally safe in central areas, but caution advised in some neighborhoods",
      nightlife: "Some LGBTQ+ friendly venues, mostly in the city center",
      healthcare: "Limited LGBTQ+-specific healthcare",
      incidents: "Occasional reports of harassment or discrimination",
      tips: [
        "The city center is more accepting than outlying areas",
        "Exercise discretion in public displays of affection",
        "Look for venues with rainbow flags"
      ]
    },
    "Budapest": {
      overall_rating: "moderately_safe",
      public_safety: "Generally safe in central areas, especially in District VII",
      nightlife: "Several LGBTQ+ friendly venues, most concentrated in District VII",
      healthcare: "Limited LGBTQ+-specific healthcare options",
      incidents: "Some reports of harassment, particularly outside tourist areas",
      tips: [
        "District VII (Jewish Quarter) is most LGBTQ+ friendly",
        "Exercise discretion in public displays of affection",
        "Pride events have faced opposition but are generally protected"
      ]
    },
    "Barcelona": {
      overall_rating: "very_safe",
      public_safety: "Generally very safe with high visibility and acceptance",
      nightlife: "Extensive scene centered in Eixample ('Gayxample')",
      healthcare: "Good access to LGBTQ+-inclusive healthcare",
      incidents: "Low rate of reported hate crimes",
      tips: [
        "Eixample district is the heart of LGBTQ+ Barcelona",
        "Pride Barcelona in June is a major celebration",
        "The city is generally very open and accepting"
      ]
    },
    "Istanbul": {
      overall_rating: "less_safe",
      public_safety: "Exercise caution, especially outside tourist areas",
      nightlife: "Limited LGBTQ+ venues, mostly in Beyoğlu and Taksim areas",
      healthcare: "Few LGBTQ+-specific healthcare options",
      incidents: "Increased reports of harassment and discrimination",
      tips: [
        "Exercise significant discretion in public",
        "Pride events have been banned since 2015",
        "Beyoğlu district has some LGBTQ+ friendly venues",
        "Connect with local LGBTQ+ groups for current safety information"
      ]
    // },
    // "Copenhagen": {
    //   overall_rating: "very_safe",
    //   public_safety: "Generally very safe with high visibility and acceptance of LGBTQ+ people",
    //   nightlife: "Vibrant scene with venues throughout the city center",
    //   healthcare: "Excellent access to LGBTQ+-inclusive healthcare",
    //   incidents: "Low rate of reported hate crimes",
    //   tips: [
    //     "The city center and Vesterbro area are very LGBTQ+ friendly",
    //     "Copenhagen Pride in August is a major celebration",
    //     "Most venues and public spaces are welcoming to all identities"
    //   ]
    }
  };
  
  // If we have a predefined summary, return it
  if (safetyMap[city]) {
    return safetyMap[city];
  }
  
  // Otherwise generate a generic one based on safety rating
  return {
    overall_rating: safetyRating,
    public_safety: safetyRating === "very_safe"
      ? "Generally very safe with visible LGBTQ+ presence"
      : safetyRating === "moderately_safe"
        ? "Generally safe in urban and tourist areas, some caution advised elsewhere"
        : "Exercise caution, especially outside tourist areas",
    nightlife: safetyRating === "very_safe"
      ? "Vibrant LGBTQ+ nightlife with many venues"
      : safetyRating === "moderately_safe"
        ? "Some LGBTQ+ friendly venues available"
        : "Limited LGBTQ+ specific venues",
    healthcare: safetyRating === "very_safe"
      ? "Good access to LGBTQ+-inclusive healthcare"
      : safetyRating === "moderately_safe"
        ? "Some LGBTQ+-inclusive healthcare options"
        : "Limited LGBTQ+-specific healthcare",
    incidents: safetyRating === "very_safe"
      ? "Low rate of reported hate crimes"
      : safetyRating === "moderately_safe"
        ? "Occasional reports of harassment or discrimination"
        : "Higher incidence of reported harassment and discrimination",
    tips: [
      safetyRating === "very_safe"
        ? "Most areas of the city are LGBTQ+ friendly"
        : safetyRating === "moderately_safe"
          ? "City center is generally more accepting"
          : "Stick to tourist areas for greater safety",
      safetyRating === "very_safe"
        ? "Pride events are well-attended and celebrated"
        : safetyRating === "moderately_safe"
          ? "Exercise some discretion in public displays of affection"
          : "Exercise significant discretion in public",
      "Connect with local LGBTQ+ groups for current advice"
    ]
  };
}

/**
 * Generate a historical summary for the city
 */
export async function generateHistorySummary(
  city: string, 
  country: string, 
  sources: DataSourceResult[]
): Promise<string> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Look for Wikipedia content first as it's likely to have historical info
  const wikiSource = sources.find(s => s.source === "wikipedia");
  
  if (wikiSource && wikiSource.content.length > 50) {
    return wikiSource.content;
  }
  
  // Predefined history summaries based on city
  const historyMap: Record<string, string> = {
    "Berlin": "Berlin has been a hub for LGBTQ+ culture since the 1920s. The city's queer scene flourished in the Weimar Republic, was suppressed during Nazi rule, and re-emerged strongly after reunification. Today, it's one of Europe's most LGBTQ+-friendly capitals.",
    "Amsterdam": "Amsterdam has been a beacon for LGBTQ+ rights since the 1960s. The Netherlands was the first country to legalize same-sex marriage in 2001, and Amsterdam's annual Canal Pride is one of the world's most famous Pride events.",
    "Warsaw": "Warsaw's LGBTQ+ community has grown increasingly visible since the fall of communism, though it faces challenges from conservative political forces. The annual Equality Parade has been held since 2001, with participation growing each year despite opposition.",
    "Budapest": "Budapest has had an active LGBTQ+ scene since the 1990s, centered around District VII. While Hungary was initially progressive on LGBTQ+ rights after joining the EU, recent years have seen political rollbacks and increased challenges.",
    "Barcelona": "Barcelona has emerged as one of Spain's most LGBTQ+-friendly cities, benefiting from Spain's progressive legislation. The Eixample district (nicknamed 'Gayxample') has been a hub for LGBTQ+ culture since the democratic transition in the late 1970s.",
    "Istanbul": "Istanbul has a long but often hidden LGBTQ+ history. While the city developed a more visible scene in the early 2000s, recent years have seen increasing restrictions, including the banning of Pride events since 2015.",
    // "Copenhagen": "Copenhagen has a long history of LGBTQ+ acceptance. Denmark was the first country in the world to legally recognize same-sex partnerships in 1989, and Copenhagen has been at the forefront of LGBTQ+ rights advocacy. The city hosts a vibrant annual Pride celebration and is home to one of the oldest gay bars in the world, Centralhjørnet, established in 1917."
  };
  
  // If we have a predefined history, return it
  if (historyMap[city]) {
    return historyMap[city];
  }
  
  // Otherwise generate a generic one
  return `${city} has seen evolving attitudes toward LGBTQ+ individuals over time, reflecting broader social and political changes in ${country}.`;
}

/**
 * Main function to generate all summaries
 */
export async function generateCitySummaries(request: SummaryRequest): Promise<SummaryResponse> {
  const { city, country, sources } = request;
  
  // Generate summaries in parallel
  const [safety_summary, history] = await Promise.all([
    generateSafetySummary(city, country, sources),
    generateHistorySummary(city, country, sources)
  ]);
  
  // Calculate average confidence from sources
  const confidenceSum = sources.reduce((sum, source) => sum + source.confidence, 0);
  const confidence = sources.length > 0 ? confidenceSum / sources.length : 0.5;
  
  return {
    safety_summary,
    history,
    confidence
  };
} 