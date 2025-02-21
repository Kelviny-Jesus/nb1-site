"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import PhoneInput from "@/components/PhoneInput"

interface EditBasicInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditBasicInfoModal({ isOpen, onClose }: EditBasicInfoModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    phone: "",
    birth_date: "",
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

      if (!response.ok) throw new Error("Failed to update information")

      toast({
        title: "Success",
        description: "Basic information updated successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update information",
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
            <DialogTitle>Edit Basic Information</DialogTitle>
            <Button variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400">Update your personal information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <PhoneInput
              value={formData.phone}
              onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
              country="br"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date">Birth Date</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, birth_date: e.target.value }))}
              className="bg-[#131629] border-gray-800 text-white"
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

