export type GenderRecognition = "self-id" | "medical" | "none"
export type SafetyRating = "very_safe" | "moderately_safe" | "less_safe"
export type SpotType = "bar" | "club" | "museum" | "cafe" | "community_center" | "healthcare" | "other"

export interface LegalStatus {
  same_sex_marriage: boolean
  anti_discrimination: boolean
  gender_recognition: GenderRecognition
  adoption: boolean
  workplace_protection: boolean
  hate_crime_protection: boolean
  details: string[]
}

export interface SafetySummary {
  overall_rating: SafetyRating
  public_safety: string
  nightlife: string
  healthcare: string
  incidents: string
  tips: string[]
}

export interface QueerSpot {
  name: string
  type: SpotType
  description: string
  address: string
  website: string
  rating: number
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface CityData {
  city: string
  country: string
  queer_index: number
  legal_status: LegalStatus
  safety_summary: SafetySummary
  spots: QueerSpot[]
  history: string
  sources: string[]
  last_updated: string
  user_flags: number
  coordinates?: Coordinates
} 