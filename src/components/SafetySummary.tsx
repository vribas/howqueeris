"use client"

import { SafetySummary as SafetySummaryType } from "@/types/city"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Moon, Heart, AlertTriangle } from "lucide-react"

interface SafetySummaryProps {
  data: SafetySummaryType
}

export function SafetySummary({ data }: SafetySummaryProps) {
  const SafetyRatingBadge = ({ rating }: { rating: string }) => {
    const colors = {
      very_safe: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      moderately_safe: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      less_safe: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
    }

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[rating as keyof typeof colors]}`}>
        {rating.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    )
  }

  const SafetyItem = ({ icon: Icon, title, content }: { icon: any; title: string; content: string }) => (
    <div className="flex space-x-3">
      <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{content}</p>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Safety Summary</CardTitle>
          <SafetyRatingBadge rating={data.overall_rating} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <SafetyItem
            icon={Shield}
            title="Public Safety"
            content={data.public_safety}
          />
          <SafetyItem
            icon={Moon}
            title="Nightlife"
            content={data.nightlife}
          />
          <SafetyItem
            icon={Heart}
            title="Healthcare"
            content={data.healthcare}
          />
          <SafetyItem
            icon={AlertTriangle}
            title="Incidents"
            content={data.incidents}
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Safety Tips</h4>
          <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
            {data.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 