import { NextResponse } from "next/server";
import { generateCity } from "@/lib/ai/cityGenerator";

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const { city, country } = await request.json();
    
    // Validate input
    if (!city || !country) {
      return NextResponse.json(
        { error: "City and country are required fields" },
        { status: 400 }
      );
    }
    
    // Generate the city data
    const cityData = await generateCity(city, country);
    
    // Return the generated city data
    return NextResponse.json({ data: cityData });
  } catch (error) {
    console.error("Error in city generation API:", error);
    return NextResponse.json(
      { error: "Failed to generate city data" },
      { status: 500 }
    );
  }
}
