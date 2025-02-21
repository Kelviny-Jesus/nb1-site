import Image from "next/image"

export default function Logo({ className = "" }) {
  return (
    <Image
      src="/nb1-logo.svg" // Make sure to add your logo file to the public folder
      alt="NB1 Logo"
      width={200}
      height={100}
      className={className}
    />
  )
}

