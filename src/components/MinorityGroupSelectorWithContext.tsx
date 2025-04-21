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
import { MinorityGroupContext } from "@/app/layout"

interface MinorityGroupSelectorProps {
  className?: string
  variant?: "default" | "large" | "header"
}

export function MinorityGroupSelectorWithContext({ 
  className,
  variant = "default"
}: MinorityGroupSelectorProps) {
  const { selectedGroupId, setSelectedGroupId } = React.useContext(MinorityGroupContext);
  
  const [open, setOpen] = React.useState(false)
  const [closing, setClosing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)
  const itemsRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedGroup = minorityGroups.find((group) => group.id === selectedGroupId)

  // Initialize searchQuery with selected group name if there is one
  React.useEffect(() => {
    if (selectedGroupId) {
      const group = minorityGroups.find(g => g.id === selectedGroupId)
      if (group) {
        setSearchQuery(group.name)
      }
    }
  }, [selectedGroupId])

  // Get filtered groups for keyboard navigation
  const filteredGroups = React.useMemo(() => {
    return minorityGroups.filter(group => 
      searchQuery === "" || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Reset highlighted index and focus input when popover opens
  React.useEffect(() => {
    if (open) {
      // Set highlighted index to 0 when opening
      setHighlightedIndex(0);
      // Focus the input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [open]);

  // Manage close animation
  const handleCloseDropdown = () => {
    if (!open) return;
    setClosing(true);
    // Reset highlighted index when closing
    setHighlightedIndex(0);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 100); // Match animation duration from the CSS
  };

  const handleSelect = (currentValue: string) => {
    setSelectedGroupId(currentValue === selectedGroupId ? null : currentValue)
    handleCloseDropdown();
    
    // Set the search input to the selected group's name
    if (currentValue !== selectedGroupId && currentValue) {
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
      setSelectedGroupId(null)
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
        setOpen(true);
        setHighlightedIndex(0);
        e.preventDefault(); // Prevent default to avoid text cursor movement
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (filteredGroups.length > 0) {
          const nextIndex = highlightedIndex < filteredGroups.length - 1 ? highlightedIndex + 1 : 0;
          setHighlightedIndex(nextIndex);
          scrollToItem(nextIndex);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (filteredGroups.length > 0) {
          const nextIndex = highlightedIndex > 0 ? highlightedIndex - 1 : filteredGroups.length - 1;
          setHighlightedIndex(nextIndex);
          scrollToItem(nextIndex);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredGroups.length) {
          handleSelect(filteredGroups[highlightedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleCloseDropdown();
        // Keep focus on input after closing
        if (inputRef.current) {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }
        break;
      case 'Tab':
        handleCloseDropdown();
        break;
    }
  };

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
  
  // Handle outside clicks to close the dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (open || closing) &&
        dropdownRef.current && 
        inputRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleCloseDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, closing]);

  // Update dropdown position when window is resized or scrolled
  React.useEffect(() => {
    if (!open) return;

    const handlePositionUpdate = () => {
      // Force a re-render to update dropdown position
      forceUpdate();
    };

    window.addEventListener('resize', handlePositionUpdate);
    window.addEventListener('scroll', handlePositionUpdate);

    return () => {
      window.removeEventListener('resize', handlePositionUpdate);
      window.removeEventListener('scroll', handlePositionUpdate);
    };
  }, [open]);

  // Force update to recalculate dropdown position
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

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
    // Check if this is the highlighted item
    const index = filteredGroups.findIndex(g => g.id === groupId);
    return index === highlightedIndex;
  }

  return (
    <>
      <div className="inline-flex flex-col relative">
        <div 
          className="relative inline-block cursor-text" 
          onClick={(e) => {
            e.stopPropagation();
            if (inputRef.current) {
              inputRef.current.focus();
              setOpen(true);
            }
          }}
        >
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            className={cn(
              getInputStyles(), 
              searchQuery ? "-mr-1" : "",
              className
            )}
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
          
        {(open || closing) && (
          <div 
            ref={dropdownRef}
            className={cn(
              "fixed mt-2 z-50 -translate-x-1/2 duration-100 slide-in-from-top-2 slide-out-to-top-2",
              closing 
                ? "animate-out fade-out-0 zoom-out-95" 
                : "animate-in fade-in-0 zoom-in-95"
            )}
            style={{
              left: inputRef.current ? inputRef.current.getBoundingClientRect().left + inputRef.current.getBoundingClientRect().width / 2 : '50%',
              top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + window.scrollY + 5 : '0',
              width: variant === "large" ? "360px" : "300px",
              minWidth: "300px"
            }}
          >
            <Card className="p-0 w-full shadow-md rounded-md overflow-hidden">
              <Command 
                className="bg-transparent !border-none"
                shouldFilter={false}
                loop={false}
                value={highlightedIndex === -1 ? undefined : String(highlightedIndex)}
              >
                <CommandList 
                  ref={itemsRef} 
                  className="p-3 overflow-y-auto"
                  style={{ maxHeight: '300px' }}
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
                        .map((group, index) => {
                          const isSelected = selectedGroupId === group.id;
                          const isHighlighted = shouldHighlight(group.id);
                          
                          return (
                            <CommandItem
                              key={group.id}
                              value={String(index)}
                              onSelect={() => handleSelect(group.id)}
                              className={cn(
                                "flex flex-col items-start gap-0 data-[selected=false]:bg-transparent data-[selected=false]:border-transparent data-[selected=false]:shadow-none",
                                isHighlighted && "border-t-card border-l-card bg-accent shadow-md/5 scale-102"
                              )}
                              data-selected={isHighlighted}
                              data-item
                            >
                              <div className="flex w-full items-center">
                                <div className="flex items-center flex-1">
                                  <span className="flex-1">{group.name}</span>
                                  {group.emoji && <span className="flex items-center justify-center text-lg h-4">{group.emoji}</span>}
                                </div>
                                {isSelected && (
                                  <Check
                                    className={cn(
                                      "p-0.75 stroke-3 rounded-full bg-primary text-primary-foreground ml-1",
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
                          const isSelected = selectedGroupId === group.id;
                          const isHighlighted = shouldHighlight(group.id);
                          
                          return (
                            <CommandItem
                              key={group.id}
                              value={group.id}
                              onSelect={() => handleSelect(group.id)}
                              className={cn(
                                "flex flex-col items-start gap-0",
                                isHighlighted && "border-t-card border-l-card bg-accent shadow-md/5 scale-102",
                                () => {
                                  console.log('CommandItem className evaluation:', {
                                    groupId: group.id,
                                    isHighlighted,
                                    highlightedIndex,
                                    className: cn(
                                      "flex flex-col items-start gap-0",
                                      isHighlighted && "border-t-card border-l-card bg-accent shadow-md/5 scale-102"
                                    )
                                  });
                                  return '';
                                }
                              )}
                              data-item
                            >
                              <div className="flex w-full items-center">
                                <div className="flex items-center flex-1">
                                  <span className="flex-1">{group.name}</span>
                                  {group.emoji && <span className="flex items-center justify-center text-lg h-4">{group.emoji}</span>}
                                </div>
                                {isSelected && (
                                  <Check
                                    className={cn(
                                      "p-0.75 stroke-3 rounded-full bg-primary text-primary-foreground ml-1",
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
                          const isSelected = selectedGroupId === group.id;
                          const isHighlighted = shouldHighlight(group.id);
                          
                          return (
                            <CommandItem
                              key={group.id}
                              value={group.id}
                              onSelect={() => handleSelect(group.id)}
                              className={cn(
                                "flex flex-col items-start gap-0",
                                isHighlighted && "border-t-card border-l-card bg-accent shadow-md/5 scale-102",
                                () => {
                                  console.log('CommandItem className evaluation:', {
                                    groupId: group.id,
                                    isHighlighted,
                                    highlightedIndex,
                                    className: cn(
                                      "flex flex-col items-start gap-0",
                                      isHighlighted && "border-t-card border-l-card bg-accent shadow-md/5 scale-102"
                                    )
                                  });
                                  return '';
                                }
                              )}
                              data-item
                            >
                              <div className="flex w-full items-center">
                                <div className="flex items-center flex-1">
                                  <span className="flex-1">{group.name}</span>
                                  {group.emoji && <span className="flex items-center justify-center text-lg h-4">{group.emoji}</span>}
                                </div>
                                {isSelected && (
                                  <Check
                                    className={cn(
                                      "p-0.75 stroke-3 rounded-full bg-primary text-primary-foreground ml-1",
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
                          const isSelected = selectedGroupId === group.id;
                          const isHighlighted = shouldHighlight(group.id);
                          
                          return (
                            <CommandItem
                              key={group.id}
                              value={group.id}
                              onSelect={() => handleSelect(group.id)}
                              className={cn(
                                "flex flex-col items-start gap-0",
                                isHighlighted && "border-t-card border-l-card bg-accent shadow-md/5 scale-102",
                                () => {
                                  console.log('CommandItem className evaluation:', {
                                    groupId: group.id,
                                    isHighlighted,
                                    highlightedIndex,
                                    className: cn(
                                      "flex flex-col items-start gap-0",
                                      isHighlighted && "border-t-card border-l-card bg-accent shadow-md/5 scale-102"
                                    )
                                  });
                                  return '';
                                }
                              )}
                              data-item
                            >
                              <div className="flex w-full items-center">
                                <div className="flex items-center flex-1">
                                  <span className="flex-1">{group.name}</span>
                                  {group.emoji && <span className="flex items-center justify-center text-lg h-4">{group.emoji}</span>}
                                </div>
                                {isSelected && (
                                  <Check
                                    className={cn(
                                      "p-0.75 stroke-3 rounded-full bg-primary text-primary-foreground ml-1",
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
          </div>
        )}
      </div>
      {searchQuery && <span className="text-5xl font-head">&nbsp;people</span>}
    </>
  )
} 