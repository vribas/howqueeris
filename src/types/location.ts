export interface Location {
  name: string;
  country: string;
  coordinates: [number, number];
  bbox?: [number, number, number, number];
  id?: string;
  type: string;
}

export interface LocationDetail extends Location {
  region: string;
  fullContext: string;
  contextParts: string[];
  relevance: number;
  placeType: string;
  adminLevel?: number;
  properties?: {
    population?: number | null;
    osm_id?: number;
    osm_type?: string;
  };
} 