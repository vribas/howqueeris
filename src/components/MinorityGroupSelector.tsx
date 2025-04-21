"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { MinorityGroup, minorityGroups } from "@/data/minority-groups"
import { Card } from "./ui/card"

interface MinorityGroupSelectorProps {
  onSelect: (value: string) => void
  className?: string
  variant?: "default" | "large" | "header"
}

export function MinorityGroupSelector({ 
  onSelect,
  className,
  variant = "default"
}: MinorityGroupSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)
  const itemsRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedGroup = minorityGroups.find((group) => group.id === value)

  // Get filtered groups for keyboard navigation
  const filteredGroups = React.useMemo(() => {
    return minorityGroups.filter(group => 
      searchQuery === "" || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue)
    setOpen(false)
    onSelect(currentValue === value ? "" : currentValue)
    
    // Set the search input to the selected group's name
    if (currentValue !== value && currentValue) {
      const group = minorityGroups.find(g => g.id === currentValue)
      if (group) {
        setSearchQuery(group.name)
      }
    } else {
      setSearchQuery("")
    }
  }

  // Handle input change to update search query
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value
    setSearchQuery(newSearchQuery)
    
    // Reset highlighted index when typing
    setHighlightedIndex(-1)
    
    if (!open) {
      setOpen(true)
    }
    if (e.target.value === "") {
      setValue("")
      onSelect("")
    }
  }

  // Focus the input programmatically
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (filteredGroups.length > 0) {
          const nextIndex = highlightedIndex < filteredGroups.length - 1 ? highlightedIndex + 1 : 0
          setHighlightedIndex(nextIndex)
          scrollToItem(nextIndex)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (filteredGroups.length > 0) {
          const nextIndex = highlightedIndex > 0 ? highlightedIndex - 1 : filteredGroups.length - 1
          setHighlightedIndex(nextIndex)
          scrollToItem(nextIndex)
        }
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredGroups.length) {
          handleSelect(filteredGroups[highlightedIndex].id)
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
    }
  }

  // Scroll to highlighted item
  const scrollToItem = (index: number) => {
    if (itemsRef.current) {
      const items = itemsRef.current.querySelectorAll('[data-item]')
      if (items[index]) {
        items[index].scrollIntoView({ block: 'nearest' })
      }
    }
  }

  // Auto-size input based on content
  React.useEffect(() => {
    if (inputRef.current && measureRef.current) {
      const width = measureRef.current.offsetWidth
      inputRef.current.style.width = width ? `${Math.max(width)}px` : "auto"
    }
  }, [searchQuery, variant])
  
  // Reset highlighted index when popover opens/closes
  React.useEffect(() => {
    if (open) {
      setHighlightedIndex(-1)
      // Focus the input when the popover opens
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [open])

  // Handle outside clicks
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const getInputStyles = () => {
    switch (variant) {
      case "large":
        return "h-16 !text-5xl !overflow-x-visible font-semibold font-display"
      case "header":
        return "h-9 w-auto xl:w-48 text-sm"
      default:
        return "h-10"
    }
  }

  // Stop propagation to prevent popover closing
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    focusInput() // Focus input on container click
  }

  // Determine if an item should be visually highlighted
  const shouldHighlight = (groupId: string): boolean => {
    // We want to highlight during keyboard navigation even if search is empty
    const index = filteredGroups.findIndex(g => g.id === groupId);
    return index === highlightedIndex;
  }

  // Handle blur event on input
  const handleBlur = (e: React.FocusEvent) => {
    // Check if the new focus target is outside our component
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false)
    }
  }

  return (
    <>
    <div ref={containerRef} className="inline-flex flex-col" onBlur={handleBlur}>
      <div
        className="relative inline-block"
        onClick={handleClick}
      >
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onClick={(e) => {
            e.stopPropagation() 
            setOpen(true)
            // Focus after click
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus()
              }
            }, 0)
          }}
          className={cn(getInputStyles(), 
            searchQuery ? "-mr-1" : "",
            className)}
          autoFocus={open}
        />
        <span
          ref={measureRef}
          className={cn(
            "absolute flex items-center h-16 top-0 pr-1 border-b border-transparent whitespace-pre text-5xl pointer-events-none font-semibold font-display",
            variant === "large" ? "text-5xl" : "text-sm",
            searchQuery ? "opacity-100" : "opacity-50"
          )}
          aria-hidden="true"
        >
          {searchQuery || "minorities"}
        </span>
      </div>

      {/* Dropdown positioned in the flow of the document */}
      {open && (
        <Card 
          className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+1rem)] w-full p-3 z-50 max-h-[300px] overflow-y-auto font-sans"
          style={{ 
            width: variant === "large" ? "360px" : "100%",
            minWidth: "300px"
          }}
        >
          <Command 
            className="bg-transparent !border-none"
            shouldFilter={false}
            loop={true}
            value={searchQuery ? undefined : "__empty__"}
          >
            <CommandList 
              ref={itemsRef}
            >
              <CommandEmpty>No minorities found.</CommandEmpty>
              
              {/* LGBTQIA+ Groups */}
              {minorityGroups.filter(group => 
                group.category === 'lgbtqia+' && 
                (searchQuery === "" || 
                 group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 group.description.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length > 0 && (
                <CommandGroup heading="LGBTQIA+">
                  {minorityGroups
                    .filter(group => 
                      group.category === 'lgbtqia+' && 
                      (searchQuery === "" || 
                      group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      group.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((group, groupIndex) => {
                      const isSelected = value === group.id;
                      const isHighlighted = shouldHighlight(group.id);
                      
                      return (
                        <CommandItem
                          key={group.id}
                          value={group.id}
                          onSelect={() => handleSelect(group.id)}
                          className={cn(
                            "flex flex-col items-start gap-0",
                            isHighlighted && "bg-accent"
                          )}
                          disabled={false}
                          data-item
                        >
                          <div className="flex w-full items-center">
                            <div className="flex items-center flex-1">
                              <span className="flex-1">{group.name}</span>
                              {group.emoji && <span className="flex items-center justify-center mr-1 text-lg h-4">{group.emoji}</span>}
                            </div>
                            {isSelected && (
                              <Check
                                className={cn(
                                  "p-0.75 stroke-3 rounded-full bg-primary text-primary-foreground",
                                )}
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{group.description}</p>
                        </CommandItem>
                      )
                    })}
                </CommandGroup>
              )}
              
              {/* POC Groups */}
              {minorityGroups.filter(group => 
                group.category === 'poc' && 
                (searchQuery === "" || 
                 group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 group.description.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length > 0 && (
                <CommandGroup heading="People of Color">
                  {minorityGroups
                    .filter(group => 
                      group.category === 'poc' && 
                      (searchQuery === "" || 
                      group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      group.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((group) => {
                      const isSelected = value === group.id;
                      const isHighlighted = shouldHighlight(group.id);
                      
                      return (
                        <CommandItem
                          key={group.id}
                          value={group.id}
                          onSelect={() => handleSelect(group.id)}
                          className={cn(
                            "flex flex-col items-start",
                            isHighlighted && "bg-accent"
                          )}
                          disabled={false}
                          data-item
                        >
                          <div className="flex w-full items-center">
                            <div className="flex items-center flex-1">
                              <span className="flex-1">{group.name}</span>
                              {group.emoji && <span className="flex items-center justify-center mr-1 text-lg h-4">{group.emoji}</span>}
                            </div>
                            {isSelected && (
                              <Check
                                className={cn(
                                  "p-0.75 stroke-3 rounded-full bg-foreground text-background",
                                )}
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{group.description}</p>
                        </CommandItem>
                      )
                    })}
                </CommandGroup>
              )}
              
              {/* Disability Groups */}
              {minorityGroups.filter(group => 
                group.category === 'disability' && 
                (searchQuery === "" || 
                 group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 group.description.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length > 0 && (
                <CommandGroup heading="People with Disabilities">
                  {minorityGroups
                    .filter(group => 
                      group.category === 'disability' && 
                      (searchQuery === "" || 
                      group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      group.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((group) => {
                      const isSelected = value === group.id;
                      const isHighlighted = shouldHighlight(group.id);
                      
                      return (
                        <CommandItem
                          key={group.id}
                          value={group.id}
                          onSelect={() => handleSelect(group.id)}
                          className={cn(
                            "flex flex-col items-start",
                            isHighlighted && "bg-accent"
                          )}
                          disabled={false}
                          data-item
                        >
                          <div className="flex w-full items-center">
                            <div className="flex items-center flex-1">
                              <span className="flex-1">{group.name}</span>
                              {group.emoji && <span className="flex items-center justify-center mr-1 text-lg h-4">{group.emoji}</span>}
                            </div>
                            {isSelected && (
                              <Check
                                className={cn(
                                  "p-0.75 stroke-3 rounded-full bg-foreground text-background",
                                )}
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{group.description}</p>
                        </CommandItem>
                      )
                    })}
                </CommandGroup>
              )}
              
              {/* Other Minority Groups */}
              {minorityGroups.filter(group => 
                group.category === 'other' && 
                (searchQuery === "" || 
                 group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 group.description.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length > 0 && (
                <CommandGroup heading="Other Minority Groups">
                  {minorityGroups
                    .filter(group => 
                      group.category === 'other' && 
                      (searchQuery === "" || 
                      group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      group.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((group) => {
                      const isSelected = value === group.id;
                      const isHighlighted = shouldHighlight(group.id);
                      
                      return (
                        <CommandItem
                          key={group.id}
                          value={group.id}
                          onSelect={() => handleSelect(group.id)}
                          className={cn(
                            "flex flex-col items-start",
                            isHighlighted && "bg-accent"
                          )}
                          disabled={false}
                          data-item
                        >
                          <div className="flex w-full items-center">
                            <div className="flex items-center flex-1">
                              <span className="flex-1">{group.name}</span>
                              {group.emoji && <span className="flex items-center justify-center mr-1 text-lg h-4">{group.emoji}</span>}
                            </div>
                            {isSelected && (
                              <Check
                                className={cn(
                                  "p-0.75 stroke-3 rounded-full bg-foreground text-background",
                                )}
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{group.description}</p>
                        </CommandItem>
                      )
                    })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </Card>
      )}
    </div>
    {searchQuery && <span className="text-5xl font-head">&nbsp;people</span>}
    </>
  )
} 