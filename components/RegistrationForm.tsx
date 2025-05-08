"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import BasicInfoTab from "./registration/BasicInfoTab";
import AddressTab from "./registration/AddressTab";
import CulturalTab from "./registration/CulturalTab";
import ProgressBar from "./ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIntl as useClientIntl, Locale } from "@/app/ClientIntlProvider";
import { useIntl, FormattedMessage } from "react-intl";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Função para criar o esquema de validação com mensagens traduzidas
const createSchema = (formatMessage: any) =>
  z
    .object({
      fullName: z.string().min(1, formatMessage({ id: "fullNameRequired" })),
      email: z.string().email(formatMessage({ id: "invalidEmail" })),
      phone: z.string().min(1, formatMessage({ id: "phoneRequired" })),
      password: z
        .string()
        .min(8, formatMessage({ id: "passwordMinLength" }))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          formatMessage({ id: "passwordRequirements" })
        ),
      confirmPassword: z.string(),
      dateOfBirth: z.string().min(1, formatMessage({ id: "dateOfBirthRequired" })),
      gender: z.string().min(1, formatMessage({ id: "genderRequired" })),
      language: z.string(),
      postalCode: z.string().min(1, formatMessage({ id: "postalCodeRequired" })),
      country: z.string().min(1, formatMessage({ id: "countryRequired" })),
      state: z.string().min(1, formatMessage({ id: "stateRequired" })),
      city: z.string().optional(),
      address: z.string().min(1, formatMessage({ id: "addressRequired" })),
      number: z.string().min(1, formatMessage({ id: "numberRequired" })),
      hobbies: z.array(z.string()).optional(),
      favoriteMovieGenres: z.array(z.string()).optional(),
      favoriteSeriesGenres: z.array(z.string()).optional(),
      preferred_currency: z
        .string()
        .min(1, formatMessage({ id: "currencyRequired" })),
      address_complement: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: formatMessage({ id: "passwordsDoNotMatch" }),
      path: ["confirmPassword"],
    });

type FormData = z.infer<ReturnType<typeof createSchema>>;

// Usando formatMessage para traduzir os nomes das etapas
const getSteps = (formatMessage: any) => [
  formatMessage({ id: "basic" }),
  formatMessage({ id: "address" }),
  formatMessage({ id: "cultural" }),
];

