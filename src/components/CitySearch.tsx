"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "./ui/card"
import { MinorityGroupSelector } from "./MinorityGroupSelector"
import { MinorityGroupSelectorWithContext } from "./MinorityGroupSelectorWithContext"

interface City {
  city: string
  country: string
  queer_index: number
}

interface CitySearchProps {
  variant?: "default" | "large"
  cities: City[]
}

export function CitySearch({ variant = "default", cities }: CitySearchProps) {
  const [query, setQuery] = React.useState("")
  const [selectedMinority, setSelectedMinority] = React.useState("")
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)

  const filteredCities = React.useMemo(() => {
    if (!query) return []
    const searchQuery = query.toLowerCase()
    return cities
      .filter(city => 
        city.city.toLowerCase().includes(searchQuery) || 
        city.country.toLowerCase().includes(searchQuery)
      )
      // .slice(0, 5) // Show top 5 results
  }, [query, cities])

  React.useEffect(() => {
    if (inputRef.current && measureRef.current) {
      const width = measureRef.current.offsetWidth
      inputRef.current.style.width = `${Math.max(width, 100)}px`
    }
  }, [query])

  const handleSelect = (city: string) => {
    const minorityParam = selectedMinority ? `?minority=${selectedMinority}` : ""
    router.push(`/${city.toLowerCase()}${minorityParam}`)
  }

  const handleMinoritySelect = (minorityId: string) => {
    setSelectedMinority(minorityId)
  }

  if (variant === "large") {
    return (
      <>
        <h1 className="flex flex-wrap w-full break-words items-center justify-center text-5xl text-left font-head">
          How is&nbsp;
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
                "absolute flex items-center h-16 top-0 pr-1 border-b border-transparent whitespace-pre text-5xl pointer-events-none font-semibold capitalize font-display",
                query ? "opacity-100" : "opacity-50"
              )}
              aria-hidden="true"
            >
              {query || "Barcelona"}
            </span>
          </div>
          &nbsp;with&nbsp;
          <MinorityGroupSelectorWithContext variant="large" />
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
              <Card
                key={`${city.city}-${city.country}`}
                onClick={() => handleSelect(city.city)}
                className="w-full hover:bg-accent cursor-pointer hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">{city.city}, {city.country}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Queer Index: {city.queer_index}
                    </span>
                    <div className="h-2 w-16 rounded-full bg-background/40 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all",
                          city.queer_index >= 80 ? "bg-green-500" :
                          city.queer_index >= 60 ? "bg-yellow-500" :
                          "bg-red-500"
                        )}
                        style={{ width: `${city.queer_index}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <div className="font-medium text-foreground">Safety</div>
                    {city.queer_index >= 80 ? "Very Safe" : 
                    city.queer_index >= 60 ? "Moderately Safe" : "Exercise Caution"}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Legal Rights</div>
                    {city.queer_index >= 80 ? "Strong Protections" : 
                    city.queer_index >= 60 ? "Basic Protections" : "Limited Protections"}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Community</div>
                    {city.queer_index >= 80 ? "Thriving" : 
                    city.queer_index >= 60 ? "Growing" : "Emerging"}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </>
    )
  }

  // Default variant (header)
  return (
    <div className="relative flex items-center space-x-2">
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-48 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => inputRef.current?.focus()}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search cities...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <MinorityGroupSelector 
        onSelect={handleMinoritySelect} 
        variant="header"
        className="w-auto xl:w-48" 
      />
    </div>
  )
} 