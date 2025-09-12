"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"

export function VideoFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])

  const categories = [
    "Technology",
    "Education",
    "Entertainment",
    "Music",
    "Sports",
    "Gaming",
    "Cooking",
    "Travel",
    "Science",
    "Art & Design",
  ]

  const durations = ["Under 5 minutes", "5-20 minutes", "20-60 minutes", "Over 1 hour"]

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleDurationChange = (duration: string, checked: boolean) => {
    if (checked) {
      setSelectedDurations([...selectedDurations, duration])
    } else {
      setSelectedDurations(selectedDurations.filter((d) => d !== duration))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedDurations([])
  }

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {(selectedCategories.length > 0 || selectedDurations.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-3 font-medium">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 font-medium">Duration</h3>
          <div className="space-y-2">
            {durations.map((duration) => (
              <div key={duration} className="flex items-center space-x-2">
                <Checkbox
                  id={duration}
                  checked={selectedDurations.includes(duration)}
                  onCheckedChange={(checked) => handleDurationChange(duration, checked as boolean)}
                />
                <Label htmlFor={duration} className="text-sm font-normal cursor-pointer">
                  {duration}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
