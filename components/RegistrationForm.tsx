"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import BasicInfoTab from "./registration/BasicInfoTab"
import AddressTab from "./registration/AddressTab"
import CulturalTab from "./registration/CulturalTab"
import ProgressBar from "./ProgressBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { IntlProvider } from "react-intl"
import en from "@/locales/en.json"
import es from "@/locales/es.json"
import pt from "@/locales/pt.json"
import { useIntl } from "react-intl"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const schema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      ),
    confirmPassword: z.string(),
    dateOfBirth: z.string(),
    gender: z.string(),
    language: z.string(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    number: z.string().optional(),
    hobbies: z.array(z.string()).optional(),
    favoriteMovieGenres: z.array(z.string()).optional(),
    favoriteSeriesGenres: z.array(z.string()).optional(),
    preferred_currency: z.string().min(1, "Preferred currency is required"),
    address_complement: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof schema>

const steps = ["Basic", "Address", "Cultural"]

const messages = { en, es, pt }

export default function RegistrationForm() {
  const { formatMessage } = useIntl()
  const [step, setStep] = useState(0)
  const [language, setLanguage] = useState("en")
  const [error, setError] = useState<string | null>(null)
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      language: "en",
      hobbies: [],
      favoriteMovieGenres: [],
      favoriteSeriesGenres: [],
    },
  })

  const {
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = methods

  const router = useRouter()
  const { toast } = useToast() // Correctly destructure the toast function

  const onSubmit = async (data: FormData) => {
    if (step < steps.length - 1) {
      const isStepValid = await trigger()
      if (isStepValid) {
        setStep(step + 1)
      }
    } else {
      try {
        const payload = {
          ...data,
          address_complement: data.address_complement || "",
        }
        const response = await fetch("https://n8n-blue.up.railway.app/webhook/nb1/api/user/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        const responseData = await response.json()

        if (responseData.status === true) {
          // Success case
          toast({
            title: "Registration Successful",
            description: responseData.msg,
            variant: "default",
          })
          // Redirect to pricing page
          router.push("/pricing")
        } else {
          // Error case - email already exists
          toast({
            title: "Registration Failed",
            description: (
              <div className="space-y-2">
                <p>{responseData.msg}</p>
                <Button variant="link" className="p-0 text-white hover:text-blue-300" onClick={() => router.push("/")}>
                  Click here to login
                </Button>
              </div>
            ),
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Registration error:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    methods.setValue("language", newLanguage)
  }

  useEffect(() => {
    const subscription = methods.watch((value, { name, type }) => {
      if (name === "language") {
        setLanguage(value.language)
      }
    })
    return () => subscription.unsubscribe()
  }, [methods.watch])

  const t = formatMessage

  // Wrap the entire form with IntlProvider to enable translations throughout all tabs
  return (
    <IntlProvider messages={messages[language]} locale={language} defaultLocale="en">
      <Card className="border-none bg-transparent">
        <CardContent className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <ProgressBar steps={steps} currentStep={step} />

              <div className="mt-8">
                {step === 0 && <BasicInfoTab onLanguageChange={handleLanguageChange} />}
                {step === 1 && <AddressTab />}
                {step === 2 && <CulturalTab />}
              </div>

              <div className="flex justify-between pt-8">
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
                  {t({ id: "previous" })}
                </Button>
                <Button type="submit" disabled={!isValid}>
                  {step === steps.length - 1 ? t({ id: "submit" }) : t({ id: "next" })}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </IntlProvider>
  )
}

