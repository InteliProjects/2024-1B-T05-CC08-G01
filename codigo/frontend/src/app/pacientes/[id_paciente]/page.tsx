"use client";
// Adicionando imports de componentes, assets, hooks e libs
import { TabelaConsultas } from "@/components/tabela-consultas/tabelaConsultas";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import Image from "next/image";
import preview from "@/assets/preview.svg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { post } from "@/api/api";
import { BaseUrlKey } from "@/api/config";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { DialogCadastroConsulta } from "@/components/cadastro-consulta/cadastroConsulta";
import { title } from "process";
import { useToast } from "@/components/ui/use-toast";
import { Paciente } from "@/components/tabela-pacientes/tabelaPacientes";
import { useEffect, useState } from "react";
import axios from "axios";
import VLibrasComponent from "../../vlibras";
import { Navbar } from "@/components/navbar/navbar";


// Definindo o tipo de dados que será tratado
interface Consulta_Tratamento {
  consulta_id: string;
  nome_projeto: string;
  codigo_fonte: string;
  tipo_projeto: string;
}

// Definindo o formulário
const Consulta_Tratamento = z.object({
  consulta_id: z.string(),
  nome_projeto: z.string(),
  codigo_fonte: z.string(),
  tipo_projeto: z.string(),
});
interface Paciente_Tratamento {
  data: Paciente;
}

// Definindo o componente Page
export default function Page({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [paciente, setPaciente] = useState<Paciente_Tratamento | null>(null);
  const pathname = usePathname();
  const id_paciente = pathname.split('/').pop(); // Extraindo o ID do final da URL
  console.log(id_paciente);

  async function getPacientes() {
    try {
      const response = await axios.get(`http://localhost:5000/api/pacientes/${id_paciente}`);
      setPaciente(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  console.log("paciente",paciente)
  useEffect(() => {
    getPacientes();
  }, [id_paciente]);

  return (
    <>
    <main className="flex flex-col min-h-screen items-center pt-32 gap-10">
      <Navbar />
      <div className="flex justify-between items-center w-4/5 p-5 pt-10 border-b-4 border-[#D9D9D9]">
        <div className="flex justify-center items-center gap-10 ">
          <h1 className="text-[#8C7B3A] font-bold text-3xl">
            Consultas
          </h1>
          <DialogCadastroConsulta />
        </div>
        <div>
          <button className="rounded-full border-2 px-5 py-2">
            Exportar
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-10 w-4/5">
        <div className="flex items-center w-4/5">
          <div className="p-2 w-1/5">
            <h1 className="font-bold text-xl">
              Paciente
            </h1>
            <p className="text-lg text-black border-none p-0 w-7">{paciente?.data.nome}</p>
          </div>
          <div className="p-2 w-1/5">
            <h1 className="font-bold text-xl">
              Terapeuta
            </h1>
            <p className="text-lg text-black border-none p-0 w-7">{paciente?.data.terapeuta}</p>
          </div>
          <div className="p-2 w-1/5">
            <h1 className="font-bold text-xl">
              Idade
            </h1>
            <div className="flex justify-start items-center">
                <p className="text-lg text-black border-none p-0 w-7">{paciente?.data.idade}</p>
            </div>
          </div>
          <div className="p-2 w-1/5">
            <h1 className="font-bold text-xl">
              Status
            </h1>
            <p className="text-lg text-black border-none p-0 w-7">{paciente?.data.status}</p>
          </div>
        </div>
        <div className="flex">
          <div className="w-3/5">
            <TabelaConsultas />
          </div>
          <div className="flex items-center w-2/5 px-10">
            <Image src={preview} alt="preview" />
          </div>
        </div>
      </div>
    </main>
    <VLibrasComponent forceOnload />
    </>
  );
}
