"use client"
// Adicionando imports de componentes, assets, hooks e libs
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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
import { Label } from "@/components/ui/label"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { put } from "@/api/api"
import { BaseUrlKey } from "@/api/config"

import { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea"
import ButtonExportHtml from "../button-export-html/buttonExportHtml"

// Definindo o tipo de dados que será enviado
const ConsultaTratamento = z.object({
  consulta_id: z.string({
    required_error: "Campo obrigatório",
  }),
  nome_projeto: z.string({
    required_error: "Campo obrigatório",
  }),
  codigo_fonte: z.string({
    required_error: "Campo obrigatório",
  }),
  status_compilador: z.string({
    required_error: "Campo obrigatório",
  }),
  tipo_projeto: z.string({
    required_error: "Campo obrigatório",
  }),
})

// Definindo o tipo de dados que vem da API
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
interface errorSintatico {
  esperado: string
  linha: number
  status: number
  tipo: string
  valor: string
}
interface errorLexico {
  simbolo: string
  linha: number
  status: number | undefined

}

// Definindo o tipo da resposta
interface Response {
  data: Response_final

}

interface Response_final {
  data: string,
  status: string
}

// Definindo o tipo da tabela consultaTratamento
type ConsultaTratamento = {
  consulta_id: string
  nome_projeto: string
  codigo_fonte: string
  tipo_projeto: string
}

// Definindo o tipo dos dados que vem da API
interface CodigoFonteProps {
  relatorio: string
  consulta_tratamento_id: string
  codigo_fonte: string
  consulta_id: string
  nome_projeto: string
  status_compilador: string
  tipo_projeto: string
}


// Definindo o componente CodigoFonte
export function CodigoFonte(props: CodigoFonteProps) {

  // Definindo os estados
  const [listaTokens, setListaTokens] = useState<any>({})
  const [status, setStatus] = useState<number>(0)
  const [isError, setIsError] = useState<boolean>(false)
  const [errorBack, setErrorBack] = useState<any>({})
  const [errormsg, setErrormsg] = useState<string>("")
  const [block, setBlock] = useState<boolean>(true)
  const [codigoFonte, setCodigoFonte] = useState<any>("")
  // Definindo o formulário

  useEffect(() => {
    console.log("olha o camp UserEffect", listaTokens)
  }, [listaTokens, errorBack])

  const form = useForm<z.infer<typeof ConsultaTratamento>>({
    resolver: zodResolver(ConsultaTratamento),
    defaultValues: {
      consulta_id: props.consulta_id,
      nome_projeto: props.nome_projeto,
      codigo_fonte: props.codigo_fonte,
      tipo_projeto: props.tipo_projeto,
    },
  })

  // Função para enviar os dados para a API
  async function onSubmit(data: z.infer<typeof ConsultaTratamento>) {
    try {
      const response = await put(`/consulta_tratamento/${props.consulta_tratamento_id}`, {
        nome_projeto: data.nome_projeto,
        codigo_fonte: data.codigo_fonte,
        status_compilador: data.status_compilador,
        tipo_projeto: data.tipo_projeto,
      }, BaseUrlKey.BACKEND, "token")
      // console.log('post response:', response)
      const res = response.data as Response;
      const codigoFonte = res.data
      console.log(res.data)
      setListaTokens(res.data)
      setCodigoFonte(codigoFonte)
      if(response.status == 200){
        setBlock(false)
      }
      if (response.status != 200) {
        setStatus(response.status)
        setIsError(true)
        const resError = response.data as any;
        setErrorBack(resError.data)
        setErrormsg(resError.data.msn)
        console.log(resError.data.msn)
      }
      setStatus(response.status)

    } catch (error) {
      console.error('post error:', error)
    }
    console.log(errorBack, "olha o res errorrr")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-center bg-transparent text-black hover:bg-transparent underline">{props.relatorio}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] h-[90vh]">
        <DialogHeader>
          <DialogTitle>{props.nome_projeto}</DialogTitle>
        </DialogHeader>
        <main className="flex flex-col items-center justify-around pt-10">
          <div className="flex flex-col justify-around gap-10 w-4/5">
            <div className="flex">
              <div className="flex justify-between h-[60vh] items-center w-full px-10 gap-4">
                <div className="w-1/2">
                  <div className="flex gap-2 justify-center items-center pl-12">
                    <Label htmlFor="codigo_fonte" className="font-bold">ID:</Label>
                    <Input id="codigo_fonte" value={props.consulta_tratamento_id} disabled />
                  </div>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
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
                            <Input className="col-span-3" id="tipo_projeto" {...form.register("tipo_projeto")} />
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
                      <DialogFooter className="pt-7 flex justify-end">
                        <Button type="submit" className="w-32" onClick={() => {
                          setIsError(false)
                          onSubmit(form.getValues());
                        }}>Adicionar</Button>
                        <ButtonExportHtml codigoFonte={codigoFonte} block={block} />
                      </DialogFooter>
                    </form>
                  </Form>
                </div>
                <div className="flex gap-2 w-1/2 h-[56vh] p-4">
                  <Label htmlFor="codigo_fonte" className="font-bold">Output:</Label>
                  <Textarea
                    rows={16}
                    className={`col-span-3 resize-none disabled:opacity-100 disabled:cursor-text ${isError ? errorBack.status == 500 ? 'bg-red-500' : 'bg-yellow-400' : status == 200 ? 'bg-green-500' : ''}`}
                    id="codigo_fonte"
                    value={isError ? errormsg : listaTokens}
                    disabled
                  />
                </div>

              </div>
            </div>
          </div>
        </main>
        <DialogFooter className="pt-7">
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
