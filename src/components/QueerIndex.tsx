"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { LegalStatus, SafetySummary, QueerSpot } from "@/types/city"
import { getQueerIndexBreakdown } from "@/lib/ai/scoreCalculator"

interface QueerIndexProps {
  score: number
  city: string
  legalStatus?: LegalStatus
  safetySummary?: SafetySummary
  spots?: QueerSpot[]
  showBreakdown?: boolean
}

export function QueerIndex({ 
  score, 
  city, 
  legalStatus, 
  safetySummary, 
  spots,
  showBreakdown = false 
}: QueerIndexProps) {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(showBreakdown)

  const getProgressClasses = (score: number) => {
    if (score >= 80) {
      return "[&>div]:bg-green-500 bg-background/10"
    }
    if (score >= 60) {
      return "[&>div]:bg-yellow-500 bg-background/10"
    }
    return "[&>div]:bg-red-500 bg-background/10"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Very Queer-Friendly"
    if (score >= 60) return "Moderately Queer-Friendly"
    return "Less Queer-Friendly"
  }

  // Only show the breakdown button if we have all the necessary data
  const canShowBreakdown = !!(legalStatus && safetySummary && spots)

  // Generate breakdown data if all components are available
  const breakdown = canShowBreakdown 
    ? getQueerIndexBreakdown(legalStatus!, safetySummary!, spots!)
    : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Queer Index for {city}</span>
          {canShowBreakdown && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
            >
              {isBreakdownOpen ? "Hide Breakdown" : "Show Breakdown"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress 
            value={score} 
            className={cn(
              "h-3", // Make the progress bar a bit taller
              getProgressClasses(score)
            )}
          />
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">{score}/100</span>
            <span className="text-lg">{getScoreLabel(score)}</span>
          </div>

          {isBreakdownOpen && breakdown && (
            <div className="mt-6 space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Score Breakdown</h3>
              
              <div className="space-y-3">
                {/* Legal Component */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Legal Protections ({Math.round(breakdown.components.legal.weight * 100)}%)</span>
                    <span>{breakdown.components.legal.rawScore}/100</span>
                  </div>
                  <Progress 
                    value={breakdown.components.legal.rawScore} 
                    className="h-2 [&>div]:bg-blue-500 bg-background/10"
                  />
                </div>
                
                {/* Safety Component */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Safety & Acceptance ({Math.round(breakdown.components.safety.weight * 100)}%)</span>
                    <span>{breakdown.components.safety.rawScore}/100</span>
                  </div>
                  <Progress 
                    value={breakdown.components.safety.rawScore} 
                    className="h-2 [&>div]:bg-purple-500 bg-background/10"
                  />
                </div>
                
                {/* Spots Component */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Community Spaces ({Math.round(breakdown.components.spots.weight * 100)}%)</span>
                    <span>{breakdown.components.spots.rawScore}/100</span>
                  </div>
                  <Progress 
                    value={breakdown.components.spots.rawScore} 
                    className="h-2 [&>div]:bg-pink-500 bg-background/10"
                  />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                The Queer Index is a weighted score calculated from legal protections, safety/social 
                acceptance, and community spaces and resources.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 