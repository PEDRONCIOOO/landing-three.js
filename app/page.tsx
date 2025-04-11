import Image from "next/image";
import Phone3D from "./components/hero/AnimatedShowcase";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="Globoo.io logo"
          width={40}
          height={40}
          priority
        />
        <h1 className="text-3xl font-bold">Globoo</h1>
        </header>
        <Phone3D />
    </div>
  );
}
