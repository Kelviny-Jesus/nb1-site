"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FormattedMessage } from "react-intl";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Mail, 
  ChevronsUpDown, 
  Info, 
  ExternalLink, 
  ShoppingCart, 
  PuzzleIcon,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface FinancialData {
  billing_email: string;
  preferred_currency: string;
}

const defaultFinancialData: FinancialData = {
  billing_email: "",
  preferred_currency: "BRL",
};

const API_ENDPOINT = "https://n8n-webhooks.bluenacional.com/webhook/nb1/api/user/financial";

export default function FinancialTab() {
  const [financialData, setFinancialData] = useState<FinancialData>(defaultFinancialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<FinancialData>(defaultFinancialData);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setIsLoading(true);

        // Get user email from stored data
        const storedUserData = localStorage.getItem("userData");
        const userData = storedUserData ? JSON.parse(storedUserData) : null;
        const userEmail = userData?.email || "";

        // Get stored financial data or use defaults
        const storedData = localStorage.getItem("financialData");
        const parsedData = storedData ? JSON.parse(storedData) : {};

        // Set the data with user email
        const mergedData = {
          ...defaultFinancialData,
          ...parsedData,
          billing_email: userEmail,
        };

        setFinancialData(mergedData);
        setTempData(mergedData);
        localStorage.setItem("financialData", JSON.stringify(mergedData));
      } catch (error) {
        console.error("Error loading financial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
    setTempData(financialData);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("session_token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(API_ENDPOINT, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update billing preferences: ${errorText}`);
      }

      setFinancialData(tempData);
      localStorage.setItem("financialData", JSON.stringify(tempData));
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Billing preferences have been updated.",
      });
    } catch (error) {
      console.error("Failed to update billing preferences:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update billing preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoToPayments = () => {
    router.push("/pricing"); // Redireciona para a rota correta: /pricing
  };

  const handleManageSubscription = () => {
    console.log("Attempting to redirect to:", "https://billing.stripe.com/p/login/cN25lM9QbecH6WIeUU");
    window.location.href = "https://billing.stripe.com/p/login/cN25lM9QbecH6WIeUU";
  };

  const handleGoToExtension = () => {
    window.location.href = "https://chromewebstore.google.com/detail/number-one-nb1/oioolidaomkmlmepijkenklgphfkadin?hl=pt-BR&utm_source=ext_sidebar"; // Redireciona para a Google Web Store
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white"><FormattedMessage id="loadingBillingInfo" /></p>
        </div>
      </div>
    );
  }

  // Dados fictícios para o exemplo de assinatura
  const subscriptionData = {
    plan: "Premium",
    status: "active",
    nextPayment: "2025-06-01",
    amount: tempData.preferred_currency === "BRL" ? "R$ 49,90" : 
            tempData.preferred_currency === "USD" ? "$ 9.99" : "€ 9.99",
    period: "monthly"
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Cabeçalho com resumo */}
      <div className="bg-gradient-to-r from-[#1A1D2E] to-[#252A44] p-6 rounded-lg shadow-lg border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-500/20 p-3 rounded-full mr-4">
              <CreditCard className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white"><FormattedMessage id="billingInformation" /></h2>
              <p className="text-gray-400"><FormattedMessage id="manageBillingDetails" /></p>
            </div>
          </div>
          <div className="flex items-center">
            <Badge className="bg-green-500/20 text-green-400 px-3 py-1 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              <span><FormattedMessage id="active" /></span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de Informações de Faturamento */}
        <Card className="bg-gradient-to-b from-[#1A1D2E] to-[#131629] border-gray-800 rounded-lg shadow-lg overflow-hidden hover:border-gray-700 transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg text-white"><FormattedMessage id="billingInformation" /></CardTitle>
            </div>
            <CardDescription><FormattedMessage id="manageBillingDetails" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-400 flex items-center">
                <FormattedMessage id="billingEmail" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 ml-1 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-white">
                      <p><FormattedMessage id="emailBillingTooltip" /></p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  value={tempData.billing_email}
                  className="bg-[#131629] border-gray-800 text-white pl-10"
                  placeholder="Enter billing email"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-400 flex items-center">
                <FormattedMessage id="preferredCurrency" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 ml-1 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-white">
                      <p><FormattedMessage id="currencyTooltip" /></p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <Select
                  value={tempData.preferred_currency}
                  onValueChange={(value) => setTempData((prev) => ({ ...prev, preferred_currency: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="bg-[#131629] border-gray-800 text-white pl-10">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <SelectValue placeholder={<FormattedMessage id="selectCurrency" />} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1D2E] border-gray-800">
                    <SelectItem value="BRL"><FormattedMessage id="brazilianReal" /></SelectItem>
                    <SelectItem value="USD"><FormattedMessage id="usDollar" /></SelectItem>
                    <SelectItem value="EUR"><FormattedMessage id="euro" /></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`w-full ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {isEditing ? <FormattedMessage id="saveChanges" /> : <FormattedMessage id="editInformation" />}
            </Button>
            {isEditing && (
              <Button
                variant="outline"
                onClick={handleCancel}
                className="ml-2 text-white border-white hover:bg-gray-700"
              >
                <FormattedMessage id="cancel" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Card de Assinatura Atual */}
        <Card className="bg-gradient-to-b from-[#1A1D2E] to-[#131629] border-gray-800 rounded-lg shadow-lg overflow-hidden hover:border-gray-700 transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg text-white"><FormattedMessage id="currentSubscription" /></CardTitle>
            </div>
            <CardDescription><FormattedMessage id="subscriptionDetails" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#131629] p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400"><FormattedMessage id="plan" />:</span>
                <span className="text-white font-medium">{subscriptionData.plan}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400"><FormattedMessage id="status" />:</span>
                <Badge className="bg-green-500/20 text-green-400"><FormattedMessage id="active" /></Badge>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400"><FormattedMessage id="nextPayment" />:</span>
                <span className="text-white">{new Date(subscriptionData.nextPayment).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400"><FormattedMessage id="amount" />:</span>
                <span className="text-white font-bold">{subscriptionData.amount}/{subscriptionData.period}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="default"
              onClick={handleManageSubscription}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
            >
              <FormattedMessage id="updateManageSubscription" />
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Card de Ações Rápidas */}
        <Card className="bg-gradient-to-b from-[#1A1D2E] to-[#131629] border-gray-800 rounded-lg shadow-lg overflow-hidden hover:border-gray-700 transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-amber-400" />
              <CardTitle className="text-lg text-white"><FormattedMessage id="quickActions" /></CardTitle>
            </div>
            <CardDescription><FormattedMessage id="quickAccessResources" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={handleGoToPayments}
                className="text-white border-gray-700 bg-[#131629] hover:bg-gray-700 w-full h-14 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                    <ShoppingCart className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium"><FormattedMessage id="goToPayments" /></p>
                    <p className="text-xs text-gray-400"><FormattedMessage id="viewPlansOptions" /></p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
              </Button>
              
              <Button
                variant="outline"
                onClick={handleGoToExtension}
                className="text-white border-gray-700 bg-[#131629] hover:bg-gray-700 w-full h-14 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <div className="bg-green-500/20 p-2 rounded-full mr-3">
                    <PuzzleIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium"><FormattedMessage id="goToExtension" /></p>
                    <p className="text-xs text-gray-400"><FormattedMessage id="accessChromeExtension" /></p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
