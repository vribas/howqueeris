import { CityData, SafetySummary, LegalStatus } from "@/types/city";

/**
 * Data source type definition
 */
export type DataSourceType = "reddit" | "equaldex" | "ilga" | "wikipedia";

/**
 * Data source result interface
 */
export interface DataSourceResult {
  source: DataSourceType;
  url: string;
  content: string;
  timestamp: string;
  confidence: number;
}

/**
 * Function to fetch data from Reddit
 */
export async function fetchRedditData(city: string, country: string): Promise<DataSourceResult[]> {
  try {
    // In a real implementation, this would use Reddit's API or a scraper
    // For MVP, we'll use static data based on city/country
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        source: "reddit" as DataSourceType,
        url: `https://www.reddit.com/r/lgbt/search?q=${encodeURIComponent(city)}`,
        content: `${city} has been mentioned in several posts on r/lgbt. Users generally describe it as ${
          ["Berlin", "Amsterdam", "Stockholm", "Barcelona"].includes(city) 
            ? "very LGBTQ+ friendly with a vibrant scene" 
            : ["Budapest", "Warsaw", "Istanbul"].includes(city)
              ? "moderately LGBTQ+ friendly with some concerns about recent political changes"
              : "an area where LGBTQ+ individuals should exercise some caution"
        }.`,
        timestamp: new Date().toISOString(),
        confidence: 0.8
      },
      {
        source: "reddit" as DataSourceType,
        url: `https://www.reddit.com/r/ainbow/search?q=${encodeURIComponent(city)}`,
        content: `r/ainbow discussions about ${city} mention ${
          ["Berlin", "Amsterdam", "Stockholm", "Barcelona"].includes(city)
            ? "numerous LGBTQ+ friendly venues and events throughout the year"
            : ["Budapest", "Warsaw", "Istanbul"].includes(city)
              ? "some LGBTQ+ friendly venues, though the community faces some challenges"
              : "limited LGBTQ+ infrastructure but some welcoming spaces can be found"
        }.`,
        timestamp: new Date().toISOString(),
        confidence: 0.7
      }
    ];
  } catch (error) {
    console.error("Error fetching Reddit data:", error);
    return [];
  }
}

/**
 * Function to fetch data from Equaldex
 */
export async function fetchEqualdexData(country: string): Promise<DataSourceResult> {
  try {
    // In a real implementation, this would scrape Equaldex or use an API
    // For now, we'll use static data based on country
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Map countries to legal status data
    const legalStatusMap: Record<string, string> = {
      "Germany": "Same-sex marriage is legal. Anti-discrimination laws are in place. Self-ID gender recognition is available.",
      "Netherlands": "Same-sex marriage is legal. Strong anti-discrimination protections. Progressive gender recognition laws.",
      "Sweden": "Same-sex marriage is legal. Comprehensive anti-discrimination laws. Progressive gender recognition policies.",
      "Poland": "Same-sex marriage is not legal. Limited anti-discrimination protections. Restrictive gender recognition process.",
      "Hungary": "Same-sex marriage is not legal. Some anti-discrimination protections exist. Medical gender recognition process.",
      "Spain": "Same-sex marriage is legal. Strong anti-discrimination laws. Self-ID gender recognition process.",
      "Turkey": "Same-sex marriage is not legal. Limited anti-discrimination protections. Medical gender recognition process is difficult.",
      // "Denmark": "Same-sex marriage is legal since 2012. Strong anti-discrimination protections. Medical gender recognition process."
    };
    
    const content = legalStatusMap[country] || 
      `Limited information available for ${country}. Further research required.`;
    
    return {
      source: "equaldex" as DataSourceType,
      url: `https://www.equaldex.com/region/${country.toLowerCase().replace(/\s+/g, '-')}`,
      content: content,
      timestamp: new Date().toISOString(),
      confidence: 0.9
    };
  } catch (error) {
    console.error("Error fetching Equaldex data:", error);
    return {
      source: "equaldex" as DataSourceType,
      url: `https://www.equaldex.com/region/${country.toLowerCase().replace(/\s+/g, '-')}`,
      content: `Error retrieving data for ${country}.`,
      timestamp: new Date().toISOString(),
      confidence: 0.3
    };
  }
}

/**
 * Function to fetch data from ILGA
 */
