"use client"

import React, { useEffect, useState } from 'react'
import { CityMap } from '@/components/CityMap'
import { getAllCities } from '@/lib/city'
import { CityData } from '@/types/city'

export default function MapPage() {
  const [cities, setCities] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCities = async () => {
      const citiesData = await getAllCities()
      setCities(citiesData)
      setLoading(false)
    }

    fetchCities()
  }, [])
  
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-lg">Loading cities...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-screen">
      <CityMap cities={cities} />
    </div>
  )
} 