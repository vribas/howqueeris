"use client"

import { QueerIndex } from "@/components/QueerIndex"
import { CitySearch } from "@/components/CitySearch"
import { MinorityGroupSelectorWithContext } from "@/components/MinorityGroupSelectorWithContext"

// This would come from your data source in production
const SAMPLE_CITIES = [
  { city: "Berlin", country: "Germany", queer_index: 88 },
  { city: "San Francisco", country: "USA", queer_index: 92 },
  { city: "Bangkok", country: "Thailand", queer_index: 65 },
  { city: "Amsterdam", country: "Netherlands", queer_index: 90 },
  { city: "Toronto", country: "Canada", queer_index: 89 },
  { city: "Sydney", country: "Australia", queer_index: 87 },
  { city: "London", country: "UK", queer_index: 85 },
  { city: "Barcelona", country: "Spain", queer_index: 86 },
  { city: "Tel Aviv", country: "Israel", queer_index: 88 },
  { city: "Copenhagen", country: "Denmark", queer_index: 91 }
]

export default function Home() {
  return (
    <section className="flex flex-col h-full w-full items-center justify-center space-y-6 p-8 transition-all duration-600">
      <CitySearch variant="large" cities={SAMPLE_CITIES} />
    </section>
  )
}
