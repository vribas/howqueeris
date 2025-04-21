"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MinorityGroupSelector } from "./MinorityGroupSelector"
import { City } from "./City"
import { CityData } from "@/types/city"

interface CitySearchProps {
  cities: CityData[]
}

export function CitySearch({ cities }: CitySearchProps) {
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)

  const filteredCities = React.useMemo(() => {
    if (!query) return []
    const searchQuery = query.toLowerCase()
    return cities
      .filter(city => 
        city.city.toLowerCase().startsWith(searchQuery) || 
        city.country.toLowerCase().startsWith(searchQuery)
      )
      // .slice(0, 5) // Show top 5 results
  }, [query, cities])

  React.useEffect(() => {
    if (inputRef.current && measureRef.current) {
      const width = measureRef.current.offsetWidth
      inputRef.current.style.width = `${Math.max(width, 100)}px`
    }
  }, [query])

  return (
    <>
      <h1 className="flex flex-wrap w-full break-words items-center justify-center text-5xl text-left font-head">
        How safe is&nbsp;
        <div className="relative inline-block">
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-16 -mr-1 !text-5xl !overflow-x-visible font-semibold capitalize font-display"
            autoFocus
            aria-label="Search for a city"
            style={{
              width: query ? "auto" : 0
            }}
          />
          <span
            ref={measureRef}
            className={cn(
              "absolute flex items-center h-16 top-0 pr-1 whitespace-pre text-5xl pointer-events-none font-semibold capitalize font-display",
              query ? "opacity-100" : "opacity-50"
            )}
            aria-hidden="true"
          >
            {query || "Barcelona"}
          </span>
        </div>
        &nbsp;for&nbsp;
        <MinorityGroupSelector variant="large" />
        ?
      </h1>
      
      {/* Results list */}
      <div 
        className={cn(
          "w-full transition-all duration-300 ease-in-out mt-6",
          query && filteredCities.length > 0 ? "opacity-100" : "opacity-0"
        )}
        style={{
          height: query && filteredCities.length > 0 ? "100%" : 0
        }}
      >
        <div className="w-full space-y-4 px-8">
          {filteredCities.map((city) => (
            <City 
              key={`${city.city}-${city.country}`}
              data={city}
              variant="search"
            />
          ))}
        </div>
      </div>
    </>
  )
} 