"use client"
// Adicionando imports de componentes, assets, hooks e libs
import { useEffect, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Link, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { get, del } from "@/api/api"
import { BaseUrlKey } from "@/api/config"
import SkeletonTable from "../skeleton-table/skeletonTable"
import { usePathname } from "next/navigation"
import { CodigoFonte } from "../codigo-fonte/codigo-fonte"
import { useToast } from "../ui/use-toast"
import axios from "axios"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { DialogEditarConsulta } from "../editar-consulta/editarConsulta"
import { DialogExcluirPaciente } from "../excluir-paciente/excluirPaciente"
import { title } from "process"

// Definindo o tipo de dados de uma consulta
export type Consulta = {
  consulta_tratamento_id: string
  nome_projeto: string
  consulta_id: string
  relatorio: string
  status_compilador: "sucesso" | "falha" | "pendente"
  data_consulta: string
  codigo_fonte: string
  tipo_projeto: string
}

// Definindo o tipo da resposta
export type Response = {
  data: Consulta[]
}

// Definindo o componente TabelaConsultas
export function TabelaConsultas() {
  const { toast } = useToast()

  // Função para deletar a consulta
  async function deleteConsulta(consulta_tratamento_id: string) {
    try {
      await del(`/consultas/${consulta_tratamento_id}`, BaseUrlKey.BACKEND, "token")
      toast({
        variant: "success",
        title: "Consulta excluída",
        description: "Consulta excluída com sucesso",
      })
      // Recarregar as consultas após a exclusão
      const consultas = await fetchConsultas()
      setConsultas(consultas)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir a consulta",
      })
      console.error(error)
    }
  }
  const id_paciente = usePathname().split("/")[2]
  console.log("id_paciente", id_paciente)

  // Definindo as colunas da tabela
  const columns: ColumnDef<Consulta>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nome_projeto",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome do projeto
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        // <CodigoFonte codigo_fonte={row.original.codigo_fonte} consulta_id={row.original.consulta_id} nome_projeto={row.original.nome_projeto} status_compilador={row.original.status_compilador} tipo_projeto={row.original.tipo_projeto} consulta_tratamento_id={row.original.consulta_tratamento_id} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <a href={`/pacientes/${id_paciente}/compilador/${row.original.consulta_id}`}>
                <div className="first-letter text-left text-primary underline-offset-4 underline">{row.original.nome_projeto != "" ? row.original.nome_projeto : "Nome do Projeto"}</div>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              Clique para editar o código fonte
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "relatorio",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Relatório
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
          // <div className="first-letter text-left hover:cursor-pointer">{

          // </div>
          <CodigoFonte 
            codigo_fonte={row.original.codigo_fonte} 
            consulta_id={row.original.consulta_id} 
            nome_projeto={row.original.nome_projeto} 
            status_compilador={row.original.status_compilador} 
            tipo_projeto={row.original.tipo_projeto} 
            consulta_tratamento_id={row.original.consulta_tratamento_id} 
            relatorio={((row.getValue("relatorio") as string).length > 20) ?
            (row.getValue("relatorio") as string).substring(0, 20) + "..." :
            (row.getValue("relatorio") as string).toString()} />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "data_consulta",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data da consulta
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="text-center">
          {(row.getValue("data_consulta") as string)}
        </div>
      ),
    },
    {
      accessorKey: "editar",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="cursor-default text-center w-16"
          >
            Editar
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-16 flex justify-center items-center text-center">
          <DialogEditarConsulta consulta_id={row.original.consulta_id} relatorio={row.original.relatorio} data_consulta={row.original.data_consulta} paciente_id={id_paciente}  />
        </div>
      ),
    },
    {
      accessorKey: "excluir",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="cursor-default text-center w-16"
          >
            Excluir
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="w-16 flex justify-center items-center text-center">
          <DialogExcluirPaciente delete={() => {
            deleteConsulta(row.original.consulta_id)
          }}  />
        </div>
      ),
    },
  ]

  // Definindo os estados de ordenação, filtros, visibilidade e seleção de linhas
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const path = usePathname()
  const pathname = usePathname().split("/")[2]

  // Função para buscar as consultas
  async function fetchConsultas(): Promise<Consulta[]> {
    try {
      const response = await get(`/consultas/paciente/${pathname}`, BaseUrlKey.BACKEND, "token")
      const res = response.data as Response
      toast({
        variant: "success",
        title: "Consultas carregadas",
        description: "Consultas carregadas com sucesso",
      })
      return res.data as Consulta[]
    } catch (error) {
      if ((error as any).response.status === 404) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não há consultas cadastradas para esse paciente",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar as consultas",
        })
      }
      console.error(error)
      return []
    }
  }

  // Função para buscar as consultas
  useEffect(() => {
    const fetchData = async () => {
      const consultas = await fetchConsultas()
      setConsultas(consultas)
      setLoading(false)
    }
    fetchData()

    return () => { }
  }, [])

  // Definindo a tabela
  const table = useReactTable({
    data: consultas,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center gap-10 py-4">
        <Input
          placeholder="Filtrar relatorios..."
          value={(table.getColumn("relatorio")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("relatorio")?.setFilterValue(event.target.value)
          }
          className="w-1/3"
          aria-label="Filtrar relatorios"
        />
        <Input
          placeholder="Filtrar status..."
          type="text"
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("status")?.setFilterValue(event.target.value)
          }
          className="w-1/3"
          aria-label="Filtrar status"
        />
        <Input
          placeholder="Filtrar datas..."
          value={(table.getColumn("data_consulta")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("data_consulta")?.setFilterValue(event.target.value)
          }
          className="w-1/3"
          aria-label="Filtrar dates"
        />

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead aria-label="tabela" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <SkeletonTable />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nenhuma consulta cadastrada para esse paciente.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} consultas(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}
