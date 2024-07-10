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
import { post, put } from "@/api/api"
import { BaseUrlKey } from "@/api/config"
import { usePathname } from "next/navigation"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"
import { FaRegEdit } from "react-icons/fa"

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
  consulta_id: string
  paciente_id: string
  relatorio: string
  data_consulta: string
}

// Definindo o tipo da resposta
type Response = {
  data: Consulta
}

interface ConsultaProps {
  id: string
  paciente_id: string
  relatorio: string
  data_consulta: string
}

// Definindo o componente DialogEdicaoConsulta
export function DialogEditarConsulta(props: Consulta) {
  // Definindo o pathname para pegar o id do paciente
  const pathname = usePathname().split("/")[2]
  // Definindo o formulário para adicionar uma consulta
  const form = useForm<z.infer<typeof Consulta>>({
    resolver: zodResolver(Consulta),
    defaultValues: {
      paciente_id: props.paciente_id,
      relatorio: props.relatorio,
      data_consulta: props.data_consulta,
    },
  })

  // Função para adicionar uma consulta
  async function handleSubmit(values: z.infer<typeof Consulta>) {
    try {
      const response = (await put(`/consultas/${props.consulta_id}`, values, BaseUrlKey.BACKEND, "token")).data as Response
      const res = response.data as Consulta
      console.log("consulta criada: ", res)
      toast({
        variant: "success",
        title: "Consulta atualizada com sucesso",
        description: "Consulta atualizada com sucesso",
      })
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar consulta",
        description: "Erro ao atualizar consulta",
      })
      console.log(error)
    }

  }

  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FaRegEdit className="cursor-pointer text-2xl" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[55vh]">
        <DialogHeader>
          <DialogTitle>Editar Consulta</DialogTitle>
          <DialogDescription>
            Edite aqui as informações da consulta
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-center items-baseline gap-4 py-4">
          <Form {...form}>
            <form id="editConsulta" onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col w-full gap-6">
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
                <Button type="submit" form="editConsulta">Editar</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
