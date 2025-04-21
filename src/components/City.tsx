"use client"

import { LegalStatus, SafetySummary, QueerSpot, CityData } from "@/types/city"
import { QueerIndex } from "@/components/QueerIndex"
import { LegalStatus as LegalStatusComponent } from "@/components/LegalStatus"
import { SafetySummary as SafetySummaryComponent } from "@/components/SafetySummary"
import { SpotList } from "@/components/SpotList"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CityProps {
  data: CityData
  onClick?: () => void
}

export function City({ data, onClick }: CityProps) {
  return (
    <Card onClick={onClick} className={onClick ? "hover:bg-accent cursor-pointer hover:scale-[1.02] hover:shadow-lg" : undefined}>
      {/* Hero section */}
      <CardHeader>
          <CardTitle className="text-5xl font-display leading-tight">
            {data.city}, {data.country}
          </CardTitle>
          {data.history && (
            <CardDescription className="max-w-[700px] text-lg text-muted-foreground">
              {data.history}
            </CardDescription>
          )}
      </CardHeader>
      <CardContent>
      {/* Main content */}
        <div className="grid gap-4 md:grid-cols-2">
            <QueerIndex 
              city={data.city} 
              score={data.queer_index} 
              legalStatus={data.legal_status}
              safetySummary={data.safety_summary}
              spots={data.spots}
            />
            {data.safety_summary && (
              <SafetySummaryComponent data={data.safety_summary} />
            )}
        </div>

        {data.legal_status && (
            <LegalStatusComponent data={data.legal_status} />
        )}
        
        {data.spots && data.spots.length > 0 && (
            <SpotList spots={data.spots} />
        )}
      </CardContent>
      <CardFooter>
        {/* Sources and last updated */}
        {data.sources && data.sources.length > 0 && (
            <section className="space-y-4 border-t pt-6">
            <div>
                <h2 className="text-lg font-semibold">Sources</h2>
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                {data.sources.map((source, index) => (
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
            {data.last_updated && (
                <p className="text-sm text-muted-foreground">
                Last updated: {new Date(data.last_updated).toLocaleDateString()}
                </p>
            )}
            {data.user_flags > 0 && (
                <p className="text-sm text-amber-500">
                This city data has been flagged {data.user_flags} time(s) as potentially inaccurate or outdated.
                </p>
            )}
            </section>
        )}

        {/* AI generation disclaimer */}
        <section className="border-t pt-4 text-xs text-muted-foreground">
            <p>
            <strong>How this information was generated:</strong> The data on this page was aggregated from various public sources and summarized with AI assistance. Queer Index scores are calculated based on legal protections, safety reports, and community resources.
            </p>
            <p className="mt-1">
            This data should be used as a general reference only and may not reflect the experiences of all LGBTQ+ individuals. Always consult additional sources and local community resources before travel or relocation decisions.
            </p>
        </section>
      </CardFooter>
    </Card>
  )
} 