export async function fetchILGAData(country: string): Promise<DataSourceResult> {
  try {
    // In a real implementation, this would extract data from ILGA reports
    // For now, we'll use static data based on country
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Map countries to ILGA data
    const ilgaDataMap: Record<string, string> = {
      "Germany": "Germany has comprehensive protections against discrimination on the grounds of sexual orientation and gender identity. Hate crime legislation explicitly includes LGBTQ+ people.",
      "Netherlands": "The Netherlands provides strong legal protections for LGBTQ+ individuals and has been a pioneer in LGBTQ+ rights in Europe.",
      "Sweden": "Sweden has thorough legal protections for LGBTQ+ individuals and consistently ranks among the most LGBTQ+ friendly countries.",
      "Poland": "Poland has seen increasing challenges for LGBTQ+ rights, with limited protections and 'LGBT-free zones' in some municipalities.",
      "Hungary": "Hungary has seen regression in LGBTQ+ rights in recent years, with constitutional amendments restricting recognition of transgender people.",
      "Spain": "Spain has progressive LGBTQ+ legislation, including constitutional protections against discrimination.",
      "Turkey": "Turkey has limited legal protections for LGBTQ+ individuals, and Pride events have faced official restrictions.",
      // "Denmark": "Denmark has strong legal protections for LGBTQ+ individuals, including same-sex marriage, adoption rights, and anti-discrimination laws. It was the first country in the world to legally recognize same-sex partnerships in 1989."
    };
    
    const content = ilgaDataMap[country] || 
      `Limited ILGA information available for ${country}. Further research required.`;
    
    return {
      source: "ilga" as DataSourceType,
      url: "https://ilga.org/maps-sexual-orientation-laws",
      content: content,
      timestamp: new Date().toISOString(),
      confidence: 0.85
    };
  } catch (error) {
    console.error("Error fetching ILGA data:", error);
    return {
      source: "ilga" as DataSourceType,
      url: "https://ilga.org/maps-sexual-orientation-laws",
      content: `Error retrieving ILGA data for ${country}.`,
      timestamp: new Date().toISOString(),
      confidence: 0.3
    };
  }
}

/**
 * Function to fetch Wikipedia data
 */
export async function fetchWikipediaData(city: string, country: string): Promise<DataSourceResult> {
  try {
    // In a real implementation, this would use Wikipedia's API
    // For now, we'll use static data based on city/country
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // Map cities to Wikipedia-like content
    const wikiContentMap: Record<string, string> = {
      "Berlin": "Berlin has been a center of LGBTQ+ culture since the 1920s. The Schöneberg district has been a gay village since the early 20th century. Annual events include Berlin Pride (Christopher Street Day) and the Lesbian and Gay City Festival.",
      "Amsterdam": "Amsterdam has been known for its LGBTQ+ acceptance since the 1960s. It was the first city to host a gay pride event in the Netherlands and is home to the Homomonument, one of the first monuments to commemorate LGBTQ+ individuals who were persecuted.",
      "Warsaw": "Warsaw hosts an annual Equality Parade (Warsaw Pride) since 2001, though it has faced opposition from conservative groups and politicians. The LGBTQ+ community has become more visible in recent years despite political challenges.",
      "Budapest": "Budapest has an active LGBTQ+ scene centered around District VII. Budapest Pride has been held annually since 1997, though it has faced increasing opposition in recent years as LGBTQ+ rights have become more politically contested.",
      "Barcelona": "Barcelona has a thriving LGBTQ+ scene, particularly in the Eixample district (nicknamed 'Gayxample'). It hosts one of Spain's largest Pride celebrations and has benefited from Spain's progressive LGBTQ+ legislation.",
      "Istanbul": "Istanbul has historically had an LGBTQ+ community centered around areas like Beyoğlu and Taksim. However, Pride events have been banned since 2015, and the community faces significant challenges with increasing restrictions."
    };
    
    const content = wikiContentMap[city] || 
      `${city} is a major city in ${country}. Limited specific LGBTQ+ historical information is available.`;
    
    return {
      source: "wikipedia" as DataSourceType,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(city)}`,
      content: content,
      timestamp: new Date().toISOString(),
      confidence: 0.8
    };
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);
    return {
      source: "wikipedia" as DataSourceType,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(city)}`,
      content: `Error retrieving Wikipedia data for ${city}.`,
      timestamp: new Date().toISOString(),
      confidence: 0.3
    };
  }
}

/**
 * Function to fetch all data sources
 */
export async function fetchAllSourceData(city: string, country: string): Promise<DataSourceResult[]> {
  const results: DataSourceResult[] = [];
  
  try {
    // Fetch all data in parallel
    const [redditData, equaldexData, ilgaData, wikipediaData] = await Promise.all([
      fetchRedditData(city, country),
      fetchEqualdexData(country),
      fetchILGAData(country),
      fetchWikipediaData(city, country)
    ]);
    
    // Add results to array
    results.push(...redditData, equaldexData, ilgaData, wikipediaData);
  } catch (error) {
    console.error("Error fetching source data:", error);
  }
  
  return results;
} 