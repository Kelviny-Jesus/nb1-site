import RegistrationForm from "@/components/RegistrationForm"
import Image from "next/image"

export default function Register() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0D1117]">
      <div className="absolute top-8 left-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ICON-NUMBERONE-OFC-unscreen-2rlFGjCNaLYTMxnF8huXplEwcv1KGy.gif"
          alt="NB1 Logo"
          width={48}
          height={48}
          className="h-12 w-12"
        />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <RegistrationForm />
        </div>
      </div>
    </main>
  )
}

