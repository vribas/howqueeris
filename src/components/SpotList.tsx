"use client"

import { QueerSpot } from "@/types/city"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star, ExternalLink } from "lucide-react"

interface SpotListProps {
  spots: QueerSpot[]
}

export function SpotList({ spots }: SpotListProps) {
  const SpotTypeIcon = ({ type }: { type: QueerSpot["type"] }) => {
    const iconClass = "h-6 w-6 text-muted-foreground"
    // You can add more icons from lucide-react as needed
    return <div className={`rounded-full bg-background/10 p-2 ${iconClass}`}>{type}</div>
  }

  const SpotCard = ({ spot }: { spot: QueerSpot }) => (
    <div className="group relative rounded-lg border p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium leading-none">{spot.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{spot.type}</p>
        </div>
        <SpotTypeIcon type={spot.type} />
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground">{spot.description}</p>
        
        <div className="flex items-center space-x-1 text-sm">
          <MapPin className="h-4 w-4" />
          <span className="text-muted-foreground">{spot.address}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{spot.rating.toFixed(1)}</span>
          </div>
          
          <a
            href={spot.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm font-medium text-primary hover:underline"
          >
            <span>Visit</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Queer-Friendly Spots</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <SpotCard key={spot.name} spot={spot} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 