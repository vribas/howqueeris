import { cities } from '@/data/cities'
import { CityData } from '@/types/city'

/**
 * Get all available cities data
 */
export async function getAllCities(): Promise<CityData[]> {
  // For now, we're just returning the static data
  // In a real application, this might fetch from an API or database
  return cities
} 