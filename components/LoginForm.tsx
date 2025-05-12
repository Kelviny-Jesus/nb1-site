"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import ResetPasswordModal from "@/components/modals/ResetPasswordModal";
import { useIntl as useClientIntl } from "@/app/ClientIntlProvider";
import { FormattedMessage, useIntl } from "react-intl";

interface UserData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  preferred_currency: string;
  preferred_language: string;
  postal_code: string;
  country: string;
  state: string;
  city: string;
  street_address: string;
  address_number: string;
  address_complement: string;
  hobbies: string[];
  favorite_movie_styles: string[];
  favorite_series_styles: string[];
  plan_status: string;
  user_status: string;
  session_token?: string;
}

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { locale, setLocale } = useClientIntl();
  const { formatMessage } = useIntl();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Starting login process...");

      const response = await fetch(
        "https://n8n-blue.up.railway.app/webhook/nb1/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      console.log("Login response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(formatMessage({ id: "invalidCredentials" }));
        } else {
          const errorText = await response.text();
          console.error("Login error response:", {
            status: response.status,
            statusText: response.statusText,
            errorText,
          });
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
      }

      const responseData = await response.json();
      console.log("Login response data:", {
        ...responseData,
        session_token: responseData.session_token ? "exists" : "missing",
      });

      if (!responseData || !responseData.id || !responseData.email) {
        console.error("Invalid response format:", responseData);
        throw new Error("Invalid response format: missing required user data");
      }

      const userData: UserData = {
        id: responseData.id,
        full_name: responseData.full_name || "",
        email: responseData.email,
        phone: responseData.phone || "",
        birth_date: responseData.birth_date || "",
        gender: responseData.gender || "",
        preferred_currency: responseData.preferred_currency || "",
        preferred_language: responseData.preferred_language || "",
        postal_code: responseData.postal_code || "",
        country: responseData.country || "",
        state: responseData.state || "",
        city: responseData.city || "",
        street_address: responseData.street_address || "",
        address_number: responseData.address_number || "",
        address_complement: responseData.address_complement || "",
        hobbies: responseData.hobbies || [],
        favorite_movie_styles: responseData.favorite_movie_styles || [],
        favorite_series_styles: responseData.favorite_series_styles || [],
        plan_status: responseData.plan_status || "",
        user_status: responseData.user_status || "",
        session_token: responseData.session_token,
      };

      console.log("Normalized user data:", {
        ...userData,
        session_token: userData.session_token ? "exists" : "missing",
      });

      localStorage.setItem("userData", JSON.stringify(userData));
      if (responseData.session_token) {
        localStorage.setItem("session_token", responseData.session_token);
        console.log("Session token stored in localStorage");
      } else {
        console.warn("No session token received from server");
      }

      // Verificar se há um parâmetro de redirecionamento na URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect');
      
      if (redirectTo === 'pricing') {
        router.push('/pricing');
      } else {
        router.push("/dashboard/profile/");
      }
    } catch (err) {
      console.error("Detailed login error:", {
        error: err,
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      });

      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === "object" && "toString" in err) {
        setError(err.toString());
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-white">
          <FormattedMessage id="welcome" />
        </h1>
        <p className="text-gray-400 text-xl">
          <FormattedMessage id="aiAssistant" />
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-left text-sm text-white">
            <FormattedMessage id="email" />
          </Label>
          <Input
            id="email"
            {...register("email")}
            className="bg-[#1a1f36] text-white placeholder:text-gray-500"
            placeholder={formatMessage({ id: "enterEmail" })}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-left text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-left text-sm text-white">
            <FormattedMessage id="password" />
          </Label>
          <PasswordInput
            id="password"
            {...register("password")}
            className="bg-[#1a1f36] text-white placeholder:text-gray-500"
            placeholder={formatMessage({ id: "enterPassword" })}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-left text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <FormattedMessage id="signingIn" />
          ) : (
            <FormattedMessage id="signIn" />
          )}
        </Button>
      </form>
      <div className="mt-4 space-y-2 text-gray-400 text-center">
        <p>
          <FormattedMessage id="noAccount" />{" "}
          <Link
            href="/register"
            className="text-blue-400 hover:text-blue-300 underline hover:no-underline"
          >
            <FormattedMessage id="register" />
          </Link>
        </p>
        <Button
          variant="link"
          onClick={() => setIsResetModalOpen(true)}
          className="text-white underline hover:no-underline hover:text-blue-300"
        >
          <FormattedMessage id="forgotPassword" />
        </Button>
      </div>
      {/* Links para Terms & Conditions e Privacy Policy */}
      <div className="mt-4 space-y-2 text-gray-400 text-center flex flex-col">
        <Link
          href="/terms-conditions" target="_blank"
          className="text-white underline hover:no-underline hover:text-blue-300"
        >
          <FormattedMessage id="termsConditions" />
        </Link>
        <Link
          href="/privacy-policy" target="_blank"
          className="text-white underline hover:no-underline mt-2 hover:text-blue-300"
        >
          <FormattedMessage id="privacyPolicy" />
        </Link>
      </div>
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}
