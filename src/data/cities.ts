import { CityData, GenderRecognition } from "@/types/city"

export const cities: CityData[] = [
  {
    city: "Berlin",
    country: "Germany",
    queer_index: 88,
    legal_status: {
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
    safety_summary: {
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
    spots: [
      {
        name: "Schwules Museum",
        type: "museum",
        description: "World's first queer museum, featuring LGBTQ+ history and culture",
        address: "Lützowstraße 73, 10785 Berlin",
        website: "https://www.schwulesmuseum.de",
        rating: 4.8
      },
      {
        name: "SchwuZ",
        type: "club",
        description: "One of Berlin's oldest and largest queer clubs",
        address: "Rollbergstraße 26, 12053 Berlin",
        website: "https://www.schwuz.de",
        rating: 4.6
      },
      {
        name: "Möbel Olfe",
        type: "bar",
        description: "Popular queer bar with diverse crowd",
        address: "Reichenberger Str. 177, 10999 Berlin",
        website: "https://www.moebel-olfe.de",
        rating: 4.5
      }
    ],
    history: "Berlin has been a hub for LGBTQ+ culture since the 1920s, home to the world's first gay rights organization. The city's queer scene flourished in the Weimar Republic, was suppressed during Nazi rule, and re-emerged strongly after reunification. Today, it's one of Europe's most LGBTQ+-friendly capitals.",
    sources: [
      "https://www.visitberlin.de/en/lgbti-berlin",
      "https://www.equaldex.com/region/germany",
      "https://ilga.org/state-sponsored-homophobia-report-2023",
      "Local LGBTQ+ community reports"
    ],
    last_updated: "2024-04-12",
    user_flags: 0
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    queer_index: 90,
    legal_status: {
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
    safety_summary: {
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
    spots: [
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
    ],
    history: "Amsterdam has been a beacon for LGBTQ+ rights since the 1960s. The Netherlands was the first country to legalize same-sex marriage in 2001, and Amsterdam's annual Canal Pride is one of the world's most famous Pride events.",
    sources: [
      "https://www.iamsterdam.com/en/living/about-living-in-amsterdam/people-culture/diversity-in-amsterdam/lgbti-amsterdam",
      "https://www.equaldex.com/region/netherlands",
      "https://ilga.org/state-sponsored-homophobia-report-2023",
      "Local LGBTQ+ community reports"
    ],
    last_updated: "2024-04-12",
    user_flags: 0
  },
  {
    city: "Barcelona",
    country: "Spain",
    queer_index: 86,
    legal_status: {
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
    safety_summary: {
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
    spots: [
      {
        name: "Axel Hotel",
        type: "bar",
        description: "Popular gay hotel with rooftop bar",
        address: "Carrer d'Aribau, 33, 08011 Barcelona",
        website: "https://www.axelhotels.com/barcelona",
        rating: 4.6
      },
      {
        name: "Arena Classic",
        type: "club",
        description: "Large LGBTQ+ nightclub with multiple rooms",
        address: "Carrer de la Diputació, 233, 08007 Barcelona",
        website: "https://grupoarena.com",
        rating: 4.4
      },
      {
        name: "Pride Barcelona",
        type: "community_center",
        description: "LGBTQ+ community center and information point",
        address: "Carrer del Consell de Cent, 442, 08013 Barcelona",
        website: "https://www.pridebarcelona.org",
        rating: 4.7
      }
    ],
    history: "Barcelona has emerged as one of Spain's most LGBTQ+-friendly cities, benefiting from Spain's progressive legislation. The Eixample district (nicknamed 'Gayxample') has been a hub for LGBTQ+ culture since the democratic transition in the late 1970s.",
    sources: [
      "https://www.barcelona-tourist-guide.com/en/gay/gay-barcelona.html",
      "https://www.equaldex.com/region/spain",
      "https://ilga.org/state-sponsored-homophobia-report-2023",
      "Local LGBTQ+ community reports"
    ],
    last_updated: "2024-04-12",
    user_flags: 0
  },
  {
    city: "Budapest",
    country: "Hungary",
    queer_index: 65,
    legal_status: {
      same_sex_marriage: false,
      anti_discrimination: true,
      gender_recognition: "none" as GenderRecognition,
      adoption: false,
      workplace_protection: true,
      hate_crime_protection: false,
      details: [
        "Civil unions available but not marriage",
        "Basic workplace discrimination protections",
        "No legal gender recognition",
        "Limited protections against hate crimes",
        "Recent restrictions on LGBTQ+ rights"
      ]
    },
    safety_summary: {
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
    spots: [
      {
        name: "Alterego Club",
        type: "club",
        description: "Popular LGBTQ+ nightclub in District VII",
        address: "Dohány u. 38, 1074 Budapest",
        website: "https://www.alteregoclub.hu",
        rating: 4.3
      },
      {
        name: "Why Not Cafe & Bar",
        type: "bar",
        description: "Friendly LGBTQ+ bar with regular events",
        address: "Belgrád rkp. 3, 1056 Budapest",
        website: "https://www.whynotbp.com",
        rating: 4.4
      },
      {
        name: "Háttér Society",
        type: "community_center",
        description: "LGBTQ+ advocacy and support organization",
        address: "Budapest, District VII",
        website: "https://hatter.hu",
        rating: 4.7
      }
    ],
    history: "Budapest has had an active LGBTQ+ scene since the 1990s, centered around District VII. While Hungary was initially progressive on LGBTQ+ rights after joining the EU, recent years have seen political rollbacks and increased challenges.",
    sources: [
      "https://hatter.hu/english",
      "https://www.equaldex.com/region/hungary",
      "https://ilga.org/state-sponsored-homophobia-report-2023",
      "Local LGBTQ+ community reports"
    ],
    last_updated: "2024-04-12",
    user_flags: 0
  },
  {
    city: "Istanbul",
    country: "Turkey",
    queer_index: 45,
    legal_status: {
      same_sex_marriage: false,
      anti_discrimination: false,
      gender_recognition: "medical" as GenderRecognition,
      adoption: false,
      workplace_protection: false,
      hate_crime_protection: false,
      details: [
        "No legal recognition of same-sex relationships",
        "Limited legal protections for LGBTQ+ individuals",
        "Medical requirements for gender recognition",
        "Pride events banned since 2015",
        "Increasing restrictions on LGBTQ+ rights"
      ]
    },
    safety_summary: {
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
    },
    spots: [
      {
        name: "Bigudi",
        type: "bar",
        description: "LGBTQ+ friendly bar in Beyoğlu",
        address: "Beyoğlu, Istanbul",
        website: "https://instagram.com/bigudi.istanbul",
        rating: 4.2
      },
      {
        name: "SPoD",
        type: "community_center",
        description: "Social Policies, Gender Identity and Sexual Orientation Studies Association",
        address: "Katip Mustafa Çelebi, Istanbul",
        website: "http://www.spod.org.tr",
        rating: 4.6
      }
    ],
    history: "Istanbul has historically had an LGBTQ+ community centered around areas like Beyoğlu and Taksim. However, Pride events have been banned since 2015, and the community faces significant challenges with increasing restrictions.",
    sources: [
      "https://www.spod.org.tr",
      "https://www.equaldex.com/region/turkey",
      "https://ilga.org/state-sponsored-homophobia-report-2023",
      "Local LGBTQ+ community reports"
    ],
    last_updated: "2024-04-12",
    user_flags: 0
  },
  {
    city: "Warsaw",
    country: "Poland",
    queer_index: 58,
    legal_status: {
      same_sex_marriage: false,
      anti_discrimination: true,
      gender_recognition: "medical" as GenderRecognition,
      adoption: false,
      workplace_protection: true,
      hate_crime_protection: false,
      details: [
        "No legal recognition of same-sex relationships",
        "Basic anti-discrimination protections in employment",
        "Medical requirements for gender recognition",
        "Limited protections against hate crimes",
        "Ongoing political challenges to LGBTQ+ rights"
      ]
    },
    safety_summary: {
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
    spots: [
      {
        name: "Klub Galeria",
        type: "club",
        description: "Popular LGBTQ+ nightclub in city center",
        address: "ul. Mazowiecka 11A, 00-052 Warsaw",
        website: "https://klubgaleria.pl",
        rating: 4.3
      },
      {
        name: "Lambda Warszawa",
        type: "community_center",
        description: "LGBTQ+ support and advocacy organization",
        address: "ul. Żurawia 24A, 00-515 Warsaw",
        website: "https://lambdawarszawa.org",
        rating: 4.7
      },
      {
        name: "Cafe Bar Relax",
        type: "bar",
        description: "LGBTQ+ friendly cafe and bar",
        address: "ul. Puławska 48, 02-559 Warsaw",
        website: "https://www.facebook.com/RelaxCafeBar",
        rating: 4.4
      }
    ],
    history: "Warsaw's LGBTQ+ community has grown increasingly visible since the fall of communism, though it faces challenges from conservative political forces. The annual Equality Parade has been held since 2001, with participation growing each year despite opposition.",
    sources: [
      "https://lambdawarszawa.org",
      "https://www.equaldex.com/region/poland",
      "https://ilga.org/state-sponsored-homophobia-report-2023",
      "Local LGBTQ+ community reports"
    ],
    last_updated: "2024-04-12",
    user_flags: 0
  }
] 