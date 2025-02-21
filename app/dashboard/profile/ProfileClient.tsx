"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, MapPin, Film, Phone, Calendar, Home, Heart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

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

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Starting to fetch user data...");

        const storedUserData = localStorage.getItem("userData");
        console.log("Stored user data from localStorage:", storedUserData);

        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          console.log("Using cached user data:", parsedData);
          setUserData(parsedData);
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("session_token");
        console.log("Session token exists:", !!token);

        if (!token) {
          console.error("No session token found");
          router.push("/");
          return;
        }

        console.log("Fetching from API...");
        const response = await fetch("https://n8n-blue.up.railway.app/webhook/nb1/api/user/data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include", // Inclui cookies automaticamente
        });

        console.log("API Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", {
            status: response.status,
            statusText: response.statusText,
            errorText,
          });

          if (response.status === 401) {
            console.log("Unauthorized - clearing session and redirecting");
            localStorage.removeItem("session_token");
            router.push("/");
            throw new Error("Session expired. Please log in again.");
          }
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response data:", data);

        // Normaliza os dados para lidar com array ou objeto
        let normalizedData: UserData | null = null;
        if (Array.isArray(data) && data.length > 0) {
          normalizedData = data[0];
        } else if (typeof data === "object" && data !== null) {
          normalizedData = data;
        } else {
          throw new Error("Invalid user data format received from API");
        }

        setUserData(normalizedData);
        localStorage.setItem("userData", JSON.stringify(normalizedData));
      } catch (error) {
        console.error("Detailed fetch error:", {
          error,
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-white">No user data available. Please log in again.</p>
          <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 text-white">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B14] p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header with Larger Logo */}
        <div className="text-center space-y-6 py-12">
          <div className="mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ICON-NUMBERONE-OFC-unscreen-2rlFGjCNaLYTMxnF8huXplEwcv1KGy.gif"
              alt="NB1 Logo"
              width={160}
              height={160}
              className="h-40 w-40 mx-auto"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">
              Welcome, {userData.full_name || "User"}!
            </h1>
            <p className="text-gray-400 text-lg">Here’s your profile overview</p>
          </div>
        </div>

        {/* Profile Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information Card */}
          <Link href="/profile">
            <Card className="h-full bg-gradient-to-b from-[#1A1D2E] to-[#131629] border-gray-800 hover:border-gray-700 transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center space-x-4 pb-6">
                <UserCircle className="w-8 h-8 text-blue-500" />
                <CardTitle className="text-xl text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-400">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span className="text-lg">{userData.phone || "Not set"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-lg">{userData.birth_date || "Not set"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">Email: {userData.email || "Not set"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">Gender: {userData.gender || "Not set"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">Preferred Currency: {userData.preferred_currency || "Not set"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">Preferred Language: {userData.preferred_language || "Not set"}</span>
                  </div>
                  <Button variant="ghost" className="mt-4 w-full justify-start text-blue-400 hover:text-blue-300">
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Address Card */}
          <Link href="/profile">
            <Card className="h-full bg-gradient-to-b from-[#1A1D2E] to-[#131629] border-gray-800 hover:border-gray-700 transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center space-x-4 pb-6">
                <MapPin className="w-8 h-8 text-green-500" />
                <CardTitle className="text-xl text-white">Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-400">
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5 text-green-500" />
                    <span className="text-lg">
                      {userData.street_address
                        ? `${userData.street_address}, ${userData.address_number}`
                        : "Address not set"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <span className="text-lg">
                      {userData.city ? `${userData.city}, ${userData.state}` : "Location not set"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">Postal Code: {userData.postal_code || "Not set"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">Country: {userData.country || "Not set"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">Address Complement: {userData.address_complement || "Not set"}</span>
                  </div>
                  <Button variant="ghost" className="mt-4 w-full justify-start text-green-400 hover:text-green-300">
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Cultural Preferences Card */}
          <Link href="/profile">
            <Card className="h-full bg-gradient-to-b from-[#1A1D2E] to-[#131629] border-gray-800 hover:border-gray-700 transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center space-x-4 pb-6">
                <Heart className="w-8 h-8 text-purple-500" />
                <CardTitle className="text-xl text-white">Cultural Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-gray-400">Hobbies</label>
                    <div className="flex flex-wrap gap-2">
                      {userData.hobbies?.slice(0, 3).map((hobby) => (
                        <Badge key={hobby} variant="secondary" className="bg-[#21262D] text-white">
                          {hobby}
                        </Badge>
                      ))}
                      {(userData.hobbies?.length || 0) > 3 && (
                        <Badge variant="secondary" className="bg-[#21262D] text-white">
                          +{(userData.hobbies?.length || 0) - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400">Favorite Movie Styles</label>
                    <div className="flex flex-wrap gap-2">
                      {userData.favorite_movie_styles?.slice(0, 3).map((style) => (
                        <Badge key={style} variant="secondary" className="bg-[#21262D] text-white">
                          {style}
                        </Badge>
                      ))}
                      {(userData.favorite_movie_styles?.length || 0) > 3 && (
                        <Badge variant="secondary" className="bg-[#21262D] text-white">
                          +{(userData.favorite_movie_styles?.length || 0) - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400">Favorite Series Styles</label>
                    <div className="flex flex-wrap gap-2">
                      {userData.favorite_series_styles?.slice(0, 3).map((style) => (
                        <Badge key={style} variant="secondary" className="bg-[#21262D] text-white">
                          {style}
                        </Badge>
                      ))}
                      {(userData.favorite_series_styles?.length || 0) > 3 && (
                        <Badge variant="secondary" className="bg-[#21262D] text-white">
                          +{(userData.favorite_series_styles?.length || 0) - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" className="mt-4 w-full justify-start text-purple-400 hover:text-purple-300">
                    View Details →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}