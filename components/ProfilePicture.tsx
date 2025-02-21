"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserCircle, Camera } from "lucide-react"
import Image from "next/image"

interface ProfilePictureProps {
  currentImageUrl?: string
  onImageUpdate: (imageUrl: string) => Promise<void>
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: "h-10 w-10",
  md: "h-20 w-20",
  lg: "h-32 w-32",
}

export default function ProfilePicture({ currentImageUrl, onImageUpdate, size = "md" }: ProfilePictureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("File must be an image")
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("https://n8n-blue.up.railway.app/webhook/nb1/api/user/data", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("session_token")}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      await onImageUpdate(data.imageUrl)
      setIsOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <div className="relative group">
        <div className={`${sizes[size]} relative rounded-full overflow-hidden bg-gray-800`}>
          {currentImageUrl ? (
            <Image src={currentImageUrl || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
          ) : (
            <UserCircle className="w-full h-full text-gray-400" />
          )}
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className="w-6 h-6 text-white" />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#1A1D2E] border-gray-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-32 w-32 relative rounded-full overflow-hidden bg-gray-800">
                {currentImageUrl ? (
                  <Image src={currentImageUrl || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                ) : (
                  <UserCircle className="w-full h-full text-gray-400" />
                )}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="flex justify-center">
              <Button variant="outline" className="relative" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Choose Image"}
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  accept="image/*"
                  disabled={isUploading}
                />
              </Button>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

