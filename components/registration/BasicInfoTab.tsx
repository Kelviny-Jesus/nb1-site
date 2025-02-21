"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIntl } from "react-intl"
import dynamic from "next/dynamic"

const PhoneInput = dynamic(() => import("../PhoneInput"), { ssr: false })

interface BasicInfoTabProps {
  onLanguageChange: (language: string) => void
}

const countryCodes = [
  { value: "br", label: "BR", code: "+55" },
  { value: "us", label: "US", code: "+1" },
  { value: "es", label: "ES", code: "+34" },
]

export default function BasicInfoTab({ onLanguageChange }: BasicInfoTabProps) {
  const { formatMessage } = useIntl()
  const {
    register,
    formState: { errors },
    watch,
    control,
    trigger,
  } = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-gray-200">{formatMessage({ id: "fullName" })}</Label>
        <Input
          {...register("fullName")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          placeholder={formatMessage({ id: "enterFullName" })}
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message as string}</p>}
      </div>

      <div>
        <Label className="text-gray-200">{formatMessage({ id: "email" })}</Label>
        <Input
          type="email"
          {...register("email")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          placeholder={formatMessage({ id: "enterEmail" })}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message as string}</p>}
      </div>

      <div>
        <Label className="text-gray-200">{formatMessage({ id: "phone" })}</Label>
        <div className="mt-2 flex gap-2">
          <Controller
            name="phoneCountry"
            control={control}
            defaultValue="br"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[140px] bg-[#1a1f36] border-gray-700 text-white">
                  <SelectValue>
                    {field.value
                      ? `${countryCodes.find((c) => c.value === field.value)?.label} (${
                          countryCodes.find((c) => c.value === field.value)?.code
                        })`
                      : formatMessage({ id: "select" })}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <PhoneInput value={field.value} onChange={field.onChange} country={watch("phoneCountry")} />
            )}
          />
        </div>
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message as string}</p>}
      </div>

      <div>
        <Label className="text-gray-200">{formatMessage({ id: "password" })}</Label>
        <Input
          type="password"
          {...register("password")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          placeholder={formatMessage({ id: "enterPassword" })}
          onBlur={() => trigger("password")}
        />
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message as string}</p>}
      </div>

      <div>
        <Label className="text-gray-200">{formatMessage({ id: "confirmPassword" })}</Label>
        <Input
          type="password"
          {...register("confirmPassword")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          placeholder={formatMessage({ id: "confirmYourPassword" })}
          onBlur={() => trigger("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message as string}</p>
        )}
      </div>

      <div>
        <Label className="text-gray-200">{formatMessage({ id: "dateOfBirth" })}</Label>
        <Input
          type="date"
          {...register("dateOfBirth")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
          placeholder="dd/mm/aaaa"
        />
        {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth.message as string}</p>}
      </div>

      <div>
        <Label className="text-gray-200">{formatMessage({ id: "gender" })}</Label>
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="mt-2 bg-[#1a1f36] border-gray-700 text-white">
                <SelectValue placeholder={formatMessage({ id: "selectGender" })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{formatMessage({ id: "male" })}</SelectItem>
                <SelectItem value="female">{formatMessage({ id: "female" })}</SelectItem>
                <SelectItem value="other">{formatMessage({ id: "other" })}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender.message as string}</p>}
      </div>

      <div>
        <Label className="text-gray-200">{formatMessage({ id: "language" })}</Label>
        <Controller
          name="language"
          control={control}
          defaultValue="en"
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                onLanguageChange(value)
              }}
              value={field.value}
            >
              <SelectTrigger className="mt-2 bg-[#1a1f36] border-gray-700 text-white">
                <SelectValue placeholder={formatMessage({ id: "selectLanguage" })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{formatMessage({ id: "english" })}</SelectItem>
                <SelectItem value="es">{formatMessage({ id: "spanish" })}</SelectItem>
                <SelectItem value="pt">{formatMessage({ id: "portuguese" })}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.language && <p className="mt-1 text-sm text-red-500">{errors.language.message as string}</p>}
      </div>
      <div>
        <Label className="text-gray-200">{formatMessage({ id: "preferredCurrency" })}</Label>
        <Controller
          name="preferred_currency"
          control={control}
          defaultValue="BRL"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="mt-2 bg-[#1a1f36] border-gray-700 text-white">
                <SelectValue placeholder={formatMessage({ id: "selectCurrency" })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">BRL - Brazilian Real</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.preferred_currency && (
          <p className="mt-1 text-sm text-red-500">{errors.preferred_currency.message as string}</p>
        )}
      </div>
    </div>
  )
}

