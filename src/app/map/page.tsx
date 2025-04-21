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
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Cities</h1>
      <CityMap cities={cities} />
    </div>
  )
} 