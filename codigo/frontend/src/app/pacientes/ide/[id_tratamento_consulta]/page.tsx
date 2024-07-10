"use client"
// Adicionando imports de componentes, assets, hooks e libs
import { Consulta } from "@/components/tabela-consultas/tabelaConsultas";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { get, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { post } from "@/api/api";
import { BaseUrlKey } from "@/api/config";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar/navbar";


// Definindo o tipo de dados que será tratado
interface Consulta_TratamentoType {
  codigo_fonte: string
  consulta_id: string
  data_consulta: string
  idade: number
  nome: string
  nome_projeto: string
  paciente_id: string
  relatorio: string
  status: string
  status_compilador: string
  tipo_projeto: string
  ultima_consulta: string
}

// Definindo o tipo Token
interface Token {
  linha: number
  tipo: string
  valor: string
}

// Definindo o tipo da resposta
type Response = {
  data: Token[]
}

// Definindo o tipo da resposta da consulta 2
type ResponseConsulta2 = {
  data: Consulta[]
}

// Definindo tipagem dos inputs do formulario
const Consulta_Tratamento = z.object({
  consulta_id: z.string(),
  nome_projeto: z.string(),
  codigo_fonte: z.string(),
  tipo_projeto: z.string(),
})

// Definindo o componente Page
export default function Page({ params }: { params: { id: string } }) {
  // Definindo os estados
  const [listaTokens, setListaTokens] = useState<Token[]>([])
  const [consultas, setConsultas] = useState<Consulta[]>([])
  // Definindo o id do paciente
  const pathname = usePathname().split("/")[3]

  // Função para buscar as consultas
  async function fetchConsultas(): Promise<Consulta[]> {
    try {
      const response = await get(`/consultas/paciente/${pathname}`, BaseUrlKey.BACKEND, "token")
      const res = response.data as ResponseConsulta2
      return res.data as Consulta[]
    } catch (error) {
      console.error(error)
      return []
    }
  }

  // Função para buscar as consultas
  useEffect(() => {
    const fetchData = async () => {
      const consultas = await fetchConsultas()
      setConsultas(consultas)
    }
    fetchData()
    console.log("consultas", consultas)

    return () => {
    }
  }, [])

  // Definindo o formulário
  const form = useForm<z.infer<typeof Consulta_Tratamento>>({
    resolver: zodResolver(Consulta_Tratamento),
    defaultValues: {
      consulta_id: pathname,
      nome_projeto: "",
      codigo_fonte: "",
      tipo_projeto: "",
    },
  })

  // Função para enviar o formulário
  async function onSubmit(data: z.infer<typeof Consulta_Tratamento>) {
    console.log(data)
    const response = await post(`/consulta_tratamento/`, {
      ...data,
      paciente_id: pathname
    }, BaseUrlKey.BACKEND, "token")
    const res = response.data as Response;
    setListaTokens(res.data as Token[])
  }

  // Função para buscar as consultas de um paciente para teste
  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await get(`/consultas/paciente/306904ad-711a-44eb-a278-aa56f09e1197`, BaseUrlKey.BACKEND, "token")
  //     console.log(response)
  //   }
  //   fetchData()
  // }, [])

  return (
    <main className="flex flex-col min-h-screen items-center justify-around pt-10">
      <Navbar />
      <div className="flex flex-col justify-around h-[80vh] gap-10 w-4/5">
        <div className="flex justify-between w-full">
          <div className="p-2 w-3/5">
            <h1 className="font-bold text-xl">
              Paciente
            </h1>
            <Input
              className="font-semibold text-lg text-[#857F7F] border-none p-0"
              type="text"
              defaultValue={"Samuel Lucas de Almeida"}
            />
          </div>
          <div className="p-2 w-1/5">
            <h1 className="font-bold text-xl">
              Idade
            </h1>
            <div className="flex justify-start items-center">
              <Input
                className="font-semibold text-lg text-[#857F7F] border-none p-0 w-7"
                type="text"
                defaultValue={"5"}
              />
              <span className="font-semibold text-lg text-[#857F7F]">anos</span>
            </div>
          </div>
          <div className="p-2 w-1/5">
            <h1 className="font-bold text-xl">
              Status
            </h1>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex">
          <div className="flex justify-between h-[60vh] items-center w-full px-10 gap-4">
            <div className="w-1/2">
              <Form {...form}>
                <form id="createConsultaTratamento" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="nome_projeto"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right font-bold" htmlFor="nome_projeto">Nome do Projeto</FormLabel>
                        <Input className="col-span-3" id="nome_projeto" {...form.register("nome_projeto")} />
                        <FormMessage>{form.formState.errors.nome_projeto?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codigo_fonte"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-start gap-4">
                        <FormLabel className="text-right pt-2 font-bold" htmlFor="codigo_fonte">Input: </FormLabel>
                        <Textarea rows={16} className="col-span-3 resize-none" id="codigo_fonte" {...form.register("codigo_fonte")} />
                        <FormMessage>{form.formState.errors.codigo_fonte?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipo_projeto"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right font-bold" htmlFor="tipo_projeto">Tipo Projeto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Tipo Projeto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Tipo Projeto</SelectLabel>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="inativo">Inativo</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage>{form.formState.errors.tipo_projeto?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consulta_id"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right font-bold" htmlFor="consulta_id">Consulta id</FormLabel>
                        <Input disabled className="col-span-3" id="consulta_id" {...form.register("consulta_id")} />
                        <FormMessage>{form.formState.errors.consulta_id?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <div className="pt-7 flex justify-end">
                    <Button type="submit" form="createConsultaTratamento">Adicionar</Button>
                  </div>
                </form>
              </Form>
            </div>
            <div className="flex gap-2 w-1/2 h-[56vh] p-4">
              <Label htmlFor="codigo_fonte" className="font-bold">Output:</Label>
              <Textarea rows={16} className="col-span-3 resize-none" id="codigo_fonte" value={JSON.stringify(listaTokens)} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}