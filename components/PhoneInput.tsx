"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  country: string
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, country }) => {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const formatPhoneNumber = (input: string, country: string) => {
    const digits = input.replace(/\D/g, "")

    if (country === "br") {
      if (digits.length <= 2) return digits
      if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
    } else {
      if (digits.length <= 3) return digits
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, country)
    setInputValue(formatted)
    onChange(formatted)
  }

  return (
    <Input
      type="tel"
      value={inputValue}
      onChange={handleChange}
      className="flex-1 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
      placeholder="Enter your phone number"
    />
  )
}

export default PhoneInput

