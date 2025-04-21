"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface QueerIndexProps {
  score: number
  city: string
}

export function QueerIndex({ score, city }: QueerIndexProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Queer Index for {city}</CardTitle>
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
        </div>
      </CardContent>
    </Card>
  )
} 