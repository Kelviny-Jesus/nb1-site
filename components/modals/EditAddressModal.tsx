"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

interface EditAddressModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditAddressModal({ isOpen, onClose }: EditAddressModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    postal_code: "",
    country: "Brasil",
    state: "",
    city: "",
    street_address: "",
    address_number: "",
    address_complement: "",
  })

  const handlePostalCodeChange = async (postalCode: string) => {
    if (postalCode.length !== 8) return

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${postalCode}/json/`)
      if (response.data.erro) {
        toast({
          title: "Error",
          description: "Invalid postal code",
          variant: "destructive",
        })
      } else {
        setFormData((prev) => ({
          ...prev,
          state: response.data.uf,
          city: response.data.localidade,
          street_address: response.data.logradouro,
          postal_code: postalCode,
        }))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch address information",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem("session_token")
      if (!token) throw new Error("No session token found")

      const response = await fetch("https://n8n-webhooks.bluenacional.com/webhook/nb1/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update address")

      toast({
        title: "Success",
        description: "Address updated successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update address",
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
            <DialogTitle>Edit Address</DialogTitle>
            <Button variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400">Update your address information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              value={formData.postal_code}
              onChange={(e) => handlePostalCodeChange(e.target.value)}
              className="bg-[#131629] border-gray-800 text-white"
              placeholder="Enter postal code"
              maxLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street_address">Address</Label>
            <Input
              id="street_address"
              value={formData.street_address}
              onChange={(e) => setFormData((prev) => ({ ...prev, street_address: e.target.value }))}
              className="bg-[#131629] border-gray-800 text-white"
              placeholder="Enter address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address_number">Number</Label>
              <Input
                id="address_number"
                value={formData.address_number}
                onChange={(e) => setFormData((prev) => ({ ...prev, address_number: e.target.value }))}
                className="bg-[#131629] border-gray-800 text-white"
                placeholder="Enter number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_complement">Complement</Label>
              <Input
                id="address_complement"
                value={formData.address_complement}
                onChange={(e) => setFormData((prev) => ({ ...prev, address_complement: e.target.value }))}
                className="bg-[#131629] border-gray-800 text-white"
                placeholder="Enter complement"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} className="bg-[#131629] border-gray-800 text-white" readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={formData.state} className="bg-[#131629] border-gray-800 text-white" readOnly />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={formData.country} className="bg-[#131629] border-gray-800 text-white" readOnly />
          </div>

          <Button type="submit" className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

