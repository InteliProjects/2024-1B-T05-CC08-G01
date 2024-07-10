"use client"
// Adicionando imports de componentes, assets, hooks e libs
import Image from "next/image";
import child from "@/assets/child_3.svg";
import { TabelaPacientes } from "@/components/tabela-pacientes/tabelaPacientes";
import { DialogCadastroPaciente } from "@/components/cadastro-paciente/cadastroPaciente";
import VLibrasComponent from "../vlibras";
import { Navbar } from "@/components/navbar/navbar";

// Definindo o componente Page
export default function Page() {
  return (
    <>
    <main className="flex flex-col min-h-screen items-center pt-32 gap-10">
      <Navbar />
      <div className="flex justify-between items-center w-4/5 p-5 pt-10 border-b-4 border-[#D9D9D9]">
        <div className="flex justify-center items-center gap-10 ">
          <h1 className="text-[#8C7B3A] font-bold text-3xl">
            Pacientes
          </h1>
          <DialogCadastroPaciente />
        </div>
        <div>
          <button className="rounded-full border-2 px-5 py-2">
            Exportar
          </button>
        </div>
      </div>
      <div className="flex justify-around gap-10 w-4/5 min-h-full">
        <div className="w-full">
          <TabelaPacientes  />
        </div>
      </div>
    </main>
    <VLibrasComponent forceOnload />
    </>
  );
}
