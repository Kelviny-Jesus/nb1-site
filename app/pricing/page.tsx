"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useIntl, FormattedMessage } from "react-intl" // Importar hooks e componentes

export default function PricingPage() {
  const { formatMessage } = useIntl(); // Obter a função formatMessage
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "EUR" | "BRL">("USD");
  
  // Definir taxas de conversão
  const conversionRates = {
    USD: { USD: 1, EUR: 0.92, BRL: 5.05 },
    EUR: { USD: 1.09, EUR: 1, BRL: 5.50 },
    BRL: { USD: 0.20, EUR: 0.18, BRL: 1 }
  };
  
  // Função para converter preços
  const convertPrice = (priceUSD: number, targetCurrency: "USD" | "EUR" | "BRL"): number => {
    return Math.round(priceUSD * conversionRates.USD[targetCurrency]);
  };
  
  // Função para obter o símbolo da moeda
  const getCurrencySymbol = (currency: "USD" | "EUR" | "BRL"): string => {
    return formatMessage({ id: `currencySymbol${currency}` });
  };
  
  // Recursos para o plano gratuito
  const freeFeatures = [
    formatMessage({ id: "basicAiAutomation" }),
    formatMessage({ id: "limitedAutomatedTasks" }),
    formatMessage({ id: "communitySupport" }),
  ];
  
  // Recursos para os planos pagos
  const features = [
    formatMessage({ id: "advancedAiAutomation" }),
    formatMessage({ id: "unlimitedAutomatedTasks" }),
    formatMessage({ id: "prioritySupport" }),
    formatMessage({ id: "customWorkflows" })
  ];

  const plans = [
    {
      name: formatMessage({ id: "freePlan" }),
      price: 0,
      period: formatMessage({ id: "free" }),
      loginUrl: "/", // URL da página de login
      free: true,
    },
    {
      name: formatMessage({ id: "monthlyPlan" }),
      price: 60,
      period: formatMessage({ id: "month" }),
      stripeUrl: "https://buy.stripe.com/28og0i8wreXocdqaEE",
    },
    {
      name: formatMessage({ id: "annualPlan" }),
      price: 648,
      period: formatMessage({ id: "year" }),
      savings: 72,
      stripeUrl: "https://buy.stripe.com/3cs9BUdQLbLca5i7st",
      popular: true,
    },
  ];
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
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold">
            <FormattedMessage id="chooseYourPersonalPlan" />
          </h1>
          <p className="text-gray-400 text-lg">
            <FormattedMessage id="selectPlanThatWorks" />
          </p>
        </div>
        
        {/* Botões de seleção de moeda */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            variant={selectedCurrency === "USD" ? "default" : "outline"}
            className="flex items-center space-x-2"
            onClick={() => setSelectedCurrency("USD")}
          >
            <Image
              src="https://flagcdn.com/w20/us.png"
              alt="US Flag"
              width={20}
              height={15}
              className="rounded-sm"
            />
            <span>{formatMessage({ id: "currencyUSD" })}</span>
          </Button>
          
          <Button
            variant={selectedCurrency === "EUR" ? "default" : "outline"}
            className="flex items-center space-x-2"
            onClick={() => setSelectedCurrency("EUR")}
          >
            <Image
              src="https://flagcdn.com/w20/eu.png"
              alt="EU Flag"
              width={20}
              height={15}
              className="rounded-sm"
            />
            <span>{formatMessage({ id: "currencyEUR" })}</span>
          </Button>
          
          <Button
            variant={selectedCurrency === "BRL" ? "default" : "outline"}
            className="flex items-center space-x-2"
            onClick={() => setSelectedCurrency("BRL")}
          >
            <Image
              src="https://flagcdn.com/w20/br.png"
              alt="Brazil Flag"
              width={20}
              height={15}
              className="rounded-sm"
            />
            <span>{formatMessage({ id: "currencyBRL" })}</span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
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
                  <FormattedMessage id="bestValue" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-bold">
                      {getCurrencySymbol(selectedCurrency)}
                      {convertPrice(plan.price, selectedCurrency)}
                    </span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-green-400 text-sm">
                      <FormattedMessage 
                        id="saveWithAnnualBilling" 
                        values={{ 
                          amount: `${getCurrencySymbol(selectedCurrency)}${convertPrice(plan.savings, selectedCurrency)}` 
                        }}
                      />
                    </div>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.free
                    ? freeFeatures.map((feature) => (
                        <li key={feature} className="flex items-center space-x-3 text-gray-300">
                          <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))
                    : features.map((feature) => (
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
                  onClick={() => {
                    if (plan.free && plan.loginUrl) {
                      window.location.href = plan.loginUrl;
                    } else if (!plan.free && plan.stripeUrl) {
                      window.location.href = plan.stripeUrl;
                    }
                  }}
                >
                  {plan.free ? (
                    <FormattedMessage id="login" />
                  ) : (
                    <FormattedMessage id="getStarted" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
