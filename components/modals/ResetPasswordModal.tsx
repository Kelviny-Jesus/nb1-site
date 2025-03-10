// src/components/modals/ResetPasswordModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import * as z from "zod"; // Para validação da senha

// Esquema de validação para a senha
const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[!@#$%^&*]/, { message: "Password must contain at least one special character (!@#$%^&*)" });

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Checking email:", email);
      const checkResponse = await fetch("/api/n8n/api/user/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("Email check response status:", checkResponse.status);

      if (!checkResponse.ok) {
        const errorText = await checkResponse.text();
        console.error("Email check error response:", errorText);
        throw new Error(`Failed to check email: ${errorText}`);
      }

      const checkData = await checkResponse.json();
      console.log("Email check response data:", checkData);

      if (checkData.status === true) {
        console.log("Sending reset code request for email:", email);
        const sendCodeResponse = await fetch("/api/n8n/api/send-reset-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        console.log("Send code response status:", sendCodeResponse.status);

        if (!sendCodeResponse.ok) {
          const errorText = await sendCodeResponse.text();
          console.error("Send code error response:", errorText);
          throw new Error(`Failed to send reset code: ${errorText}`);
        }

        const sendCodeData = await sendCodeResponse.json();
        console.log("Send code response data:", sendCodeData);

        toast({
          title: "Success",
          description: sendCodeData.msg || "A code has been sent to your email to reset your password.",
        });
        setStep("code"); // Avança para a etapa do código
      } else {
        setError(checkData.msg || "Email not found. Please check and try again.");
      }
    } catch (err) {
      console.error("Detailed error in handleEmailSubmit:", err);
      setError(err instanceof Error ? err.message : "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Verifying code for email:", email, "with code:", code);
      const verifyResponse = await fetch("/api/n8n/api/verify-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      console.log("Code verify response status:", verifyResponse.status);

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.error("Code verify error response:", errorText);
        throw new Error(`Failed to verify code: ${errorText}`);
      }

      const verifyData = await verifyResponse.json();
      console.log("Code verify response data:", verifyData);

      if (verifyData.status === true) {
        toast({
          title: "Success",
          description: verifyData.msg || "Code verified! You can now reset your password.",
        });
        setStep("password"); // Avança para a etapa de alterar senha
      } else {
        setError(verifyData.msg || "Invalid code. Please check and try again.");
      }
    } catch (err) {
      console.error("Detailed error in handleCodeSubmit:", err);
      setError(err instanceof Error ? err.message : "Failed to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validação da senha com zod
      const passwordValidation = passwordSchema.safeParse(newPassword);
      if (!passwordValidation.success) {
        setError(passwordValidation.error.errors[0].message);
        setIsLoading(false);
        return;
      }

      // Verifica se as senhas coincidem
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match. Please try again.");
        setIsLoading(false);
        return;
      }

      // Envia a nova senha para o backend
      console.log("Resetting password for email:", email, "with newPassword:", newPassword);
      const response = await fetch("/api/n8n/api/reset/password", { // Atualizado para a rota correta
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      console.log("Password reset response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Password reset error response:", errorText);
        throw new Error(`Failed to reset password: ${errorText}`);
      }

      const data = await response.json();
      console.log("Password reset response data:", data);

      toast({
        title: "Success",
        description: data.msg || "Your password has been successfully reset. You can now log in with your new password.",
      });
      onClose(); // Fecha o modal após sucesso
    } catch (err) {
      console.error("Detailed error in handlePasswordSubmit:", err);
      setError(err instanceof Error ? err.message : "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1D2E] border-gray-800 text-white sm:max-w-[425px] rounded-lg shadow-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Reset Password</DialogTitle>
            <Button variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400">
            {step === "email" && "Enter your email address to receive a code for resetting your password."}
            {step === "code" && "Enter the code sent to your email to proceed."}
            {step === "password" && "Create and confirm your new password to complete the reset."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={step === "email" ? handleEmailSubmit : step === "code" ? handleCodeSubmit : handlePasswordSubmit}
          className="space-y-4"
        >
          {step === "email" && (
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#131629] border-gray-800 text-white"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
          )}

          {step === "code" && (
            <div className="space-y-2">
              <Label htmlFor="reset-code">Verification Code</Label>
              <Input
                id="reset-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-[#131629] border-gray-800 text-white"
                placeholder="Enter the 6-digit code"
                disabled={isLoading}
              />
            </div>
          )}

          {step === "password" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-[#131629] border-gray-800 text-white"
                  placeholder="Enter your new password"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#131629] border-gray-800 text-white"
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : step === "email" ? "Send Code" : step === "code" ? "Verify Code" : "Reset Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
