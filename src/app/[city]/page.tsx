import { notFound } from "next/navigation"
import { QueerIndex } from "@/components/QueerIndex"
import { LegalStatus } from "@/components/LegalStatus"
import { SafetySummary } from "@/components/SafetySummary"
import { SpotList } from "@/components/SpotList"
import { CityData } from "@/types/city"

async function getCityData(city: string): Promise<CityData | null> {
  try {
    // In production, this would be an API call or database query
    const data = await import(`@/data/cities/${city.toLowerCase()}.json`)
    return data.default
  } catch (error) {
    return null
  }
}

export default async function CityPage({
  params,
}: {
  params: { city: string }
}) {
  const cityData = await getCityData(params.city)

  if (!cityData) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
            {cityData.city}, {cityData.country}
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            {cityData.history}
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="grid gap-8 md:grid-cols-2">
        <QueerIndex city={cityData.city} score={cityData.queer_index} />
        <SafetySummary data={cityData.safety_summary} />
      </div>

      <LegalStatus data={cityData.legal_status} />
      
      <SpotList spots={cityData.spots} />

      {/* Sources and last updated */}
      <section className="space-y-4 border-t pt-6">
        <div>
          <h2 className="text-lg font-semibold">Sources</h2>
          <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
            {cityData.sources.map((source, index) => (
              <li key={index}>
                <a 
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(cityData.last_updated).toLocaleDateString()}
        </p>
      </section>
    </div>
  )
} 