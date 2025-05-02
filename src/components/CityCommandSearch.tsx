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
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { useCallback, useState, useEffect, useRef } from "react"
import { searchLocations } from '@/lib/geocoding'
import { Location, LocationDetail } from '@/types/location'

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error('Mapbox token is required. Please add it to .env.local')
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const mapboxClient = new MapboxGeocoder({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
  types: 'place,region,country',
  limit: 5
});

interface CityCommandSearchProps {
  cities: CityData[]
  onSelectCity?: (city: CityData) => void
  onSelectLocation?: (location: { name: string; country: string; coordinates: [number, number]; bbox?: [number, number, number, number] }) => void
  className?: string
  variant?: "default" | "large" | "header"
  onSelect?: (location: LocationDetail) => void
  existingCities?: string[]
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
  variant = "default",
  onSelect,
  existingCities
}: CityCommandSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [closing, setClosing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [results, setResults] = React.useState<LocationDetail[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [showDropdown, setShowDropdown] = React.useState(false)

  // Debounce search
  const debouncedSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&` +
        `types=place,region,country&` +
        `limit=10` // Increased limit to ensure we get all relevant results before filtering
      );
      
      const data = await response.json();
      const locations = data.features.map((feature: any) => ({
        name: feature.text,
        country: feature.context?.find((ctx: any) => ctx.id.includes('country'))?.text,
        region: feature.context?.find((ctx: any) => ctx.id.includes('region'))?.text,
        coordinates: feature.center,
        bbox: feature.bbox,
        id: feature.id,
        type: feature.place_type[0],
        fullContext: feature.place_name,
        contextParts: feature.context?.map((ctx: any) => ctx.text) || [],
        relevance: feature.relevance,
        placeType: feature.place_type[0],
        properties: feature.properties
      }));

      // Filter out duplicate names by prioritizing cities over regions
      const filteredLocations = locations.reduce((acc: LocationDetail[], location: LocationDetail) => {
        // Check if we already have a location with the same name
        const existingLocation = acc.find(l => l.name.toLowerCase() === location.name.toLowerCase());
        
        if (!existingLocation) {
          // If no location with this name exists, add it
          acc.push(location);
        } else {
          // If a location with this name exists, decide which one to keep
          if (
            // Replace region with city
            (existingLocation.type === 'region' && location.type === 'place') ||
            // Keep the one with higher relevance score if same type
            (existingLocation.type === location.type && location.relevance > existingLocation.relevance)
          ) {
            const index = acc.indexOf(existingLocation);
            acc[index] = location;
          }
        }
        return acc;
      }, []);

      // Sort results: cities first, then regions, then countries
      const sortedLocations = filteredLocations.sort((a: LocationDetail, b: LocationDetail) => {
        const typeOrder = { place: 0, region: 1, country: 2 };
        const typeA = typeOrder[a.type as keyof typeof typeOrder] || 3;
        const typeB = typeOrder[b.type as keyof typeof typeOrder] || 3;
        
        if (typeA !== typeB) return typeA - typeB;
        return b.relevance - a.relevance;
      });

      setResults(sortedLocations);
    } catch (error) {
      console.error('Error searching locations:', error);
      setResults([]);
    }
  };

  // Manage close animation
  const handleCloseDropdown = () => {
    if (!open) return
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 100)
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
      setResults([])
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

  // Handle selection
  const handleSelect = (location: LocationDetail) => {
    setSearchQuery(location.name)
    setShowDropdown(false)
    if (onSelect) {
      onSelect(location)
    }
    if (onSelectLocation) {
      onSelectLocation({
        name: location.name,
        country: location.country || '',
        coordinates: location.coordinates,
        bbox: location.bbox
      })
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  }

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
          onKeyDown={handleKeyDown}
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
                {results.map((location, index) => (
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
              </CommandList>
            </Command>
          </Card>
        </div>
      )}
    </div>
  )
} 