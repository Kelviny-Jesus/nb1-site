"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useIntl, FormattedMessage } from "react-intl"; // Importar hooks e componentes
import Link from "next/link";

// Definir tipos para os planos
interface PlanPrices {
  USD: number;
  EUR: number;
  BRL: number;
}

interface PlanSavings {
  USD: number;
  EUR: number;
  BRL: number;
}

interface PlanStripeUrls {
  USD: string;
  EUR: string;
  BRL: string;
}

interface Plan {
  name: string;
  prices: PlanPrices;
  period: string;
  loginUrl?: string;
  free?: boolean;
  stripeUrls?: PlanStripeUrls;
  savings?: PlanSavings;
  popular?: boolean;
}

type CurrencyType = "USD" | "EUR" | "BRL";

export default function PricingPage() {
  const { formatMessage } = useIntl(); // Obter a função formatMessage
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>("USD");

  // Não precisamos mais das taxas de conversão e da função convertPrice
  // pois agora usamos preços específicos para cada moeda

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
    formatMessage({ id: "customWorkflows" }),
  ];

  // Função para verificar autenticação e redirecionar
  const handlePurchaseClick = (plan: Plan) => {
    // Verificar se o usuário está autenticado (token existe no localStorage)
    const token = localStorage.getItem("session_token");
    
    // Verificar se o usuário acabou de se registrar
    let justRegistered = false;
    const justRegisteredData = localStorage.getItem("just_registered");
    
    if (justRegisteredData) {
      try {
        const data = JSON.parse(justRegisteredData);
        // Verificar se o registro foi feito nos últimos 30 minutos
        const thirtyMinutesInMs = 30 * 60 * 1000;
        justRegistered = (Date.now() - data.timestamp) < thirtyMinutesInMs;
        
        // Limpar o token se expirou
        if (!justRegistered) {
          localStorage.removeItem("just_registered");
        }
      } catch (error) {
        // Em caso de erro ao processar o JSON, limpar o item
        localStorage.removeItem("just_registered");
      }
    }
    
    if (plan.free && plan.loginUrl) {
      // Para o plano gratuito, mantemos o comportamento atual
      window.location.href = plan.loginUrl;
    } else if (!plan.free && plan.stripeUrls) {
      if (token || justRegistered) {
        // Usuário autenticado OU recém-registrado, redirecionar para o Stripe
        
        // Se o usuário acabou de se registrar e está fazendo uma compra,
        // podemos limpar o token "just_registered" para que ele só possa
        // usar essa "passagem livre" uma vez
        if (justRegistered) {
          localStorage.removeItem("just_registered");
        }
        
        window.location.href = plan.stripeUrls[selectedCurrency];
      } else {
        // Usuário não autenticado e não recém-registrado, redirecionar para o login
        window.location.href = `/?redirect=pricing`;
      }
    }
  };

  const plans: Plan[] = [
    {
      name: formatMessage({ id: "freePlan" }),
      prices: {
        USD: 0,
        EUR: 0,
        BRL: 0,
      },
      period: formatMessage({ id: "free" }),
      loginUrl: "/", // URL da página de login
      free: true,
    },
    {
      name: formatMessage({ id: "monthlyPlan" }),
      prices: {
        USD: 15,
        EUR: 11,  // Preço específico em EUR
        BRL: 69,  // Preço específico em BRL
      },
      period: formatMessage({ id: "month" }),
      stripeUrls: {
        USD: "https://buy.stripe.com/28og0i8wreXocdqaEE",
        EUR: "https://buy.stripe.com/cN27tM7sn5mO7XabJ4", // Substitua pelo link real
        BRL: "https://buy.stripe.com/dR68xQeUP8z0ely00i",  // Substitua pelo link real
      },
    },
    {
      name: formatMessage({ id: "annualPlan" }),
      prices: {
        USD: 120,
        EUR: 100, // Preço específico em EUR
        BRL: 672, // Preço específico em BRL
      },
      savings: {
        USD: 60,
        EUR: 32, // Economia específica em EUR
        BRL: 156, // Economia específica em BRL
      },
      period: formatMessage({ id: "year" }),
      stripeUrls: {
        USD: "https://buy.stripe.com/3cs9BUdQLbLca5i7st",
        EUR: "https://buy.stripe.com/bIY15o6oj6qS6T614r", // Substitua pelo link real
        BRL: "https://buy.stripe.com/7sI15oeUPaH891e8wP",  // Substitua pelo link real
      },
      popular: true,
    },
  ];
  return (
    <main className="relative min-h-screen bg-[#0A0B14] text-white">
      {/* NB1 Logo */}
      <div className="absolute left-4 lg:left-8 top-4 hidden md:block">
        <Link href="/">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ICON-NUMBERONE-OFC-unscreen-2rlFGjCNaLYTMxnF8huXplEwcv1KGy.gif"
            alt="NB1 Logo"
            width={64}
            height={64}
            className="h-16 w-16 cursor-pointer"
            priority
          />
        </Link>
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
            variant ={selectedCurrency === "BRL" ? "default" : "outline"}
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
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "w-full max-w-sm bg-[#1A1D2E] border-gray-800 relative overflow-hidden transition-all duration-300 hover:border-gray-700 flex flex-col",
                plan.popular && "border-blue-500 hover:border-blue-400"
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
              <CardContent className="space-y-6 flex-grow">
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-bold">
                      {getCurrencySymbol(selectedCurrency)}
                      {plan.prices[selectedCurrency]}
                    </span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-green-400 text-sm">
                      <FormattedMessage
                        id="saveWithAnnualBilling"
                        values={{
                          amount: `${getCurrencySymbol(
                            selectedCurrency
                          )}${plan.savings[selectedCurrency]}`,
                        }}
                      />
                    </div>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.free
                    ? freeFeatures.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center space-x-3 text-gray-300"
                        >
                          <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))
                    : features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center space-x-3 text-gray-300"
                        >
                          <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={() => handlePurchaseClick(plan)}
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
  );
}
