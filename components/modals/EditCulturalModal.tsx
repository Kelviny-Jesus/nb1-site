"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EditCulturalModalProps {
  isOpen: boolean
  onClose: () => void
}

const hobbies = [
  "reading",
  "writing",
  "painting",
  "drawing",
  "photography",
  "cooking",
  "traveling",
  "gaming",
  "music",
  "sports",
]

const movieGenres = [
  "action",
  "adventure",
  "comedy",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "sci-fi",
  "thriller",
]

const seriesGenres = [
  "action",
  "adventure",
  "comedy",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "sci-fi",
  "thriller",
]

interface MultiSelectProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
  label: string
}

function MultiSelect({ options, value, onChange, placeholder, label }: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-[#131629] border-gray-800 text-white"
        >
          <div className="flex flex-wrap gap-1 max-w-[90%]">
            {value.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              value.map((item) => (
                <Badge key={item} className="bg-[#1E2A4A] text-white">
                  {item}
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-[#1A1D2E] border-gray-800">
        <Command className="bg-transparent">
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="text-white" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[200px]">
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])
                    }}
                    className="text-white hover:bg-[#1E2A4A]"
                  >
                    <Check className={cn("mr-2 h-4 w-4", value.includes(option) ? "opacity-100" : "opacity-0")} />
                    {option}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function EditCulturalModal({ isOpen, onClose }: EditCulturalModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    hobbies: [] as string[],
    favorite_movie_styles: [] as string[],
    favorite_series_styles: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem("session_token")
      if (!token) throw new Error("No session token found")

      const response = await fetch("https://n8n-blue.up.railway.app/webhook/nb1/api/user/data", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update preferences")

      toast({
        title: "Success",
        description: "Cultural preferences updated successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1D2E] border-gray-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Cultural Preferences</DialogTitle>
            <Button variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400">Update your interests and preferences</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Hobbies</Label>
            <MultiSelect
              options={hobbies}
              value={formData.hobbies}
              onChange={(value) => setFormData((prev) => ({ ...prev, hobbies: value }))}
              placeholder="Select hobbies"
              label="Hobbies"
            />
          </div>

          <div className="space-y-2">
            <Label>Favorite Movie Styles</Label>
            <MultiSelect
              options={movieGenres}
              value={formData.favorite_movie_styles}
              onChange={(value) => setFormData((prev) => ({ ...prev, favorite_movie_styles: value }))}
              placeholder="Select movie genres"
              label="Movie Genres"
            />
          </div>

          <div className="space-y-2">
            <Label>Favorite Series Styles</Label>
            <MultiSelect
              options={seriesGenres}
              value={formData.favorite_series_styles}
              onChange={(value) => setFormData((prev) => ({ ...prev, favorite_series_styles: value }))}
              placeholder="Select series genres"
              label="Series Genres"
            />
          </div>

          <Button type="submit" className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

