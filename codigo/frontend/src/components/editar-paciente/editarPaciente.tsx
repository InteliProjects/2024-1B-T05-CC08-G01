"use client"
// Adicionando imports de componentes, assets, hooks e libs
import { Button } from "@/components/ui/button"
import { FaRegEdit } from "react-icons/fa";
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
import { put } from "@/api/api"
import { BaseUrlKey } from "@/api/config"

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "../ui/use-toast"

// Definindo o tipo de dados de um paciente
const Paciente = z.object({
  nome: z.string({
    required_error: "Campo obrigatório",
  }),
  idade: z.number({
    required_error: "Campo obrigatório",
  }),
  terapeuta: z.string({
    required_error: "Campo obrigatório",
  }),
  responsavel: z.string({
    required_error: "Campo obrigatório",
  }),
  telefone: z.string({
    required_error: "Campo obrigatório",
  }),
  registro: z.string({
    required_error: "Campo obrigatório",
  }).regex(/^\d{7}$/, "O registro deve ter exatamente 7 dígitos"),
  status: z.string({
    required_error: "Campo obrigatório",
  }),
  ultima_consulta: z.string({
    required_error: "Campo obrigatório",
  }),
})

interface PacienteProps {
  id: string
  nome: string
  idade: number
  terapeuta: string
  responsavel: string
  telefone: string
  registro: string
  status: string
  ultima_consulta: string
}


// Definindo o componente DialogEditarPaciente
export function DialogEditarPaciente(props: PacienteProps) {
  // Definindo o formulário para adicionar um paciente
  const form = useForm<z.infer<typeof Paciente>>({
    resolver: zodResolver(Paciente),
    defaultValues: {
      nome: props.nome,
      status: props.status,
      terapeuta: props.terapeuta,
      responsavel: props.responsavel,
      telefone: props.telefone,
      idade: props.idade,
      registro: props.registro,
      ultima_consulta: props.ultima_consulta,
    },
  })

  const { toast } = useToast()

  // Função para adicionar um paciente
  async function handleSubmit(values: z.infer<typeof Paciente>) {
    try {
      const response = await put(`/pacientes/${props.id}`, values, BaseUrlKey.BACKEND, "token")
      console.log(response)
      toast({
        variant: "success",
        title: "Paciente atualizado com Sucesso",
        description: "Paciente atualizado com sucesso",
      })
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar paciente",
        description: "Erro ao atualizar paciente",
      })
      console.log(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FaRegEdit className="cursor-pointer text-2xl" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar paciente</DialogTitle>
          <DialogDescription>
            Edite aqui as informações do paciente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form id="editPaciente" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right" htmlFor="nome">Nome</FormLabel>
                    <Input className="col-span-3" id="nome" {...form.register("nome")} />
                    <FormMessage className="col-span-4">{form.formState.errors.nome?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idade"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right" htmlFor="idade">Idade</FormLabel>
                    <Input className="col-span-3" id="idade" {...form.register("idade", {
                      setValueAs: (value) => Number(value),
                    })} />
                    <FormMessage className="col-span-4">{form.formState.errors.idade?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terapeuta"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right" htmlFor="terapeuta">Terapeuta Responsável</FormLabel>
                    <Input className="col-span-3" id="terapeuta" {...form.register("terapeuta")} />
                    <FormMessage className="col-span-4">{form.formState.errors.terapeuta?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right" htmlFor="responsavel">Responsável</FormLabel>
                    <Input className="col-span-3" id="responsavel" {...form.register("responsavel")} />
                    <FormMessage className="col-span-4">{form.formState.errors.responsavel?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right" htmlFor="telefone">Telefone</FormLabel>
                    <Input className="col-span-3" id="telefone" {...form.register("telefone")} />
                    <FormMessage className="col-span-4">{form.formState.errors.telefone?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registro"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right" htmlFor="registro">Registro</FormLabel>
                    <Input className="col-span-3" id="registro" {...form.register("registro")} />
                    <FormMessage className="col-span-4">{form.formState.errors.registro?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right" htmlFor="status">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="col-span-3">
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
                    <FormMessage className="col-span-4">{form.formState.errors.status?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-7">
                <Button type="submit" form="editPaciente">Editar</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