export default function RegistrationForm() {
  const { locale, setLocale } = useClientIntl();
  const { formatMessage } = useIntl();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Estado para rastrear campos tocados
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  // Obter os nomes das etapas traduzidos
  const steps = getSteps(formatMessage);

  // Criar o esquema de validação inicial
  const [schema, setSchema] = useState(() => createSchema(formatMessage));

  // Criar o formulário com valores padrão e o esquema de validação
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "all", // Alterado de "onChange" para "all" para validar todos os campos
    defaultValues: {
      language: locale,
      hobbies: [],
      favoriteMovieGenres: [],
      favoriteSeriesGenres: [],
    },
  });

  const {
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isValid, dirtyFields },
  } = methods;

  // Função para verificar se pelo menos um dos campos da etapa Cultural foi preenchido
  const hasCulturalData = (): boolean => {
    const values = getValues();
    return !!(
      (values.hobbies && values.hobbies.length > 0) ||
      (values.favoriteMovieGenres && values.favoriteMovieGenres.length > 0) ||
      (values.favoriteSeriesGenres && values.favoriteSeriesGenres.length > 0)
    );
  };

  // Estado para controlar a validade da etapa atual
  const [isStepValid, setIsStepValid] = useState(false);
  
  // Estado para controlar se há dados culturais preenchidos
  const [hasCulturalDataState, setHasCulturalDataState] = useState(false);

  const router = useRouter();
  const { toast } = useToast(); // Correctly destructure the toast function

  // Constante de modo de desenvolvimento no escopo do componente para ser usada em vários lugares
  const devMode = false; // Defina como true para testes, false para produção

  // Função simplificada para avançar para a próxima etapa sem validação
  const goToNextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);  
    } else {
      // Na última etapa, apenas mostrar um alerta em vez de enviar para o servidor
      alert("Formulário enviado em modo de desenvolvimento (sem validação)");
    }
  };

  const onSubmit = async (data: FormData) => {
    // Em modo de desenvolvimento, pular toda a validação
    if (devMode) {
      goToNextStep();
      return;
    }

    // Código corrigido com validação apenas da etapa atual
    if (step < steps.length - 1) {
      const isStepValid = await validateCurrentStep(); // Usar validateCurrentStep em vez de trigger
      console.log("Validação no onSubmit:", isStepValid);
      if (isStepValid) {
        setStep(step + 1);
      }
    } else {
      try {
        const payload = {
          ...data,
          address_complement: data.address_complement || "",
        };
        const response = await fetch(
          "https://n8n-blue.up.railway.app/webhook/nb1/api/user/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const responseData = await response.json();

        if (responseData.status === true) {
          // Success case
          toast({
            title: "Registration Successful",
            description: responseData.msg,
            variant: "default",
          });
          // Redirect to pricing page
          router.push("/pricing");
        } else {
          // Error case - email already exists
          toast({
            title: "Registration Failed",
            description: (
              <div className="space-y-2">
                <p>{responseData.msg}</p>
                <Button
                  variant="link"
                  className="p-0 text-white hover:text-blue-300"
                  onClick={() => router.push("/")}
                >
                  Click here to login
                </Button>
              </div>
            ),
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLocale(newLanguage as Locale);
    methods.setValue("language", newLanguage);
  };

  // Função para marcar um campo como tocado
  const markFieldAsTouched = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Função para verificar se os campos da etapa atual são válidos
  const validateCurrentStep = async () => {
    let fieldsToValidate: string[] = [];
    
    if (step === 0) {
      // Campos da primeira etapa
      fieldsToValidate = ["fullName", "email", "phone", "password", "confirmPassword", "dateOfBirth", "gender", "preferred_currency"];
    } else if (step === 1) {
      // Campos da segunda etapa
      fieldsToValidate = ["postalCode", "country", "state", "address", "number"];
    } else if (step === 2) {
      // Campos da terceira etapa (opcionais)
      setIsStepValid(true);
      return true;
    }
    
    // Verificar se todos os campos necessários estão preenchidos
    const values = getValues();
    const allFieldsFilled = fieldsToValidate.every(field => {
      const value = values[field as keyof FormData];
      return value !== undefined && value !== "" && value !== null;
    });
    
    // Validar os campos usando o trigger
    const isValid = await trigger(fieldsToValidate as any);
    
    // Verificar se há erros nos campos da etapa atual
    const hasErrors = fieldsToValidate.some(field => errors[field as keyof FormData]);
    
    // Atualizar o estado de validade da etapa
    const stepValid = allFieldsFilled && isValid && !hasErrors;
    console.log("Validação da etapa:", { step, allFieldsFilled, isValid, hasErrors, stepValid });
    setIsStepValid(stepValid);
    
    return stepValid;
  };

  // Efeito para validar os campos quando o componente é montado
  useEffect(() => {
    // Validar os campos da etapa atual quando o componente é montado
    validateCurrentStep();
  }, []);

  // Efeito para resetar a validação quando mudar de etapa
  useEffect(() => {
    // Log para depuração
    console.log("Etapa mudou para:", step);
    
    // Resetar os campos tocados ao mudar de etapa
    setTouchedFields({});
    
    // Validar os campos da etapa atual
    validateCurrentStep();
  }, [step, methods]);

  useEffect(() => {
    // Atualizar o formulário quando o idioma global mudar
    methods.setValue("language", locale);

    // Atualizar o esquema de validação com as mensagens traduzidas
    setSchema(createSchema(formatMessage));

    // Validar os campos da etapa atual após a mudança de idioma
    validateCurrentStep();
  }, [locale, methods, formatMessage]);

  // Efeito para validar os campos quando eles são tocados
  useEffect(() => {
    // Obter os nomes dos campos que foram tocados
    const touchedFieldNames = Object.keys(touchedFields).filter(
      (fieldName) => touchedFields[fieldName]
    );

    // Se houver campos tocados, validar a etapa atual
    if (touchedFieldNames.length > 0) {
      validateCurrentStep();
    }
  }, [touchedFields]);

  // Efeito para validar os campos quando os valores do formulário mudam
  useEffect(() => {
    // Determinar quais campos observar com base na etapa atual
    let fieldsToWatch: string[] = [];
    
    if (step === 0) {
      // Campos da primeira etapa
      fieldsToWatch = ["fullName", "email", "phone", "password", "confirmPassword", "dateOfBirth", "gender", "preferred_currency"];
    } else if (step === 1) {
      // Campos da segunda etapa
      fieldsToWatch = ["postalCode", "country", "state", "address", "number"];
    } else if (step === 2) {
      // Campos da terceira etapa (opcionais)
      fieldsToWatch = ["hobbies", "favoriteMovieGenres", "favoriteSeriesGenres"];
    }
    
    // Observar apenas os campos da etapa atual
    const subscription = methods.watch((value, { name }) => {
      if (!name || fieldsToWatch.includes(name as string)) {
        // Usar um timeout para evitar validações excessivas durante a digitação
        const timeoutId = setTimeout(() => {
          validateCurrentStep();
          
          // Atualizar o estado hasCulturalDataState quando estiver na etapa Cultural
          if (step === 2) {
            setHasCulturalDataState(hasCulturalData());
          }
        }, 300);
        
        return () => clearTimeout(timeoutId);
      }
    });
    
    // Limpar a inscrição quando o componente for desmontado ou a etapa mudar
    return () => subscription.unsubscribe();
  }, [step, methods]);
  
  // Efeito para atualizar o estado hasCulturalDataState quando mudar para a etapa Cultural
  useEffect(() => {
    if (step === 2) {
      setHasCulturalDataState(hasCulturalData());
    }
  }, [step]);

  return (
    <Card className="border-none bg-transparent">
      <CardContent className="p-6">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <ProgressBar steps={steps} currentStep={step} />

            <div className="mt-8">
              {step === 0 && (
                <BasicInfoTab
                  onLanguageChange={handleLanguageChange}
                  touchedFields={touchedFields}
                  markFieldAsTouched={markFieldAsTouched}
                />
              )}
              {step === 1 && (
                <AddressTab
                  touchedFields={touchedFields}
                  markFieldAsTouched={markFieldAsTouched}
                />
              )}
              {step === 2 && (
                <CulturalTab
                  touchedFields={touchedFields}
                  markFieldAsTouched={markFieldAsTouched}
                />
              )}
            </div>

            <div className="flex justify-between pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 0}
              >
                <FormattedMessage id="previous" />
              </Button>

              {/* Botão normal com validação */}
              {!devMode && (
                <Button 
                  type="button" 
                  disabled={!isStepValid}
                  onClick={async () => {
                    console.log("Botão Next/Submit clicado");
                    if (step < steps.length - 1) {
                      const isStepValid = await validateCurrentStep();
                      console.log("Validação no clique do botão:", isStepValid);
                      if (isStepValid) {
                        setStep(step + 1);
                      }
                    } else {
                      // Na última etapa, enviar o formulário e redirecionar imediatamente
                      try {
                        // Enviar dados em segundo plano
                        handleSubmit((data) => {
                          // Executar onSubmit em segundo plano
                          onSubmit(data);
                        })();
                        // Redirecionar imediatamente para a página de planos
                        router.push("/pricing");
                      } catch (error) {
                        console.error("Erro ao enviar formulário:", error);
                        // Redirecionar mesmo em caso de erro
                        router.push("/pricing");
                      }
                    }
                  }}
                >
                  {step === steps.length - 1 ? (
                    hasCulturalDataState ? (
                      <FormattedMessage id="submit" />
                    ) : (
                      <FormattedMessage id="skip" />
                    )
                  ) : (
                    <FormattedMessage id="next" />
                  )}
                </Button>
              )}

              {/* Botão de desenvolvimento sem validação */}
              {devMode && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {step === steps.length - 1 ? "DEV: Submit" : "DEV: Next"}
                  </Button>
                  <Button type="submit" disabled={!isValid}>
                    {step === steps.length - 1 ? (
                      <FormattedMessage id="submit" />
                    ) : (
                      <FormattedMessage id="next" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
