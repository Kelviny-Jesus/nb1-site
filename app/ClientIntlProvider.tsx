"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import { IntlProvider } from "react-intl";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import pt from "@/locales/pt.json";

// Definir o tipo das chaves do objeto messages
export type Locale = "en" | "es" | "pt";

// Tipar o objeto messages como um Record com chaves do tipo Locale e valores do tipo Record<string, string>
const messages: Record<Locale, Record<string, string>> = {
  en,
  es,
  pt,
};

// Criar o contexto de internacionalização
type IntlContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const IntlContext = createContext<IntlContextType | undefined>(undefined);

// Hook para usar o contexto de internacionalização
export function useIntl() {
  const context = useContext(IntlContext);
  if (context === undefined) {
    throw new Error("useIntl must be used within a ClientIntlProvider");
  }
  return context;
}

export default function ClientIntlProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>("en");

  // Carregar a preferência de idioma do localStorage ao iniciar
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale && Object.keys(messages).includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  // Salvar a preferência de idioma no localStorage quando mudar
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <IntlContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      <IntlProvider
        messages={messages[locale]}
        locale={locale}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  );
}
