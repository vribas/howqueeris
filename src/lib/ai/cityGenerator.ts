import { CityData, LegalStatus, QueerSpot, GenderRecognition, SafetyRating } from "@/types/city";
import { fetchAllSourceData, DataSourceResult } from "./datasources";
import { generateCitySummaries } from "./summarizer";
import { generateQueerIndex } from "./scoreCalculator";

/**
 * Extract legal status information from datasource results
 */
export async function fetchLegalStatus(country: string, sources: DataSourceResult[]): Promise<LegalStatus> {
  // Find Equaldex and ILGA data sources
  const equaldexSource = sources.find(s => s.source === "equaldex");
  const ilgaSource = sources.find(s => s.source === "ilga");
  
  // Default values
  let same_sex_marriage = false;
  let anti_discrimination = false;
  let gender_recognition: GenderRecognition = "none";
  let adoption = false;
  let workplace_protection = false;
  let hate_crime_protection = false;
  const details: string[] = [];
  
  // Predefined legal statuses for known countries
  const legalStatusMap: Record<string, LegalStatus> = {
    "Germany": {
      same_sex_marriage: true,
      anti_discrimination: true,
      gender_recognition: "self-id" as GenderRecognition,
      adoption: true,
      workplace_protection: true,
      hate_crime_protection: true,
      details: [
        "Same-sex marriage legalized in 2017",
        "Self-ID gender recognition law passed in 2023",
        "Strong anti-discrimination protections in employment and services",
        "Hate crime laws explicitly protect LGBTQ+ individuals"
      ]
    },
    "Netherlands": {
      same_sex_marriage: true,
      anti_discrimination: true,
      gender_recognition: "self-id" as GenderRecognition,
      adoption: true,
      workplace_protection: true,
      hate_crime_protection: true,
      details: [
        "First country to legalize same-sex marriage (2001)",
        "Strong anti-discrimination laws in place",
        "Progressive gender recognition policies",
        "Full adoption rights for same-sex couples"
      ]
    },
    "Spain": {
      same_sex_marriage: true,
      anti_discrimination: true,
      gender_recognition: "self-id" as GenderRecognition,
      adoption: true,
      workplace_protection: true,
      hate_crime_protection: true,
      details: [
        "Same-sex marriage legalized in 2005",
        "Strong anti-discrimination laws",
        "Self-ID gender recognition law",
        "Full adoption rights for same-sex couples",
        "Comprehensive hate crime protections"
      ]
    },
    // "Denmark": {
    //   same_sex_marriage: true,
    //   anti_discrimination: true,
    //   gender_recognition: "medical" as GenderRecognition,
    //   adoption: true,
    //   workplace_protection: true,
    //   hate_crime_protection: true,
    //   details: [
    //     "Same-sex marriage legalized in 2012",
    //     "Strong anti-discrimination protections",
    //     "Medical gender recognition process with requirements",
    //     "Full adoption rights for same-sex couples"
    //   ]
    // },
    "Sweden": {
      same_sex_marriage: true,
      anti_discrimination: true,
      gender_recognition: "medical" as GenderRecognition,
      adoption: true,
      workplace_protection: true,
      hate_crime_protection: true,
      details: [
        "Same-sex marriage legalized in 2009",
        "Comprehensive anti-discrimination laws",
        "Medical gender recognition with simplified process",
        "Full adoption rights for same-sex couples"
      ]
    }
  };
  
  // If we have predefined data for this country, use it
  if (legalStatusMap[country]) {
    return legalStatusMap[country];
  }
  
  // Otherwise try to extract information from the source data
  if (equaldexSource) {
    const content = equaldexSource.content.toLowerCase();
    
    if (content.includes("same-sex marriage is legal")) {
      same_sex_marriage = true;
      details.push("Same-sex marriage is legal");
    }
    
    if (content.includes("anti-discrimination") || content.includes("discrimination protection")) {
      anti_discrimination = true;
      details.push("Some anti-discrimination protections exist");
    }
    
    if (content.includes("workplace protection")) {
      workplace_protection = true;
      details.push("Workplace protections exist");
    }
    
    if (content.includes("hate crime")) {
      hate_crime_protection = true;
      details.push("Hate crime protections exist");
    }
    
    if (content.includes("adoption")) {
      adoption = true;
      details.push("Some adoption rights exist");
    }
    
    if (content.includes("self-id") || content.includes("self determination")) {
      gender_recognition = "self-id";
      details.push("Self-ID gender recognition");
    } else if (content.includes("medical") || content.includes("diagnosis")) {
      gender_recognition = "medical";
      details.push("Medical gender recognition process");
    }
  }
  
  if (ilgaSource) {
    const content = ilgaSource.content.toLowerCase();
    
    if (content.includes("progressive") || content.includes("comprehensive protections")) {
      if (!details.some(d => d.includes("anti-discrimination"))) {
        anti_discrimination = true;
        details.push("ILGA reports significant legal protections");
      }
    }
  }
  
  return {
    same_sex_marriage,
    anti_discrimination,
    gender_recognition,
    adoption,
    workplace_protection,
    hate_crime_protection,
    details
  };
}

/**
 * Generate queer spots for a city based on source information
 */
