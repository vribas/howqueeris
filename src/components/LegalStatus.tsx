"use client"

import { LegalStatus as LegalStatusType } from "@/types/city"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface LegalStatusProps {
  data: LegalStatusType
}

export function LegalStatus({ data }: LegalStatusProps) {
  const LegalItem = ({ label, value }: { label: string; value: boolean }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium">{label}</span>
      {value ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <LegalItem label="Same-Sex Marriage" value={data.same_sex_marriage} />
          <LegalItem label="Anti-Discrimination Laws" value={data.anti_discrimination} />
          <LegalItem label="Workplace Protection" value={data.workplace_protection} />
          <LegalItem label="Adoption Rights" value={data.adoption} />
          <LegalItem label="Hate Crime Protection" value={data.hate_crime_protection} />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium">Gender Recognition</span>
            <span className="text-sm capitalize">{data.gender_recognition.replace("-", " ")}</span>
          </div>
          
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold">Additional Details</h4>
            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
              {data.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 