"use client"

import { useEffect, useState } from "react"
import { MinorityGroup, minorityGroups } from "@/data/minority-groups"
import { cn } from "@/lib/utils"

// Define the class mappings for each group
// For all groups, we'll use the 300 shade variant when available
const groupClassMappings = {
  // LGBTQIA+ Groups
  asexual: {
    background: "bg-gray-800",
    blobs: ["bg-purple-800", "bg-gray-500", "bg-gray-800"]
  },
  bisexual: {
    background: "bg-purple-800",
    blobs: ["bg-indigo-900", "bg-fuchsia-900", "bg-purple-900"]
  },
  gay: {
    background: "bg-indigo-800",
    blobs: ["bg-green-900", "bg-gray-500", "bg-indigo-800"]
  },
  intersex: {
    background: "bg-yellow-700",
    blobs: ["bg-yellow-700", "bg-fuchsia-900", "bg-yellow-700"]
  },
  lesbian: {
    background: "bg-fuchsia-900",
    blobs: ["bg-orange-800", "bg-gray-500", "bg-fuchsia-900"]
  },
  queer: {
    background: "bg-fuchsia-900",
    blobs: ["bg-yellow-800", "bg-teal-800", "bg-indigo-800"]
  },
  transgender: {
    background: "bg-gray-500",
    blobs: ["bg-blue-800", "bg-gray-500", "bg-fuchsia-900"]
  },
  
  // POC Groups
  asian: {
    background: "bg-orange-900",
    blobs: ["bg-orange-950", "bg-orange-800", "bg-orange-900"]
  },
  black: {
    background: "bg-orange-900",
    blobs: ["bg-orange-950", "bg-orange-800", "bg-orange-900"]
  },
  indigenous: {
    background: "bg-orange-900",
    blobs: ["bg-orange-950", "bg-orange-800", "bg-orange-900"]
  },
  latinx: {
    background: "bg-orange-900",
    blobs: ["bg-orange-950", "bg-orange-800", "bg-orange-900"]
  },
  mena: {
    background: "bg-orange-900",
    blobs: ["bg-orange-950", "bg-orange-800", "bg-orange-900"]
  },
  
  // Disability Groups
  "chronic-illness": {
    background: "bg-gray-500",
    blobs: ["bg-gray-500", "bg-green-800", "bg-gray-500"]
  },
  "deaf-hoh": {
    background: "bg-gray-500",
    blobs: ["bg-green-800", "bg-green-800", "bg-gray-500"]
  },
  neurodivergent: {
    background: "bg-gray-500",
    blobs: ["bg-gray-500", "bg-green-800", "bg-gray-500"]
  },
  "physical-disability": {
    background: "bg-gray-500",
    blobs: ["bg-gray-500", "bg-green-800", "bg-gray-500"]
  },
  "visual-impairment": {
    background: "bg-gray-500",
    blobs: ["bg-gray-500", "bg-green-800", "bg-gray-500"]
  },
  
  // Other Minority Groups
  elderly: {
    background: "bg-gray-600",
    blobs: ["bg-gray-800", "bg-gray-600", "bg-gray-700"]
  },
  immigrants: {
    background: "bg-gray-600",
    blobs: ["bg-gray-800", "bg-gray-600", "bg-gray-700"]
  },
  refugees: {
    background: "bg-gray-600",
    blobs: ["bg-gray-800", "bg-gray-600", "bg-gray-700"]
  },
  "religious-minorities": {
    background: "bg-gray-600",
    blobs: ["bg-gray-800", "bg-gray-600", "bg-gray-700"]
  },
}

// Default classes when no group is selected
const defaultClasses = {
    background: "bg-blue-900",
    blobs: ["bg-fuchsia-900", "bg-teal-800", "bg-indigo-800"]
}

interface BlobBackgroundProps {
  selectedGroupId: string | null
}

export function BlobBackground({ selectedGroupId }: BlobBackgroundProps) {
  const [classes, setClasses] = useState({
    background: defaultClasses.background,
    blobs: [...defaultClasses.blobs]
  })

  useEffect(() => {
    if (selectedGroupId && selectedGroupId in groupClassMappings) {
      const selectedClasses = groupClassMappings[selectedGroupId as keyof typeof groupClassMappings]
      setClasses({
        background: selectedClasses.background,
        blobs: [...selectedClasses.blobs]
      })
    } else {
      setClasses({
        background: defaultClasses.background,
        blobs: [...defaultClasses.blobs]
      })
    }
  }, [selectedGroupId])

  // We still need transition styles even though color is handled by classes
  const wrapperStyle = {
    transition: "background-color 1.5s ease-in-out"
  }

  // Separate transition durations for each blob to create a staggered effect
  const blobStyles = [
    { transition: "background-color 1.2s ease-in-out" },
    { transition: "background-color 1.5s ease-in-out" },
    { transition: "background-color 1.8s ease-in-out" }
  ]

  // For the rainbow colors in the queer flag, we'll keep the animation
  const isQueer = selectedGroupId === 'queer'

  return (
    <div 
      className={cn("blobs-wrapper", classes.background)} 
      style={wrapperStyle}
    >
      <div className="blobs">
        <div 
          className={cn("blob a", classes.blobs[0], isQueer && "rainbow-blob-1")} 
          style={blobStyles[0]}
        ></div>
        <div 
          className={cn("blob b", classes.blobs[1], isQueer && "rainbow-blob-2")} 
          style={blobStyles[1]}
        ></div>
        <div 
          className={cn("blob c", classes.blobs[2], isQueer && "rainbow-blob-3")} 
          style={blobStyles[2]}
        ></div>
      </div>
    </div>
  )
} 