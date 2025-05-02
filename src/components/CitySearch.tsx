"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { MinorityGroupSelector } from "@/components/MinorityGroupSelector"
import { City } from "@/components/City"
import { CityData } from "@/types/city"
import { CityMap } from "@/components/CityMap"
import { useEffect } from "react"
import { useState } from "react"
import { getAllCities } from "@/lib/city"
import { CityCommandSearch } from "@/components/CityCommandSearch"

interface CitySearchProps {
  cities: CityData[]
}

export function CitySearch({ cities }: CitySearchProps) {
  const [mapCities, setMapCities] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const [mapLocation, setMapLocation] = useState<{ name: string; country: string; coordinates: [number, number] } | null>(null)

  useEffect(() => {
    const fetchCities = async () => {
      const citiesData = await getAllCities()
      setMapCities(citiesData)
      setLoading(false)
    }

    fetchCities()
  }, [])

  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city)
  }

  const handleLocationSelect = (location: { name: string; country: string; coordinates: [number, number] }) => {
    setMapLocation(location)
  }

  return (
    <>
      <h1 className="z-2 flex flex-wrap w-full mb-0 break-words items-center justify-center text-5xl text-left font-head">
        How safe is&nbsp;
        <CityCommandSearch 
          cities={cities} 
          onSelectCity={handleCitySelect}
          onSelectLocation={handleLocationSelect}
          variant="large"
        />
        &nbsp;for&nbsp;
        <MinorityGroupSelector variant="large" />
        ?
      </h1>
      
      {/* Results list */}
      {selectedCity && (
        <div className="z-2 w-full transition-all duration-300 ease-in-out m-0 mt-[70vh]">
          <div className="w-full space-y-4 px-8">
            <City data={selectedCity} />
          </div>
        </div>
      )}
      <CityMap cities={mapCities} selectedLocation={mapLocation} />
    </>
  )
} 