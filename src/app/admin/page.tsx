"use client"

import { CityGenerator } from "@/components/CityGenerator"

export default function AdminPage() {
  return (
    <div className="container p-8">
      <h1 className="text-2xl font-bold mb-6">City Data Generator</h1>
      <p className="mb-6">
        Use this tool to automatically generate data for new cities using the AI services.
      </p>
      <CityGenerator />
    </div>
  )
}
