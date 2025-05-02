"use client"

import { CitySearch } from "@/components/CitySearch"
import { cities } from "@/data/cities"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <section className="flex flex-col h-full w-full items-center justify-center space-y-6 p-8 transition-all duration-600">
      <CitySearch cities={cities} />
      
      {/* <div className="mt-8 flex gap-4">
        <Button asChild variant="outline">
          <Link href="/map">
            Explore Cities Map
          </Link>
        </Button>
      </div> */}
    </section>
  )
}
