import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav className="flex mx-auto items-center justify-evenly p-4 bg-white/50 text-white w-full fixed z-50 border-bottom border-gray-200 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/globoo.svg"
            alt="Globoo.io logo"
            draggable="false"
            width={140}
            height={140}
            priority
          />
          </Link>
        <ul className="flex items-center gap-4 text-gray-600 text-sm">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">Carteira</Link>
          </li>
          <li>
            <Link href="/contact">Bank</Link>
          </li>
          <li>
            <Link href="/exchange">Exchange</Link>
          </li>
          <li>
            <Link href="/contact">Escrow</Link>
          </li>
          <li>
            <Link href="/contact">Contato</Link>
          </li>
        </ul>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/login" className="bg-black text-white px-4 py-1 rounded">
            Login
          </Link>
          <Link href="/register" className="bg-white text-black px-4 py-1 rounded">
            Registrar
          </Link>
        </div>
      </nav>
    </header>
  );
}
