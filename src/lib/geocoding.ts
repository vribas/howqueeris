import { Location, LocationDetail } from '@/types/location';

export async function searchLocations(query: string): Promise<LocationDetail[]> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10`,
    {
      headers: {
        'User-Agent': 'HowQueerIs/1.0'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch from Nominatim');
  }

  const data = await response.json();
  
  return data.map((place: any) => ({
    name: place.name || place.display_name.split(',')[0],
    country: place.address.country,
    coordinates: [parseFloat(place.lon), parseFloat(place.lat)] as [number, number],
    bbox: place.boundingbox ? 
      [parseFloat(place.boundingbox[2]), parseFloat(place.boundingbox[0]), 
       parseFloat(place.boundingbox[3]), parseFloat(place.boundingbox[1])] as [number, number, number, number] : 
      undefined,
    id: `${place.osm_type}-${place.osm_id}`,
    type: place.type,
    region: place.address.state || place.address.region || '',
    contextParts: [
      place.address.state,
      place.address.country
    ].filter(Boolean),
    fullContext: place.display_name,
    relevance: 1,
    placeType: place.type,
    adminLevel: place.address.admin_level,
    properties: {
      population: null,
      osm_id: place.osm_id,
      osm_type: place.osm_type
    }
  }));
} 