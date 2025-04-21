"use client"

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CityData } from "@/types/city";
import { useRouter } from 'next/navigation';

// You should sign up for a free Mapbox account and add your token to .env.local
// https://account.mapbox.com/
if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error('Mapbox token is required. Please add it to .env.local');
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface CityMapProps {
  cities: CityData[];
}

interface SelectedLocation {
  name: string;
  country: string;
  coordinates: [number, number];
}

export function CityMap({ cities }: CityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const geocoder = useRef<MapboxGeocoder | null>(null);
  const markers = useRef<{[key: string]: mapboxgl.Marker}>({});
  const popups = useRef<{[key: string]: mapboxgl.Popup}>({});
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [existingCity, setExistingCity] = useState<CityData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  // Get color based on queer index score
  const getColorForQueerIndex = (index: number): string => {
    if (index >= 80) return '#4ade80'; // Green
    if (index >= 60) return '#a3e635'; // Light green
    if (index >= 40) return '#facc15'; // Yellow
    if (index >= 20) return '#fb923c'; // Orange
    return '#f87171'; // Red
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    
    // Create the map instance with the same color theme as BlobBackground
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark theme to match the app's aesthetic
      center: [0, 30], // Initial center
      zoom: 1.5 // Global view
    });
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add geocoder (search) control
    geocoder.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl as any, // Type assertion to fix compatibility issue
      types: 'place',
      placeholder: 'Search for a city...',
      zoom: 10
    });
    
    map.current.addControl(geocoder.current, 'top-left');
    
    // Handle geocoder result selection
    geocoder.current.on('result', (event: any) => {
      const result = event.result;
      const countryObj = result.context?.find((c: any) => c.id.startsWith('country.'));
      setSelectedLocation({
        name: result.text,
        country: countryObj?.text ?? '', // Use nullish coalescing to ensure empty string as fallback
        coordinates: result.center as [number, number]
      });
      
      // Check if this city already exists in our data
      const cityMatch = cities.find(c => 
        c.city.toLowerCase() === result.text.toLowerCase() &&
        (countryObj ? c.country.toLowerCase() === countryObj.text.toLowerCase() : true)
      );
      
      setExistingCity(cityMatch || null);
    });
    
    // Handle map clicks for city selection
    map.current.on('click', async (event) => {
      const { lng, lat } = event.lngLat;
      
      // Reverse geocode to get city name
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place&access_token=${mapboxgl.accessToken}`
        );
        
        const data = await response.json();
        if (data.features.length > 0) {
          const place = data.features[0];
          const countryFeature = data.features.find((f: any) => f.place_type.includes('country'));
          
          setSelectedLocation({
            name: place.text,
            country: countryFeature?.text ?? '', // Use nullish coalescing
            coordinates: place.center as [number, number]
          });
          
          // Check if this city already exists in our data
          const cityMatch = cities.find(c => 
            c.city.toLowerCase() === place.text.toLowerCase() &&
            (countryFeature ? c.country.toLowerCase() === countryFeature.text.toLowerCase() : true)
          );
          
          setExistingCity(cityMatch || null);
        }
      } catch (error) {
        console.error("Error with reverse geocoding:", error);
      }
    });

    // Add load event handler
    map.current.on('load', () => {
      addCityMarkers();
    });

    return () => {
      // Cleanup
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [cities]);

  // Add city markers to the map
  const addCityMarkers = () => {
    if (!map.current) return;
    
    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};
    
    // Add markers for each city
    cities.forEach(city => {
      // Skip cities without coordinates data
      if (!city.coordinates) return;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'city-marker';
      el.style.backgroundColor = getColorForQueerIndex(city.queer_index);
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid rgba(255, 255, 255, 0.5)';
      
      // Create popup
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-2">
          <div class="font-bold">${city.city}, ${city.country}</div>
          <div>Queer Index: ${city.queer_index}</div>
        </div>
      `);
      
      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([city.coordinates?.lng || 0, city.coordinates?.lat || 0]) // Add null check with default values
        .setPopup(popup)
        .addTo(map.current!);
      
      // Store reference to marker
      markers.current[`${city.city}-${city.country}`] = marker;
      popups.current[`${city.city}-${city.country}`] = popup;
      
      // Add hover events
      el.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
      });
      
      el.addEventListener('mouseleave', () => {
        popup.remove();
      });
      
      // Add click event
      el.addEventListener('click', () => {
        if (city.coordinates) { // Check for null/undefined
          setSelectedLocation({
            name: city.city,
            country: city.country,
            coordinates: [city.coordinates.lng, city.coordinates.lat]
          });
          setExistingCity(city);
        }
      });
    });
  };

  // Handle city data generation
  const handleGenerateCity = async () => {
    if (!selectedLocation) return;
    
    setIsGenerating(true);
    try {
      // In a real implementation, this would make an API call to generate city data
      console.log(`Generating data for ${selectedLocation.name}, ${selectedLocation.country}`);
      
      // Navigate to the admin page to generate the city
      router.push(`/admin?city=${encodeURIComponent(selectedLocation.name)}&country=${encodeURIComponent(selectedLocation.country)}`);
    } catch (error) {
      console.error("Error generating city data:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle viewing existing city
  const handleViewCity = () => {
    if (!existingCity) return;
    router.push(`/city/${encodeURIComponent(existingCity.city.toLowerCase().replace(/\s+/g, '-'))}`);
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-[-1]">
      <div ref={mapContainer} className="absolute w-screen h-screen top-0 right-0 bottom-0 left-0 overflow-hidden" />
      
      {/* Custom map controls styling to match app theme */}
      <style jsx global>{`
        .mapboxgl-ctrl-geocoder {
          border-radius: var(--radius-md);
          box-shadow: none;
          border: 1px solid var(--border);
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .mapboxgl-ctrl-geocoder input {
          color: var(--foreground);
        }
        
        .mapboxgl-ctrl-geocoder .suggestions {
          background-color: var(--background);
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
        }
        
        .mapboxgl-ctrl-geocoder .suggestions > li > a {
          color: var(--foreground);
        }
        
        .mapboxgl-ctrl-geocoder .suggestions > .active > a, 
        .mapboxgl-ctrl-geocoder .suggestions > li > a:hover {
          background-color: var(--accent);
          color: var(--accent-foreground);
        }
        
        .mapboxgl-popup-content {
          background-color: var(--background);
          color: var(--foreground);
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          padding: 0;
        }
        
        .mapboxgl-popup-tip {
          border-top-color: var(--background);
          border-bottom-color: var(--background);
        }

        .mapboxgl-canvas-container,
        .mapboxgl-canvas {
          width: 100vw !important;
          height: 100vh !important;
          position: relative;
        }
      `}</style>
      
      {/* City selection panel */}
      {selectedLocation && (
        <Card className="absolute bottom-4 left-4 z-20 max-w-md">
          <CardHeader>
            <CardTitle className="font-display">
              {selectedLocation.name}
              {selectedLocation.country && `, ${selectedLocation.country}`}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {existingCity ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getColorForQueerIndex(existingCity.queer_index) }}
                  />
                  <span>Queer Index: {existingCity.queer_index}/100</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: {new Date(existingCity.last_updated).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground mb-4">
                No data available for this city yet.
              </p>
            )}
          </CardContent>
          
          <CardFooter className="flex gap-2">
            {existingCity ? (
              <Button onClick={handleViewCity} className="w-full">
                View City Details
              </Button>
            ) : (
              <Button 
                onClick={handleGenerateCity}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate City Data"}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 