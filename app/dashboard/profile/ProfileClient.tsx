"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileTab from "@/components/dashboard/ProfileTab";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
}

export default function ProfileClient() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log("Starting to load user data...");

        const storedUserData = localStorage.getItem("userData");
        console.log("Stored user data from localStorage:", storedUserData);

        if (!storedUserData) {
          console.error("No user data found in localStorage");
          router.push("/");
          return;
        }

        let parsedData;
        try {
          parsedData = JSON.parse(storedUserData);
        } catch (parseError) {
          console.error("Failed to parse user data from localStorage:", parseError);
          throw new Error("Invalid user data format in localStorage");
        }

        console.log("Parsed user data:", parsedData);

        // Verificar se parsedData é uma array ou um objeto
        let normalizedData: UserData | null = null;
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          // Se for uma array, extrai o primeiro objeto
          normalizedData = {
            id: parsedData[0].id || "",
            full_name: parsedData[0].full_name || "",
            email: parsedData[0].email || "",
            phone: parsedData[0].phone || "",
            birth_date: parsedData[0].birth_date || "",
            gender: parsedData[0].gender || "",
            preferred_currency: parsedData[0].preferred_currency || "",
            preferred_language: parsedData[0].preferred_language || "",
            postal_code: parsedData[0].postal_code || "",
            country: parsedData[0].country || "",
            state: parsedData[0].state || "",
            city: parsedData[0].city || "",
            street_address: parsedData[0].street_address || "",
            address_number: parsedData[0].address_number || "",
            address_complement: parsedData[0].address_complement || "",
            hobbies: parsedData[0].hobbies || [],
            favorite_movie_styles: parsedData[0].favorite_movie_styles || [],
            favorite_series_styles: parsedData[0].favorite_series_styles || [],
            plan_status: parsedData[0].plan_status || "",
            user_status: parsedData[0].user_status || "",
          };
        } else if (typeof parsedData === "object" && parsedData !== null) {
          // Se for um objeto direto, usa como está
          normalizedData = {
            id: parsedData.id || "",
            full_name: parsedData.full_name || "",
            email: parsedData.email || "",
            phone: parsedData.phone || "",
            birth_date: parsedData.birth_date || "",
            gender: parsedData.gender || "",
            preferred_currency: parsedData.preferred_currency || "",
            preferred_language: parsedData.preferred_language || "",
            postal_code: parsedData.postal_code || "",
            country: parsedData.country || "",
            state: parsedData.state || "",
            city: parsedData.city || "",
            street_address: parsedData.street_address || "",
            address_number: parsedData.address_number || "",
            address_complement: parsedData.address_complement || "",
            hobbies: parsedData.hobbies || [],
            favorite_movie_styles: parsedData.favorite_movie_styles || [],
            favorite_series_styles: parsedData.favorite_series_styles || [],
            plan_status: parsedData.plan_status || "",
            user_status: parsedData.user_status || "",
          };
        } else {
          throw new Error("Invalid user data format - neither object nor array");
        }

        if (!normalizedData.id || !normalizedData.email) {
          console.error("Invalid user data format - missing required fields:", normalizedData);
          throw new Error("Invalid user data format - missing required fields");
        }

        console.log("Normalized user data:", normalizedData);
        setUserData(normalizedData);
      } catch (err) {
        console.error("Detailed error in loadUserData:", {
          error: err,
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : undefined,
        });
        setError("Failed to load user data. Please try logging in again.");
        router.push("/");
      }
    };

    loadUserData();
  }, [router]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return <ProfileTab initialUserData={userData} />;
}