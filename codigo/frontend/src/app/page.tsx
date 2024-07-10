"use client"
import Image from "next/image";
import child from "@/assets/child_3.svg";
import { Separator } from "@/components/ui/separator";
import VLibrasComponent from "./vlibras";
import { FaBook, FaGamepad, FaMusic } from "react-icons/fa"; // Adicione os ícones que desejar
import { Navbar } from "@/components/navbar/navbar";

// Definindo o componente Home
export default function Home() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-around">
        <Navbar />
        <div>
          <Image
            src={child}
            alt="Child"
            className="w-[800px] h-[800px]"
          />
        </div>
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-[#8C7B3A] font-black text-7xl">
              GAMER
            </h1>
            <h2 className="text-[#8C7B3A] font-bold text-4xl">
              Adventure time
            </h2>
          </div>

          <Separator className="bg-[#F3BE00] max-w-48 h-2" />

          <div className="flex flex-col gap-8">
            <div className="max-w-lg">
              <p className="font-bold text-[#8C7B3A] text-xl">
                Terapia especializada para crianças com TEA, oferecendo suporte e desenvolvimento personalizado para um futuro brilhante.
              </p>
            </div>
            <div>
              <p className="font-bold text-[#8C7B3A] text-xl">
                Temos
              </p>
              <div className="flex gap-5 mt-5">
                <div className="flex items-center gap-2 bg-[#F3BE00] text-black font-bold text-xl p-5 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                  <FaBook />
                  História
                </div>
                <div className="flex items-center gap-2 bg-[#F3BE00] text-black font-bold text-xl p-5 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                  <FaGamepad />
                  Games
                </div>
                <div className="flex items-center gap-2 bg-[#F3BE00] text-black font-bold text-xl p-5 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                  <FaMusic />
                  Sons
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <VLibrasComponent forceOnload />
    </>
  );
}
