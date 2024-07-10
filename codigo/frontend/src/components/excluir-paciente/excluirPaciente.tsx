"use client"
// Adicionando imports de componentes, assets, hooks e libs
import { Button } from "@/components/ui/button"
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { post } from "@/api/api"
import { BaseUrlKey } from "@/api/config"

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
  ultima_consulta: z.date({
    required_error: "Campo obrigatório",
  }),
})

interface PacienteProps {
  delete: () => void
}


// Definindo o componente DialogExcluirPaciente
export function DialogExcluirPaciente(props: PacienteProps) {
  // Definindo o formulário para adicionar um paciente
  const form = useForm<z.infer<typeof Paciente>>({
    resolver: zodResolver(Paciente),
    defaultValues: {
      nome: "",
      status: "ativo",
      terapeuta: "",
      responsavel: "",
      telefone: "",
      idade: 0,
      registro: "",
      ultima_consulta: new Date()
    },
  })

  const { toast } = useToast()

  // Função para adicionar um paciente
  async function handleSubmit(values: z.infer<typeof Paciente>) {
    try {
      const response = await post("/pacientes/", values, BaseUrlKey.BACKEND, "token")
      console.log(response)
      toast({
        variant: "success",
        title: "Paciente adicionado",
        description: "Paciente adicionado com sucesso",
      })
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar paciente",
        description: "Erro ao adicionar paciente",
      })
      console.log(error)
    }
  }

  return (
<AlertDialog>
      <AlertDialogTrigger asChild>
        <AiOutlineCloseCircle className="text-2xl cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Paciente</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir esse Paciete
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Não</AlertDialogCancel>
          <AlertDialogAction onClick={
            props.delete
          }>Sim</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
