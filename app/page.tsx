import LoginForm from "@/components/LoginForm";
import LanguageSelector from "@/components/LanguageSelector";
import StarryBackground from "@/components/StarryBackground";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <StarryBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ICON-NUMBERONE-OFC-unscreen-2rlFGjCNaLYTMxnF8huXplEwcv1KGy.gif"
            alt="NB1 Logo"
            width={96}
            height={96}
            className="h-24 w-24"
          />
        </div>
        <LoginForm />
      </div>
      <div className="fixed bottom-8 right-8 z-10 flex items-center space-x-4">
        <LanguageSelector />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ICON-NUMBERONE-OFC-unscreen-2rlFGjCNaLYTMxnF8huXplEwcv1KGy.gif"
          alt="NB1 Logo"
          width={64}
          height={64}
          className="h-16 w-16"
        />
      </div>
    </main>
  );
}
