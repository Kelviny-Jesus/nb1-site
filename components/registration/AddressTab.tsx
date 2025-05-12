"use client";

import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIntl } from "react-intl";
import { debounce } from "lodash";
import { Autocomplete } from "@react-google-maps/api";
import type React from "react";

interface AddressTabProps {
  touchedFields: Record<string, boolean>;
  markFieldAsTouched: (fieldName: string) => void;
  isGoogleMapsLoaded: boolean;
}

export default function AddressTab({
  touchedFields,
  markFieldAsTouched,
  isGoogleMapsLoaded,
}: AddressTabProps) {
  const { formatMessage: t } = useIntl();
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [addressError, setAddressError] = useState<string | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Função para buscar endereço pelo código postal usando Google Maps Geocoding API
  const lookupAddress = async (postalCode: string) => {
    if (!postalCode || postalCode.length < 3) return;

    try {
      // Salvar o valor atual do CEP
      const currentPostalCode = postalCode;

      // Formatar o CEP e adicionar "Brazil" para CEPs brasileiros (8 dígitos)
      const formattedPostalCode = postalCode.replace(/[^0-9]/g, ""); // Remover caracteres não numéricos
      const searchQuery =
        formattedPostalCode.length === 8
          ? `${formattedPostalCode}, Brazil`
          : formattedPostalCode;

      console.log("Buscando endereço para:", searchQuery);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchQuery
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      console.log("Resposta da API:", data);

      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        console.log("Resultado encontrado:", result);

        // Extrair componentes do endereço
        let country = "",
          state = "",
          city = "",
          street = "",
          postalCode = "";

        result.address_components.forEach((component: any) => {
          if (component.types.includes("country")) {
            country = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("route")) {
            street = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            postalCode = component.long_name;
          }
        });

        setValue("country", country);
        setValue("state", state);
        setValue("city", city);
        setValue("address", street);
        // Importante: Usar o CEP retornado pela API apenas se for encontrado
        // Caso contrário, manter o valor que o usuário digitou
        setValue("postalCode", postalCode || currentPostalCode);

        markFieldAsTouched("country");
        markFieldAsTouched("state");
        markFieldAsTouched("city");
        markFieldAsTouched("address");
        markFieldAsTouched("postalCode");

        setAddressError(null);
      } else {
        console.log("Erro na API do Google Maps:", data.status);
        // Exibir mensagem de erro específica com base no status
        if (data.status === "ZERO_RESULTS") {
          setAddressError(t({ id: "invalidPostalCode" }));
        } else if (data.status === "REQUEST_DENIED") {
          console.error("Erro de chave de API:", data.error_message);
          setAddressError(
            "Erro de autenticação da API. Verifique a chave da API."
          );
        } else {
          setAddressError(t({ id: "addressLookupError" }));
        }

        // IMPORTANTE: NÃO limpar o campo de CEP quando a busca falhar
        // Isso permite que o usuário continue digitando
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      setAddressError(t({ id: "addressLookupError" }));
      // IMPORTANTE: NÃO limpar o campo de CEP quando ocorrer um erro
    }
  };

  // Debounce a função de busca com tempo maior para dar mais tempo ao usuário para digitar
  const debouncedLookup = debounce(lookupAddress, 4000);

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length >= 3) {
      debouncedLookup(value);
    }
    markFieldAsTouched("postalCode");
  };

  // Função para lidar com a seleção de um lugar no autocomplete
  const onPlaceSelected = (place: google.maps.places.PlaceResult) => {
    console.log("Lugar selecionado:", place);

    if (place.address_components) {
      let country = "",
        state = "",
        city = "",
        street = "",
        postalCode = "";

      place.address_components.forEach((component) => {
        if (component.types.includes("country")) {
          country = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("route")) {
          street = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          postalCode = component.long_name;
        }
      });

      setValue("country", country);
      setValue("state", state);
      setValue("city", city);
      setValue("address", street);
      setValue("postalCode", postalCode);

      markFieldAsTouched("country");
      markFieldAsTouched("state");
      markFieldAsTouched("city");
      markFieldAsTouched("address");
      markFieldAsTouched("postalCode");

      setAddressError(null);
    }
  };

  return (
    <div className="space-y-4">
      {!isGoogleMapsLoaded && (
        <Alert>
          <AlertDescription>
            {t({ id: "loadingAddressData" }) ||
              "Carregando dados de endereço..."}
          </AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="postalCode">{t({ id: "postalCode" })}</Label>
        <Input
          id="postalCode"
          {...register("postalCode")}
          onChange={handlePostalCodeChange}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          placeholder={t({ id: "enterPostalCode" })}
          onBlur={() => markFieldAsTouched("postalCode")}
        />
        {errors.postalCode && touchedFields.postalCode && (
          <p className="mt-1 text-sm text-red-500">
            {errors.postalCode.message as string}
          </p>
        )}
      </div>

      {/* Campo de endereço completo removido conforme solicitado */}

      {addressError && (
        <Alert variant="destructive">
          <AlertDescription>{addressError}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="country">{t({ id: "country" })}</Label>
        <Input
          id="country"
          {...register("country")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          onBlur={() => markFieldAsTouched("country")}
        />
        {errors.country && touchedFields.country && (
          <p className="mt-1 text-sm text-red-500">
            {errors.country.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="state">{t({ id: "state" })}</Label>
        <Input
          id="state"
          {...register("state")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          onBlur={() => markFieldAsTouched("state")}
        />
        {errors.state && touchedFields.state && (
          <p className="mt-1 text-sm text-red-500">
            {errors.state.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="city">{t({ id: "city" })}</Label>
        <Input
          id="city"
          {...register("city")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          onBlur={() => markFieldAsTouched("city")}
        />
        {errors.city && touchedFields.city && (
          <p className="mt-1 text-sm text-red-500">
            {errors.city.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="address">{t({ id: "address" })}</Label>
        <Input
          id="address"
          {...register("address")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          onBlur={() => markFieldAsTouched("address")}
        />
        {errors.address && touchedFields.address && (
          <p className="mt-1 text-sm text-red-500">
            {errors.address.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="number">{t({ id: "number" })}</Label>
        <Input
          id="number"
          {...register("number")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          onBlur={() => markFieldAsTouched("number")}
        />
        {errors.number && touchedFields.number && (
          <p className="mt-1 text-sm text-red-500">
            {errors.number.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="complement">{t({ id: "complement" })}</Label>
        <Input
          id="complement"
          {...register("address_complement")}
          className="mt-2 bg-[#1a1f36] border-gray-700 text-white placeholder:text-gray-500"
          onBlur={() => markFieldAsTouched("address_complement")}
        />
        {errors.address_complement && touchedFields.address_complement && (
          <p className="mt-1 text-sm text-red-500">
            {errors.address_complement.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