export async function generateSpots(city: string, country: string, safetyRating: SafetyRating): Promise<QueerSpot[]> {
  // Predefined spots data for major cities
  const spotsMap: Record<string, QueerSpot[]> = {
    "Copenhagen": [
      {
        name: "Centralhjørnet",
        type: "bar",
        description: "One of the oldest gay bars in the world, established in 1917",
        address: "Kattesundet 18, 1458 Copenhagen",
        website: "https://centralhjornet.dk",
        rating: 4.6
      },
      {
        name: "Vela",
        type: "club",
        description: "Popular LGBTQ+ nightclub with various themed nights",
        address: "Viktoriagade 2-4, 1655 Copenhagen",
        website: "https://vela.dk",
        rating: 4.4
      },
      {
        name: "LGBT Danmark",
        type: "community_center",
        description: "Denmark's national LGBTQ+ organization office and community center",
        address: "Vestergade 18E, 1456 Copenhagen",
        website: "https://lgbt.dk",
        rating: 4.8
      }
    ],
    "Berlin": [
      {
        name: "SchwuZ",
        type: "club",
        description: "One of Berlin's oldest and most popular LGBTQ+ venues",
        address: "Rollbergstraße 26, 12053 Berlin",
        website: "https://schwuz.de",
        rating: 4.7
      },
      {
        name: "Möbel Olfe",
        type: "bar",
        description: "Popular bar with a diverse LGBTQ+ crowd",
        address: "Reichenberger Str. 177, 10999 Berlin",
        website: "https://moebel-olfe.de",
        rating: 4.5
      },
      {
        name: "Schwules Museum",
        type: "museum",
        description: "Museum focused on LGBTQ+ history and culture",
        address: "Lützowstraße 73, 10785 Berlin",
        website: "https://www.schwulesmuseum.de",
        rating: 4.8
      }
    ],
    "Amsterdam": [
      {
        name: "Reguliersdwarsstraat",
        type: "bar",
        description: "Street known for its concentration of LGBTQ+ venues",
        address: "Reguliersdwarsstraat, 1017 BK Amsterdam",
        website: "https://reguliers.net",
        rating: 4.7
      },
      {
        name: "Café 't Mandje",
        type: "bar",
        description: "Historic lesbian bar opened in 1927",
        address: "Zeedijk 63, 1012 AS Amsterdam",
        website: "https://cafetmandje.nl",
        rating: 4.5
      },
      {
        name: "COC Amsterdam",
        type: "community_center",
        description: "LGBTQ+ community center and advocacy organization",
        address: "Rozenstraat 14, 1016 NX Amsterdam",
        website: "https://www.cocamsterdam.nl",
        rating: 4.8
      }
    ]
  };
  
  // If we have predefined spots for this city, use them
  if (spotsMap[city]) {
    return spotsMap[city];
  }
  
  // Otherwise generate some generic spots based on safety rating
  const spots: QueerSpot[] = [];
  
  if (safetyRating === "very_safe" || safetyRating === "moderately_safe") {
    spots.push({
      name: `${city} Pride Bar`,
      type: "bar",
      description: `Popular LGBTQ+ friendly bar in ${city}`,
      address: `Central ${city}`,
      website: `https://pridebar-${city.toLowerCase().replace(/\s+/g, '')}.example.com`,
      rating: safetyRating === "very_safe" ? 4.5 : 4.0
    });
    
    spots.push({
      name: `Rainbow Community Center`,
      type: "community_center",
      description: `LGBTQ+ support and community space in ${city}`,
      address: `Downtown ${city}`,
      website: `https://lgbtq-${city.toLowerCase().replace(/\s+/g, '')}.example.com`,
      rating: 4.7
    });
  }
  
  if (safetyRating === "very_safe") {
    spots.push({
      name: `Club Diverse`,
      type: "club",
      description: `Popular LGBTQ+ nightclub with regular events`,
      address: `Entertainment district, ${city}`,
      website: `https://clubdiverse-${city.toLowerCase().replace(/\s+/g, '')}.example.com`,
      rating: 4.3
    });
  }
  
  return spots;
}

/**
 * Main function to generate a complete city profile
 */
export async function generateCity(cityName: string, countryName: string): Promise<CityData> {
  try {
    // Step 1: Fetch all source data
    const sourceData = await fetchAllSourceData(cityName, countryName);
    
    // Step 2: Generate summaries
    const summaries = await generateCitySummaries({
      city: cityName,
      country: countryName,
      sources: sourceData
    });
    
    // Step 3: Fetch legal status using the source data
    const legalStatus = await fetchLegalStatus(countryName, sourceData);
    
    // Step 4: Generate spots using safety rating
    const spots = await generateSpots(cityName, countryName, summaries.safety_summary.overall_rating);
    
    // Step 5: Calculate queer index
    const queerIndex = generateQueerIndex(legalStatus, summaries.safety_summary, spots);
    
    // Step 6: Create a complete city object
    const cityData: CityData = {
      city: cityName,
      country: countryName,
      queer_index: queerIndex,
      legal_status: legalStatus,
      safety_summary: summaries.safety_summary,
      spots: spots,
      history: summaries.history,
      sources: sourceData.map(source => source.url),
      last_updated: new Date().toISOString().split('T')[0],
      user_flags: 0
    };
    
    return cityData;
  } catch (error) {
    console.error("Error generating city:", error);
    throw error;
  }
}
