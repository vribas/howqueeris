"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CityData } from "@/types/city"
import { City } from "./City"
import { useSearchParams } from "next/navigation"

export function CityGenerator() {
  const searchParams = useSearchParams()
  
  // Extract city and country from URL query parameters
  const cityParam = searchParams.get('city')
  const countryParam = searchParams.get('country')
  
  const [city, setCity] = React.useState(cityParam || "")
  const [country, setCountry] = React.useState(countryParam || "")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [generatedCity, setGeneratedCity] = React.useState<CityData | null>(null)

  const handleGenerate = async () => {
    if (!city || !country) {
      setError("Both city and country are required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city, country }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate city data")
      }

      const result = await response.json()
      setGeneratedCity(result.data)
    } catch (err) {
      setError("An error occurred while generating the city data")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate on load if we have both city and country params
  React.useEffect(() => {
    if (cityParam && countryParam && !generatedCity && !isLoading) {
      handleGenerate()
    }
  }, [cityParam, countryParam])

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city-input" className="text-sm font-medium">
            City
          </label>
          <Input
            id="city-input"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="country-input" className="text-sm font-medium">
            Country
          </label>
          <Input
            id="country-input"
            placeholder="Enter country name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Generating..." : "Generate City Data"}
      </Button>

      {error && <div className="text-red-500">{error}</div>}

      {generatedCity && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated City Data</h2>
          <City data={generatedCity} />
        </div>
      )}
    </div>
  )
}
