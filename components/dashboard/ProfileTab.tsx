"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthenticationModal from "@/components/modals/AuthenticationModal";
import EditBasicInfoModal from "@/components/modals/EditBasicInfoModal";
import EditAddressModal from "@/components/modals/EditAddressModal";
import EditCulturalModal from "@/components/modals/EditCulturalModal";

interface UserData {
  id: string;
  full_name: string;
  phone: string;
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
  birth_date: string;
  email: string;
  plan_status: string;
  user_status: string;
}

interface ProfileTabProps {
  initialUserData: UserData | null; // Mantém como um objeto único ou null
}

export default function ProfileTab({ initialUserData }: ProfileTabProps) {
  const [userData, setUserData] = useState<UserData | null>(
    initialUserData && Array.isArray(initialUserData) && initialUserData.length > 0
      ? initialUserData[0] // Extrai o primeiro objeto da array, se for uma array
      : initialUserData
  );
  const [editMode, setEditMode] = useState<"basic" | "address" | "cultural" | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("session_token");
      console.log("Fetching user data with token:", token ? `Token: ${token.slice(0, 10)}...` : "No token found");

      if (!token) {
        console.error("No session token found");
        router.push("/");
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(
        "https://n8n-blue.up.railway.app/webhook/nb1/api/user/data", // URL atualizada
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Mantém o token Bearer (se necessário)
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include", // Inclui cookies automaticamente na requisição
        }
      );

      console.log("API Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("session_token");
          router.push("/");
          throw new Error("Session expired. Please log in again.");
        }
        const errorText = await response.text();
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response data:", data);

      // Verifica se a resposta é uma array ou um objeto
      if (Array.isArray(data) && data.length > 0) {
        setUserData(data[0]); // Define o primeiro objeto como userData
        localStorage.setItem("userData", JSON.stringify(data[0]));
      } else if (typeof data === "object" && data !== null) {
        setUserData(data); // Se for um objeto direto, usa diretamente
        localStorage.setItem("userData", JSON.stringify(data));
      } else {
        throw new Error("Invalid user data format received from API");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      setError(
        error instanceof Error ? error.message : "An unknown error occurred while fetching user data"
      );

      if (error instanceof Error && error.message.includes("Authentication required")) {
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, [userData, fetchUserData]);

  const handleEdit = async (mode: "basic" | "address" | "cultural") => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = localStorage.getItem("userData");
      if (!userData) {
        throw new Error("User data not found");
      }

      const parsedUserData = JSON.parse(userData);
      const { email } = parsedUserData;

      const token = localStorage.getItem("session_token");
      if (!token) {
        throw new Error("No session token found for authentication");
      }

      const response = await fetch(
        "https://n8n-blue.up.railway.app/webhook/nb1/api/user/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Inclui o token aqui também, se necessário
          },
          credentials: "include", // Inclui cookies automaticamente na requisição
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify user");
      }

      setEditMode(mode);
      setShowAuthModal(true);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticate = async (email: string, password: string) => {
    try {
      const response = await fetch(
        "https://n8n-blue.up.railway.app/webhook/nb1/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Inclui cookies automaticamente na requisição
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      if (data.session_token) {
        localStorage.setItem("session_token", data.session_token);
        console.log("New session token saved:", data.session_token.slice(0, 10) + "...");
      }

      setShowAuthModal(false);
      fetchUserData(); // Recarrega os dados do usuário após autenticação
    } catch (err) {
      throw new Error("Authentication failed");
    }
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
    setEditMode(null);
  };

  const handleCloseEdit = () => {
    setEditMode(null);
    fetchUserData();
  };

  const userEmail = userData?.email || "";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white">Loading your profile...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card className="bg-[#1A1D2E] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Basic Information</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => handleEdit("basic")}
                className="text-white"
                disabled={isLoading}
              >
                Edit Information
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">Full Name</Label>
                  <Input
                    value={userData?.full_name || ""}
                    className="bg-[#131629] border-gray-800 text-white"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">Email</Label>
                  <Input
                    value={userData?.email || ""}
                    className="bg-[#131629] border-gray-800 text-white"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">Phone</Label>
                  <Input
                    value={userData?.phone || ""}
                    className="bg-[#131629] border-gray-800 text-white"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">Birth Date</Label>
                  <Input
                    value={userData?.birth_date || ""}
                    className="bg-[#131629] border-gray-800 text-white"
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card className="bg-[#1A1D2E] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Address</CardTitle>
                <CardDescription>Your address information</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => handleEdit("address")}
                className="text-white"
                disabled={isLoading}
              >
                Edit Address
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Address</Label>
                <Input
                  value={userData?.street_address || ""}
                  className="bg-[#131629] border-gray-800 text-white"
                  readOnly
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">Number</Label>
                  <Input
                    value={userData?.address_number || ""}
                    className="bg-[#131629] border-gray-800 text-white"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">Complement</Label>
                  <Input
                    value={userData?.address_complement || ""}
                    className="bg-[#131629] border-gray-800 text-white"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">City</Label>
                  <Input
                    value={userData?.city || ""}
                    className="bg-[#131629] border-gray-800 text-white"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">State</Label>
                  <Input
                    value={userData?.state || ""}
                    className="bg-[#131629] border-gray-800 text-white"
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Postal Code</Label>
                <Input
                  value={userData?.postal_code || ""}
                  className="bg-[#131629] border-gray-800 text-white"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Country</Label>
                <Input
                  value={userData?.country || ""}
                  className="bg-[#131629] border-gray-800 text-white"
                  readOnly
                />
              </div>
            </CardContent>
          </Card>

          {/* Cultural Preferences Card */}
          <Card className="bg-[#1A1D2E] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Cultural Preferences</CardTitle>
                <CardDescription>Your interests and preferences</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => handleEdit("cultural")}
                className="text-white"
                disabled={isLoading}
              >
                Edit Preferences
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Hobbies</Label>
                <div className="flex flex-wrap gap-2">
                  {userData?.hobbies?.map((hobby) => (
                    <Badge key={hobby} className="bg-[#131629] text-white">
                      {hobby}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Favorite Movie Styles</Label>
                <div className="flex flex-wrap gap-2">
                  {userData?.favorite_movie_styles?.map((style) => (
                    <Badge key={style} className="bg-[#131629] text-white">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-400">Favorite Series Styles</Label>
                <div className="flex flex-wrap gap-2">
                  {userData?.favorite_series_styles?.map((style) => (
                    <Badge key={style} className="bg-[#131629] text-white">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      <AuthenticationModal
        isOpen={showAuthModal}
        onClose={handleCloseAuth}
        onAuthenticate={handleAuthenticate}
        email={userEmail}
      />

      {editMode === "basic" && !showAuthModal && <EditBasicInfoModal isOpen={true} onClose={handleCloseEdit} />}
      {editMode === "address" && !showAuthModal && <EditAddressModal isOpen={true} onClose={handleCloseEdit} />}
      {editMode === "cultural" && !showAuthModal && <EditCulturalModal isOpen={true} onClose={handleCloseEdit} />}
    </div>
  );
}