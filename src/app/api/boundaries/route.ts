import { NextResponse } from 'next/server';

// Helper function to get OSM relation ID for a place
async function getOsmRelation(name: string, country: string | undefined) {
  const query = encodeURIComponent(`${name}${country ? `, ${country}` : ''}`);
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&polygon_geojson=1`,
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
  if (!data.length) {
    throw new Error('Location not found');
  }
  
  return data[0];
}

// Helper function to get detailed boundary data using Overpass API
async function getBoundaryData(osmId: string, osmType: string) {
  // Convert OSM type to relation query parameter
  const relationId = osmType === 'relation' ? osmId :
    osmType === 'way' ? `way(${osmId})` :
    `node(${osmId})`;

  const query = `[out:json];
    ${relationId};
    out geom;`;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'HowQueerIs/1.0'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from Overpass API');
  }

  const data = await response.json();
  return data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const country = searchParams.get('country') || undefined;

  if (!name) {
    return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
  }

  try {
    // First get the OSM relation
    const osmData = await getOsmRelation(name, country);
    
    // If we have polygon data directly from Nominatim, use that
    if (osmData.geojson) {
      return NextResponse.json({
        type: 'Feature',
        geometry: osmData.geojson,
        properties: {
          name: osmData.display_name,
          osm_type: osmData.osm_type,
          osm_id: osmData.osm_id
        }
      });
    }
    
    // Otherwise, fetch detailed boundary data from Overpass
    const boundaryData = await getBoundaryData(osmData.osm_id.toString(), osmData.osm_type);
    
    return NextResponse.json(boundaryData);
  } catch (error) {
    console.error('Error fetching boundary data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch boundary data' },
      { status: 500 }
    );
  }
} 