import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D1117] text-white">
      <div className="mb-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ICON-NUMBERONE-OFC-unscreen-2rlFGjCNaLYTMxnF8huXplEwcv1KGy.gif"
          alt="NB1 Logo"
          width={96}
          height={96}
          className="h-24 w-24"
        />
      </div>
      <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-8 text-xl">We couldn't find the page you're looking for.</p>
      <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Return to Home
      </Link>
    </div>
  )
}

