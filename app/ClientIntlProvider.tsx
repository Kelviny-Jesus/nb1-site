"use client";

import { type ReactNode, useState } from "react";
import { IntlProvider } from "react-intl";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import pt from "@/locales/pt.json";

// Definir o tipo das chaves do objeto messages
type Locale = "en" | "es" | "pt";

// Tipar o objeto messages como um Record com chaves do tipo Locale e valores do tipo Record<string, string>
const messages: Record<Locale, Record<string, string>> = {
  en,
  es,
  pt,
};

export default function ClientIntlProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="en">
      {children}
    </IntlProvider>
  );
}

