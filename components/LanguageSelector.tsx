"use client";

import { useIntl, type Locale } from "@/app/ClientIntlProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import Image from "next/image";

// Mapeamento de idiomas para bandeiras (usando URLs externas)
const flagMap = {
  en: { src: "https://flagcdn.com/w20/us.png", alt: "US Flag" },
  es: { src: "https://flagcdn.com/w20/es.png", alt: "Spain Flag" },
  pt: { src: "https://flagcdn.com/w20/br.png", alt: "Brazil Flag" },
};

export default function LanguageSelector() {
  const { locale, setLocale } = useIntl();
  const [mounted, setMounted] = useState(false);

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={locale}
        onValueChange={(value) => setLocale(value as Locale)}
      >
        <SelectTrigger className="w-[140px] bg-[#1a1f36] text-white border-none">
          <div className="flex items-center space-x-2">
            <SelectValue
              placeholder={<FormattedMessage id="selectLanguage" />}
            />
          </div>
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="top"
          className="bg-[#1a1f36] text-white border-none"
        >
          <SelectItem value="en">
            <div className="flex items-center space-x-2">
              <Image
                src="https://flagcdn.com/w20/us.png"
                alt="US Flag"
                width={20}
                height={15}
                className="rounded-sm"
              />
              <span>
                <FormattedMessage id="english" />
              </span>
            </div>
          </SelectItem>
          <SelectItem value="es">
            <div className="flex items-center space-x-2">
              <Image
                src="https://flagcdn.com/w20/es.png"
                alt="Spain Flag"
                width={20}
                height={15}
                className="rounded-sm"
              />
              <span>
                <FormattedMessage id="spanish" />
              </span>
            </div>
          </SelectItem>
          <SelectItem value="pt">
            <div className="flex items-center space-x-2">
              <Image
                src="https://flagcdn.com/w20/br.png"
                alt="Brazil Flag"
                width={20}
                height={15}
                className="rounded-sm"
              />
              <span>
                <FormattedMessage id="portuguese" />
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
