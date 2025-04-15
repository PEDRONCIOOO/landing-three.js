import Hero1 from "@/app/components/hero/hero-principal/hero1";
import Hero2 from "@/app/components/hero/hero-secondary/hero2";
import Hero3 from "./components/hero/hero-terciary/hero3";

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden">
      <Hero1 />
      <Hero2 />
      <Hero3 />
    </div>
  );
}
