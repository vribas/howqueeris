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
import mapStyles from '@/config/map-styles.json';

// You should sign up for a free Mapbox account and add your token to .env.local
// https://account.mapbox.com/
if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error('Mapbox token is required. Please add it to .env.local');
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface CityMapProps {
  cities: CityData[];
  selectedLocation?: { 
    name: string; 
    country: string; 
    coordinates: [number, number]; 
    bbox?: [number, number, number, number];
    id?: string;
    type?: string;
  } | null;
}

interface SelectedLocation {
  name: string;
  country: string;
  coordinates: [number, number];
}

export function CityMap({ cities, selectedLocation }: CityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const geocoder = useRef<MapboxGeocoder | null>(null);
  const markers = useRef<{[key: string]: mapboxgl.Marker}>({});
  const popups = useRef<{[key: string]: mapboxgl.Popup}>({});
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

  // Update map view when selected location changes
  useEffect(() => {
    if (!map.current || !selectedLocation) return;

    // Remove any existing boundary layer
    if (map.current.getLayer('selected-boundary-fill')) {
      map.current.removeLayer('selected-boundary-fill');
    }
    if (map.current.getLayer('selected-boundary')) {
      map.current.removeLayer('selected-boundary');
    }
    if (map.current.getSource('selected-boundary')) {
      map.current.removeSource('selected-boundary');
    }

    const { coordinates, name, country } = selectedLocation;
    
    // First, fly to the location immediately
    if (map.current) {
      if (selectedLocation.bbox) {
        map.current.fitBounds([
          [selectedLocation.bbox[0], selectedLocation.bbox[1]], // southwestern corner
          [selectedLocation.bbox[2], selectedLocation.bbox[3]]  // northeastern corner
        ], {
          padding: 50,
          duration: 1000
        });
      } else {
        map.current.flyTo({
          center: coordinates,
          zoom: 12,
          duration: 1000
        });
      }
    }

    console.log('Fetching boundary for:', name);
    
    // Use our API endpoint to get boundaries
    fetch(`/api/boundaries?name=${encodeURIComponent(name)}${country ? `&country=${encodeURIComponent(country)}` : ''}`)
      .then(response => response.json())
      .then(data => {
        console.log('Boundary response:', data);
        
        if (!map.current || !data || (data.type !== 'Feature' && !data.elements)) {
          console.log('No boundary data returned');
          fallbackZoom();
          return;
        }

        // Convert Overpass API response to GeoJSON if needed
        let geoJsonData;
        if (data.type === 'Feature') {
          geoJsonData = data;
        } else if (data.elements && data.elements.length > 0) {
          const element = data.elements[0];
          if (element.type === 'way') {
            geoJsonData = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [element.geometry.map((g: any) => [g.lon, g.lat])]
              },
              properties: element.tags
            };
          } else if (element.type === 'relation') {
            // For relations, we need to construct the polygon from the members
            const polygonCoords = element.members
              .filter((m: any) => m.type === 'way')
              .map((m: any) => m.geometry.map((g: any) => [g.lon, g.lat]));
            
            geoJsonData = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [polygonCoords.flat()]
              },
              properties: element.tags
            };
          }
        }

        if (!geoJsonData) {
          console.log('Could not process boundary data');
          fallbackZoom();
          return;
        }

        // Remove any existing boundary layers
        if (map.current.getLayer('selected-boundary')) {
          map.current.removeLayer('selected-boundary');
        }
        if (map.current.getSource('selected-boundary')) {
          map.current.removeSource('selected-boundary');
        }

        // Add the boundary source
        map.current.addSource('selected-boundary', {
          type: 'geojson',
          data: geoJsonData
        });

        // Add outline layer with initial opacity of 0
        map.current.addLayer({
          id: 'selected-boundary',
          type: 'line',
          source: 'selected-boundary',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ffffff',
            'line-width': 1,
            'line-opacity': 0,
            'line-dasharray': [4, 4]
          }
        });

        // Animate the opacity
        const animateOpacity = (currentOpacity: number) => {
          if (!map.current) return;
          
          map.current.setPaintProperty('selected-boundary', 'line-opacity', currentOpacity);
          
          if (currentOpacity < 0.5) {
            requestAnimationFrame(() => animateOpacity(currentOpacity + 0.05));
          }
        };

        // Start the animation
        animateOpacity(0);

        // Calculate bounds from the feature
        const bounds = new mapboxgl.LngLatBounds();
        if (geoJsonData.geometry.type === 'Polygon') {
          geoJsonData.geometry.coordinates[0].forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });
        } else if (geoJsonData.geometry.type === 'MultiPolygon') {
          geoJsonData.geometry.coordinates.forEach((polygon: [number, number][][]) => {
            polygon[0].forEach((coord: [number, number]) => {
              bounds.extend(coord);
            });
          });
        }

        if (!bounds.isEmpty()) {
          map.current.fitBounds(bounds, {
            padding: {
              top: 150,
              bottom: 100,
              left: 150,
              right: 150
            },
            duration: 1000
          });
        } else {
          fallbackZoom();
        }
      })
      .catch(error => {
        console.error('Error fetching boundary:', error);
        fallbackZoom();
      });

    // Helper function for fallback zoom behavior
    const fallbackZoom = () => {
      if (!map.current) return;
      
      if (selectedLocation.bbox) {
        map.current.fitBounds([
          [selectedLocation.bbox[0], selectedLocation.bbox[1]],
          [selectedLocation.bbox[2], selectedLocation.bbox[3]]
        ], {
          padding: {
            top: 150,
            bottom: 100,
            left: 150,
            right: 150
          },
          duration: 1000
        });
      } else {
        map.current.flyTo({
          center: selectedLocation.coordinates,
          zoom: 12,
          duration: 1000
        });
      }
    };

    // Check if this city exists in our data
    const cityMatch = cities.find(c => 
      c.city.toLowerCase() === selectedLocation.name.toLowerCase() &&
      (selectedLocation.country ? c.country.toLowerCase() === selectedLocation.country.toLowerCase() : true)
    );
    
    setExistingCity(cityMatch || null);
  }, [selectedLocation, cities]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    
    // Create the map instance with the same color theme as BlobBackground
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/vribas2/cm9rkme46007t01s5b1b65q8d/draft', // Use our custom map style URL
      center: [0, 30], // Initial center
      zoom: 0 // Global view
    });
    
    // // Add navigation controls
    // map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
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
    <div className="fixed w-screen h-screen top-0 left-0 z-0">
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
        
        .mapboxgl-ctrl-bottom-left,
        .mapboxgl-ctrl-bottom-right {
          display: none;
        }
      `}</style>
    </div>
  );
} 