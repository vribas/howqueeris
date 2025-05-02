import mapboxgl from 'mapbox-gl';

// Initialize Mapbox client
export const mapboxClient = new mapboxgl.MapboxClient(process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''); 