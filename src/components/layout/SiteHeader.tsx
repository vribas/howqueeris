"use client"

import Link from "next/link"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { CitySearch } from "@/components/CitySearch"

// This would come from your data source in production
const SAMPLE_CITIES = [
  { city: "Berlin", country: "Germany", queer_index: 88 },
  { city: "San Francisco", country: "USA", queer_index: 92 },
  { city: "Bangkok", country: "Thailand", queer_index: 65 },
  { city: "Amsterdam", country: "Netherlands", queer_index: 90 },
  { city: "Toronto", country: "Canada", queer_index: 89 },
]

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">HowQueerIs</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <CitySearch cities={SAMPLE_CITIES} />
        </div>
      </div>
    </header>
  )
} 