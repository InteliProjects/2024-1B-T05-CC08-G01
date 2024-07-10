"use client"
// Adicionando imports de componentes, assets, hooks e libs
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { post } from "@/api/api"
import { BaseUrlKey } from "@/api/config"
import { usePathname } from "next/navigation"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"

// Definindo o tipo de dados de uma consulta
const Consulta = z.object({
  paciente_id: z.string({
    required_error: "Campo obrigatório",
  }),
  relatorio: z.string({
    required_error: "Campo obrigatório",
  }),
  data_consulta: z.string({
    required_error: "Campo obrigatório",
  }),
})

// Definindo o tipo de dados da consulta
type Consulta = {
  id: string
  paciente_id: string
  relatorio: string
  data_consulta: string
}

// Definindo o tipo da resposta
type Response = {
  data: Consulta
}

// Definindo o componente DialogCadastroConsulta
export function DialogCadastroConsulta() {
  // Definindo o pathname para pegar o id do paciente
  const pathname = usePathname().split("/")[2]
  // Definindo o formulário para adicionar uma consulta
  const form = useForm<z.infer<typeof Consulta>>({
    resolver: zodResolver(Consulta),
    defaultValues: {
      paciente_id: pathname || "",
      relatorio: "",
      data_consulta: "",
    },
  })

  // Função para adicionar uma consulta
  async function handleSubmit(values: z.infer<typeof Consulta>) {
    try {
      const response = (await post("/consultas/", values, BaseUrlKey.BACKEND, "token")).data as Response
      const res = response.data as Consulta
      console.log("consulta criada: ", res)
      toast({
        variant: "success",
        title: "Consulta adicionada",
        description: "Consulta adicionada com sucesso",
      })
      createConsultaTratamento(res.id)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar consulta",
        description: "Erro ao adicionar consulta",
      })
      console.log(error)
    }

  }

  // Função para criar um tratamento de consulta
  async function createConsultaTratamento(consulta_id: string) {
    try {
      const response = await post(`/consulta_tratamento/`, {
        consulta_id: consulta_id,
        nome_projeto: "",
        codigo_fonte: "",
        tipo_projeto: "",      
      }, BaseUrlKey.BACKEND, "token")
      console.log(response)
      toast({
        variant: "success",
        title: "Tratamento adicionado",
        description: "Tratamento adicionado com sucesso",
      })
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar tratamento",
        description: "Erro ao adicionar tratamento",
      })
      console.log(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white rounded-full px-5 py-2 hover:bg-black">Adicionar Consulta +</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[55vh]">
        <DialogHeader>
          <DialogTitle>Adicionar Consulta</DialogTitle>
          <DialogDescription>
            Adicione aqui as informações dessa consulta.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-center items-baseline gap-4 py-4">
          <Form {...form}>
            <form id="createConsulta" onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col w-full gap-6">
              <div className="flex justify-around w-full gap-4">
                <FormField
                  control={form.control}
                  name="paciente_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-1">
                      <FormLabel className="text-right" htmlFor="paciente_id">Id paciente</FormLabel>
                      <Input disabled className="col-span-3" id="paciente_id" {...form.register("paciente_id")} />
                      <FormMessage>{form.formState.errors.paciente_id?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_consulta"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-1 py-2">
                      <FormLabel className="text-right" htmlFor="data_consulta">Data da consulta</FormLabel>
                      <Input className="col-span-3" id="data_consulta" {...form.register("data_consulta")} />
                      <FormMessage>{form.formState.errors.data_consulta?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full h-[22vh] flex justify-center items-center">
                <FormField
                  control={form.control}
                  name="relatorio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start justify-center gap-1 py-2 w-5/6">
                      <FormLabel className="text-right" htmlFor="relatorio">relatorio</FormLabel>
                      <Textarea className="resize-none" id="relatorio" rows={8} {...form.register("relatorio")} />
                      <FormMessage className="col-span-3 text-right">{form.formState.errors.relatorio?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-7">
                <Button type="submit" form="createConsulta">Adicionar</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
