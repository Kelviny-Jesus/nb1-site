"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface FinancialData {
  billing_email: string
  preferred_currency: string
}

const defaultFinancialData: FinancialData = {
  billing_email: "",
  preferred_currency: "BRL",
}

const API_ENDPOINT = "https://n8n-webhooks.bluenacional.com/webhook/nb1/api/user/financial"

export default function FinancialTab() {
  const [financialData, setFinancialData] = useState<FinancialData>(defaultFinancialData)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [tempData, setTempData] = useState<FinancialData>(defaultFinancialData)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setIsLoading(true)

        // Get user email from stored data
        const storedUserData = localStorage.getItem("userData")
        const userData = storedUserData ? JSON.parse(storedUserData) : null
        const userEmail = userData?.email || ""

        // Get stored financial data or use defaults
        const storedData = localStorage.getItem("financialData")
        const parsedData = storedData ? JSON.parse(storedData) : {}

        // Set the data with user email
        const mergedData = {
          ...defaultFinancialData,
          ...parsedData,
          billing_email: userEmail,
        }

        setFinancialData(mergedData)
        setTempData(mergedData)
        localStorage.setItem("financialData", JSON.stringify(mergedData))
      } catch (error) {
        console.error("Error loading financial data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFinancialData()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setTempData(financialData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTempData(financialData)
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("session_token")
      if (!token) {
        router.push("/")
        return
      }

      const response = await fetch(API_ENDPOINT, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update billing preferences: ${errorText}`)
      }

      setFinancialData(tempData)
      localStorage.setItem("financialData", JSON.stringify(tempData))
      setIsEditing(false)

      toast({
        title: "Success",
        description: "Billing preferences have been updated.",
      })
    } catch (error) {
      console.error("Failed to update billing preferences:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update billing preferences. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white">Loading billing information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="bg-[#1A1D2E] border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-white">Billing Information</CardTitle>
            <CardDescription>Manage your billing details and preferences</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={handleEdit} className="text-white">
              Edit Preferences
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} className="text-white">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Billing Email</Label>
            <Input
              type="email"
              value={tempData.billing_email}
              className="bg-[#131629] border-gray-800 text-white"
              placeholder="Enter billing email"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-400">Preferred Currency</Label>
            <Select
              value={tempData.preferred_currency}
              onValueChange={(value) => setTempData((prev) => ({ ...prev, preferred_currency: value }))}
              disabled={!isEditing}
            >
              <SelectTrigger className="bg-[#131629] border-gray-800 text-white">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">BRL - Brazilian Real</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

