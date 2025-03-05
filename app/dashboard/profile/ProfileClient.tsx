"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

import Image from "next/image";
import { UserCircle, MapPin, Phone, Calendar, Home, Heart, X } from "lucide-react";

// ------------------ IMPORTS do shadcn/ui (Popover, Command, etc.) ------------------
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronsUpDown } from "lucide-react";

// ------------------ Tipagem do usuário ------------------
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

// ------------------ Opções para as listas suspensas ------------------
const HOBBIES_OPTIONS = [
  "reading",
  "writing",
  "painting",
  "drawing",
  "photography",
  "cooking",
  "traveling",
  "gaming",
  "music",
  "sports",
  "jogos",
  "esportes",
  "academia",
  "baking",
  "gardening",
  "hiking",
  "camping",
  "fishing",
  "hunting",
  "swimming",
  "surfing",
  "skiing",
  "snowboarding",
  "cycling",
  "running",
  "yoga",
  "meditation",
  "dancing",
  "singing",
  "playing-instrument",
  "collecting",
  "learning-languages",
  "woodworking",
  "knitting",
  "sewing",
  "pottery",
  "sculpting",
  "bird-watching",
  "astronomy",
  "chess",
  "board-games",
  "video-games",
  "puzzles",
  "volunteering",
  "podcasting",
  "blogging",
];

const MOVIE_SERIES_OPTIONS = [
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "documentary",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "science-fiction",
  "thriller",
  "western",
];

