"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Card } from "./ui/card"
import { CityData } from "@/types/city"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useCallback } from "react"

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error('Mapbox token is required. Please add it to .env.local')
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

interface CityCommandSearchProps {
  cities: CityData[]
  onSelectCity?: (city: CityData) => void
  onSelectLocation?: (location: { name: string; country: string; coordinates: [number, number]; bbox?: [number, number, number, number] }) => void
  className?: string
  variant?: "default" | "large" | "header"
}

interface Location {
  name: string;
  country: string;
  coordinates: [number, number];
  bbox?: [number, number, number, number];
  id?: string;
  type: string;
}

// Create interfaces for our location types
interface LocationDetail extends Location {
  region: string;
  fullContext: string;
  contextParts: string[];
  relevance: number;
  placeType: string;
  adminLevel?: number;
  properties?: {
    population?: number;
  };
}

// Custom debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function CityCommandSearch({ 
  cities,
  onSelectCity,
  onSelectLocation,
  className,
  variant = "default"
}: CityCommandSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [closing, setClosing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [results, setResults] = React.useState<{ [key: string]: Location[] }>({})

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setResults({})
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?types=country,region,district,place,locality&language=en&access_token=${mapboxgl.accessToken}`
        )
        const data = await response.json()

        // Helper function to check if coordinates are within 2km of each other
        const areCoordinatesNearby = (coord1: [number, number], coord2: [number, number]): boolean => {
          const [lon1, lat1] = coord1;
          const [lon2, lat2] = coord2;
          // Rough approximation: 1 degree is about 111km at the equator
          // Check if points are within roughly 2km of each other
          return Math.abs(lat1 - lat2) < 0.018 && Math.abs(lon1 - lon2) < 0.018;
        };

        // Process and normalize locations
        const locationDetails = data.features.map((feature: any) => {
          const contextParts = (feature.context || [])
            .sort((a: any, b: any) => a.id.localeCompare(b.id))
            .map((ctx: any) => ctx.text)
            .filter(Boolean);

          const region = feature.context?.find((ctx: any) => ctx.id.includes('region'))?.text || '';
          const country = feature.context?.find((ctx: any) => ctx.id.includes('country'))?.text || '';

          // Ensure bbox is properly typed as [number, number, number, number]
          const bbox = feature.bbox && feature.bbox.length === 4 
            ? feature.bbox as [number, number, number, number]
            : undefined;

          return {
            name: feature.text,
            country,
            coordinates: feature.center as [number, number],
            bbox,
            id: `${feature.text}-${region}-${feature.center.join(',')}-${feature.id}`,
            type: feature.place_type[0],
            region,
            contextParts,
            fullContext: contextParts.join(', '),
            relevance: feature.relevance || 0,
            placeType: feature.place_type[0],
            adminLevel: feature.context?.length || 0,
            properties: feature.properties
          } as LocationDetail;
        });

        // Sort locations by relevance and specificity but don't deduplicate
        const sortedLocations = locationDetails.sort((a: LocationDetail, b: LocationDetail) => {
          // First by relevance
          if (a.relevance !== b.relevance) return b.relevance - a.relevance;
          // Then by admin level specificity
          return (b.adminLevel || 0) - (a.adminLevel || 0);
        });

        // Group results by type
        const groupedResults = sortedLocations.reduce((acc: { [key: string]: Location[] }, location: LocationDetail) => {
          let category = 'Other Places';
          if (location.type === 'country') {
            category = 'Countries';
          } else if (location.type === 'region') {
            category = 'Regions';
          } else if (location.type === 'place') {
            const population = location.properties?.population || 0;
            if (population > 1000000) {
              category = 'Major Cities';
            } else if (population > 100000) {
              category = 'Cities';
            } else {
              category = 'Towns';
            }
          } else if (location.type === 'locality' || location.type === 'district') {
            category = 'Districts & Neighborhoods';
          }

          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(location);
          return acc;
        }, {});

        setResults(groupedResults)
      } catch (error) {
        console.error('Error searching locations:', error)
        setResults({})
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  // Manage close animation
  const handleCloseDropdown = () => {
    if (!open) return
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 100)
  }

  const handleSelect = (location: Location) => {
    if (onSelectLocation) {
      // Ensure we pass the complete location object including bbox
      onSelectLocation({
        name: location.name,
        country: location.country,
        coordinates: location.coordinates,
        bbox: location.bbox
      });
    }

    // Check if this city exists in our data
    const cityMatch = cities.find(c => 
      c.city.toLowerCase() === location.name.toLowerCase() &&
      (location.country ? c.country.toLowerCase() === location.country.toLowerCase() : true)
    )

    if (cityMatch && onSelectCity) {
      onSelectCity(cityMatch);
    }

    setSearchQuery(location.name);
    handleCloseDropdown();
  }

  // Handle input change to update search query
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value) {
      setOpen(true)
      debouncedSearch(value)
    } else {
      setOpen(false)
      setResults({})
    }
  }

  // Auto-size input based on content
  React.useEffect(() => {
    if (inputRef.current && measureRef.current) {
      const width = measureRef.current.offsetWidth
      inputRef.current.style.width = width ? `${Math.max(width)}px` : "auto"
    }
  }, [searchQuery, variant])

  // Handle outside clicks to close the dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (open || closing) &&
        dropdownRef.current && 
        inputRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleCloseDropdown()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, closing])

  const getInputStyles = () => {
    switch (variant) {
      case "large":
        return "h-16 !text-5xl !overflow-x-visible font-semibold font-display"
      case "header":
        return "h-9 w-auto xl:w-48 text-sm"
      default:
        return "h-10"
    }
  }

  return (
    <div className="inline-flex flex-col relative">
      <div 
        className="relative inline-block cursor-text" 
        onClick={(e) => {
          e.stopPropagation()
          if (inputRef.current) {
            inputRef.current.focus()
            if (searchQuery) {
              setOpen(true)
            }
          }
        }}
      >
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchQuery) {
              setOpen(true)
            }
          }}
          className={cn(
            getInputStyles(), 
            searchQuery ? "-mr-1" : "",
            className
          )}
          autoFocus={true}
        />
        <span
          ref={measureRef}
          className={cn(
            "absolute flex items-center h-16 top-0 pr-1 border-b border-transparent whitespace-pre text-5xl pointer-events-none font-semibold font-display",
            variant === "large" ? "text-5xl" : "text-sm",
            searchQuery ? "opacity-100" : "opacity-50"
          )}
          aria-hidden="true"
        >
          {searchQuery || "Barcelona"}
        </span>
      </div>
        
      {(open || closing) && searchQuery && (
        <div 
          ref={dropdownRef}
          className={cn(
            "fixed mt-2 z-50 -translate-x-1/2 duration-100 slide-in-from-top-2 slide-out-to-top-2",
            closing 
              ? "animate-out fade-out-0 zoom-out-95" 
              : "animate-in fade-in-0 zoom-in-95"
          )}
          style={{
            left: inputRef.current ? inputRef.current.getBoundingClientRect().left + inputRef.current.getBoundingClientRect().width / 2 : '50%',
            top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + window.scrollY + 5 : '0',
            width: variant === "large" ? "360px" : "300px",
            minWidth: "300px"
          }}
        >
          <Card className="p-0 w-full shadow-md rounded-md overflow-hidden">
            <Command 
              className="bg-transparent !border-none"
              shouldFilter={false}
              loop={true}
            >
              <CommandList className="max-h-[300px] overflow-y-auto p-2">
                <CommandEmpty>
                  {isLoading ? "Searching..." : "No results found."}
                </CommandEmpty>
                {Object.entries(results).map(([category, locations]) => (
                  <CommandGroup key={category} heading={category}>
                    {locations.map((location) => (
                      <CommandItem
                        key={location.id}
                        onSelect={() => handleSelect(location)}
                      >
                        <div className="flex items-center gap-6 justify-between w-full">
                          <span className="shrink-0">{location.name}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {(location as LocationDetail).contextParts.length > 0 
                              ? (location as LocationDetail).contextParts.join(' • ')
                              : location.country
                            }
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </Card>
        </div>
      )}
    </div>
  )
} 