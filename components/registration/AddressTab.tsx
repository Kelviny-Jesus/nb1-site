"use client"

import { useFormContext } from "react-hook-form"
import { useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useIntl } from "react-intl"
import { debounce } from "lodash"
import type React from "react" // Added import for React

export default function AddressTab() {
  const { formatMessage: t } = useIntl()
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()
  const [addressError, setAddressError] = useState<string | null>(null)

  const lookupAddress = async (postalCode: string) => {
    if (postalCode.length !== 8) return

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${postalCode}/json/`)
      if (response.data.erro) {
        setAddressError(t({ id: "invalidPostalCode" }))
      } else {
        setValue("country", "Brazil")
        setValue("state", response.data.uf)
        setValue("city", response.data.localidade)
        setValue("address", response.data.logradouro)
        setAddressError(null)
      }
    } catch (error) {
      setAddressError(t({ id: "addressLookupError" }))
    }
  }

  // Debounce the lookup function to avoid too many requests
  const debouncedLookup = debounce(lookupAddress, 500)

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    if (value.length === 8) {
      debouncedLookup(value)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="postalCode">{t({ id: "postalCode" })}</Label>
        <Input
          id="postalCode"
          {...register("postalCode")}
          onChange={handlePostalCodeChange}
          maxLength={8}
          className="bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
        />
        {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode.message as string}</p>}
      </div>
      {addressError && (
        <Alert variant="destructive">
          <AlertDescription>{addressError}</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="country">{t({ id: "country" })}</Label>
        <Input
          id="country"
          {...register("country")}
          className="bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          readOnly
        />
        {errors.country && <p className="text-red-500 text-sm">{errors.country.message as string}</p>}
      </div>
      <div>
        <Label htmlFor="state">{t({ id: "state" })}</Label>
        <Input
          id="state"
          {...register("state")}
          className="bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          readOnly
        />
        {errors.state && <p className="text-red-500 text-sm">{errors.state.message as string}</p>}
      </div>
      <div>
        <Label htmlFor="city">{t({ id: "city" })}</Label>
        <Input
          id="city"
          {...register("city")}
          className="bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          readOnly
        />
        {errors.city && <p className="text-red-500 text-sm">{errors.city.message as string}</p>}
      </div>
      <div>
        <Label htmlFor="address">{t({ id: "address" })}</Label>
        <Input
          id="address"
          {...register("address")}
          className="bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          readOnly
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message as string}</p>}
      </div>
      <div>
        <Label htmlFor="number">{t({ id: "number" })}</Label>
        <Input
          id="number"
          {...register("number")}
          className="bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
        />
        {errors.number && <p className="text-red-500 text-sm">{errors.number.message as string}</p>}
      </div>
      <div>
        <Label htmlFor="complement">{t({ id: "complement" })}</Label>
        <Input
          id="complement"
          {...register("complement")}
          className="bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
        />
        {errors.complement && <p className="text-red-500 text-sm">{errors.complement.message as string}</p>}
      </div>
    </div>
  )
}