// ------------------ Componente principal ------------------
export default function ProfileClient() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState<Partial<UserData> | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  // ------------------ Carrega dados do usuário ------------------
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
          setEditData(parsedData);
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("session_token");
        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch("/api/n8n/api/user/data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("session_token");
            router.push("/");
            throw new Error("Session expired. Please log in again.");
          }
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        let normalizedData: UserData | null = null;

        if (Array.isArray(data) && data.length > 0) {
          normalizedData = data[0];
        } else if (typeof data === "object" && data !== null) {
          normalizedData = data;
        } else {
          throw new Error("Invalid user data format received from API");
        }

        setUserData(normalizedData);
        setEditData(normalizedData);
        localStorage.setItem("userData", JSON.stringify(normalizedData));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
        setEditData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // ------------------ Modal: Editar e Cancelar ------------------
  const handleEdit = () => {
    if (!userData) return;
    setIsEditModalOpen(true);
    setEditData(userData);
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setEditData(userData || null);
  };

  // ------------------ Nova função: Logout ------------------
  const handleLogout = () => {
    // Remove token e dados do usuário do localStorage
    localStorage.removeItem("session_token");
    localStorage.removeItem("userData");
    // Redireciona para a página inicial (ou login)
    router.push("/");
  };

  // ------------------ Funções de input (string e array) ------------------
  // ADICIONE A TIPAGEM AQUI
  const handleStringInputChange = (
    field: keyof UserData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleInputChange(field, e.target.value);
  };

  const handleInputChange = (field: keyof UserData, value: string | string[]) => {
    setEditData((prev) => {
      if (!prev) return { [field]: value };
      return { ...prev, [field]: value };
    });
  };

  // ------------------ Salvar no backend ------------------
  const handleSave = async () => {
    if (!userData || !editData) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("session_token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/n8n/api/user/change", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user data: HTTP ${response.status} - ${errorText}`);
      }

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : { status: "false", msg: "No response from server" };
      } catch (jsonError) {
        throw new Error("Invalid JSON response from server");
      }

      if (data.status === "true") {
        // Atualiza localmente
        setUserData({ ...userData, ...editData });
        localStorage.setItem("userData", JSON.stringify({ ...userData, ...editData }));
        setIsEditModalOpen(false);
        toast({
          title: "Success",
          description: data.msg || "Dados alterados com sucesso!",
        });
      } else {
        setError(data.msg || "Erro ao alterar os dados!");
        toast({
          title: "Error",
          description: data.msg || "Erro ao alterar os dados!",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err instanceof Error ? err.message : "Failed to update user data. Please try again.");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------ Render: Loading / Sem dados / Principal ------------------
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
        {/* ------------------ Header ------------------ */}
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

        {/* ------------------ Profile Summary Cards ------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information Card */}
          <Card className="h-full bg-gradient-to-b from-[#1A1D2E] to-[#131629] border-gray-800 hover:border-gray-700 transition-all">
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
              </div>
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card className="h-full bg-gradient-to-b from-[#1A1D2E] to-[#131629] border-gray-800 hover:border-gray-700 transition-all">
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
              </div>
            </CardContent>
          </Card>

          {/* Cultural Preferences Card */}
          <Card className="h-full bg-gradient-to-b from-[#1A1D2E] to-[#131629] border-gray-800 hover:border-gray-700 transition-all">
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões para Editar Perfil e Logout */}
        <div className="text-center mt-8 space-x-4">
          <Button
            onClick={handleEdit}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-2 rounded-lg"
          >
            Edit Profile
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-white border-white hover:bg-gray-700 px-6 py-2 rounded-lg"
          >
            Logout
          </Button>
        </div>

        {/* ------------------ Modal de Edição ------------------ */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-[#1A1D2E] border-gray-800 text-white max-h-[80vh] sm:max-w-[480px] rounded-lg shadow-lg overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Edit Profile</DialogTitle>
                <Button variant="ghost" className="h-6 w-6 p-0" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription className="text-gray-400">
                Update your personal information below.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-6 p-4"
            >
              {/* Basic Information Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editData?.full_name || ""}
                      onChange={(e) => handleStringInputChange("full_name", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter full name"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editData?.phone || ""}
                      onChange={(e) => handleStringInputChange("phone", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter phone number"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_date">Birth Date</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={editData?.birth_date || ""}
                      onChange={(e) => handleStringInputChange("birth_date", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      value={editData?.gender || ""}
                      onChange={(e) => handleStringInputChange("gender", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter gender"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferred_currency">Preferred Currency</Label>
                    <Input
                      id="preferred_currency"
                      value={editData?.preferred_currency || ""}
                      onChange={(e) => handleStringInputChange("preferred_currency", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter currency"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferred_language">Preferred Language</Label>
                    <Input
                      id="preferred_language"
                      value={editData?.preferred_language || ""}
                      onChange={(e) => handleStringInputChange("preferred_language", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter language"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street_address">Street Address</Label>
                    <Input
                      id="street_address"
                      value={editData?.street_address || ""}
                      onChange={(e) => handleStringInputChange("street_address", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter street address"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_number">Address Number</Label>
                    <Input
                      id="address_number"
                      value={editData?.address_number || ""}
                      onChange={(e) => handleStringInputChange("address_number", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter number"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_complement">Address Complement</Label>
                    <Input
                      id="address_complement"
                      value={editData?.address_complement || ""}
                      onChange={(e) => handleStringInputChange("address_complement", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter complement"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editData?.city || ""}
                      onChange={(e) => handleStringInputChange("city", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter city"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={editData?.state || ""}
                      onChange={(e) => handleStringInputChange("state", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter state"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={editData?.postal_code || ""}
                      onChange={(e) => handleStringInputChange("postal_code", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter postal code"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editData?.country || ""}
                      onChange={(e) => handleStringInputChange("country", e)}
                      className="bg-[#131629] border-gray-800 text-white"
                      placeholder="Enter country"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Cultural Preferences Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Cultural Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hobbies">Hobbies</Label>
                    <PopoverMultiSelect
                      options={HOBBIES_OPTIONS}
                      value={editData?.hobbies || []}
                      onValueChange={(vals) => handleInputChange("hobbies", vals)}
                      placeholder="Select hobbies..."
                      emptyMessage="No hobbies found"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favorite_movie_styles">Favorite Movie Styles</Label>
                    <PopoverMultiSelect
                      options={MOVIE_SERIES_OPTIONS}
                      value={editData?.favorite_movie_styles || []}
                      onValueChange={(vals) => handleInputChange("favorite_movie_styles", vals)}
                      placeholder="Select movie styles..."
                      emptyMessage="No genres found"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favorite_series_styles">Favorite Series Styles</Label>
                    <PopoverMultiSelect
                      options={MOVIE_SERIES_OPTIONS}
                      value={editData?.favorite_series_styles || []}
                      onValueChange={(vals) => handleInputChange("favorite_series_styles", vals)}
                      placeholder="Select series styles..."
                      emptyMessage="No genres found"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 text-white border-white hover:bg-gray-700"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/**
 * Componente de MultiSelect (Popover + Command)
 * Permite múltipla seleção sem fechar a cada clique.
 */
function PopoverMultiSelect({
  options,
  value,
  onValueChange,
  placeholder,
  emptyMessage,
}: {
  options: string[];
  value: string[];
  onValueChange: (newValues: string[]) => void;
  placeholder: string;
  emptyMessage: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra as opções
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adiciona/remove do array
  const handleSelectOption = (option: string) => {
    if (value.includes(option)) {
      onValueChange(value.filter((v) => v !== option));
    } else {
      onValueChange([...value, option]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-[60px] justify-between bg-[#1a1f36] border-gray-700 text-white hover:bg-[#2a2f46] relative"
        >
          <ScrollArea className="w-[calc(100%-2rem)] h-[48px] py-1">
            <div className="flex flex-wrap gap-1">
              {value.length === 0 ? (
                <span className="text-gray-500">{placeholder}</span>
              ) : (
                value.map((item) => (
                  <Badge key={item} variant="secondary" className="bg-[#2a2f46] text-white whitespace-nowrap">
                    {item}
                  </Badge>
                ))
              )}
            </div>
          </ScrollArea>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-3" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0 bg-[#1a1f36] border-gray-700">
        <Command className="bg-transparent">
          <CommandInput
            placeholder={placeholder}
            className="text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[300px]">
                {filteredOptions.map((option) => {
                  const selected = value.includes(option);
                  return (
                    <CommandItem
                      key={option}
                      // Evita fechar ao clicar
                      cmdk-prevent-close
                      onSelect={() => handleSelectOption(option)}
                      className="text-white hover:bg-[#2a2f46]"
                    >
                      <Check
                        className={
                          "mr-2 h-4 w-4 " + (selected ? "opacity-100" : "opacity-0")
                        }
                      />
                      {option}
                    </CommandItem>
                  );
                })}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
