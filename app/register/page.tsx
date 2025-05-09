import RegistrationForm from "@/components/RegistrationForm";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0D1117]">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="absolute left-4 lg:left-8 top-4 hidden md:block">
          <Link href="/">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ICON-NUMBERONE-OFC-unscreen-2rlFGjCNaLYTMxnF8huXplEwcv1KGy.gif"
              alt="NB1 Logo"
              width={64}
              height={64}
              className="h-16 w-16 cursor-pointer"
              priority
            />
          </Link>
        </div>
        <div className="w-full max-w-2xl relative">
          <RegistrationForm />
        </div>
      </div>
    </main>
  );
}
