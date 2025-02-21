"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const features = ["Advanced AI automation", "Unlimited automated tasks", "Priority support", "Custom workflows"]

const plans = [
  {
    name: "Monthly Plan",
    price: 60,
    period: "month",
    stripeUrl: "https://buy.stripe.com/28og0i8wreXocdqaEE",
  },
  {
    name: "Annual Plan",
    price: 648,
    period: "year",
    savings: 72,
    stripeUrl: "https://buy.stripe.com/3cs9BUdQLbLca5i7st",
    popular: true,
  },
]

export default function PricingPage() {
  return (
    <main className="relative min-h-screen bg-[#0A0B14] text-white">
      {/* NB1 Logo */}
      <div className="absolute top-8 left-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ICON-NUMBERONE-OFC-unscreen-2rlFGjCNaLYTMxnF8huXplEwcv1KGy.gif"
          alt="NB1 Logo"
          width={48}
          height={48}
          className="h-12 w-12"
        />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-bold">Choose Your Personal Plan</h1>
          <p className="text-gray-400 text-lg">Select a plan that works best for you</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "w-full max-w-sm bg-[#1A1D2E] border-gray-800 relative overflow-hidden transition-all duration-300 hover:border-gray-700",
                plan.popular && "border-blue-500 hover:border-blue-400",
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Best Value
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-green-400 text-sm">Save ${plan.savings} with annual billing</div>
                  )}
                </div>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3 text-gray-300">
                      <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={() => (window.location.href = plan.stripeUrl)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

