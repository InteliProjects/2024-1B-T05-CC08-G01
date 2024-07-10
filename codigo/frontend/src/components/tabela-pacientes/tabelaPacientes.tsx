"use client";
// Adicionando imports de componentes, assets, hooks e libs
import { useEffect, useState } from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { get, del } from "@/api/api";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
;
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonTable from "../skeleton-table/skeletonTable";
import { BaseUrlKey } from "@/api/config";
import { toast, useToast } from "../ui/use-toast";
import { DialogEditarPaciente } from "../editar-paciente/editarPaciente";
import { DialogExcluirPaciente } from "../excluir-paciente/excluirPaciente";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

// Definindo o tipo de dados de um paciente
export type Paciente = {
  id: string;
  nome: string;
  idade: number;
  status: "ativo" | "inativo";
  terapeuta: string;
  registro: string;
  responsavel: string;
  telefone: string;
  ultima_consulta: string;
};

// Definindo o tipo da resposta
type Response = {
  data: Paciente[];
};

// Definindo as colunas da tabela


// Definindo o componente TabelaPacientes
export function TabelaPacientes() {
  const { toast } = useToast();
  // Definindo os estados da tabela
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

    // Função para deletar a consulta
    async function deletePaciente(id: string) {
      try {
        await del(`/pacientes/${id}`, BaseUrlKey.BACKEND, "token");
        toast({
          variant: "success",
          title: "Consulta excluída",
          description: "Consulta excluída com sucesso",
        });
        // Recarregar as consultas após a exclusão
        const consultas = await fetchPacientes();
        setPacientes(consultas);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao excluir a consulta",
        });
        console.error(error);
      }
    }
    
  const columns: ColumnDef<Paciente>[] = [
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
      accessorKey: "registro",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            registro
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("registro")}</div>
      ),
    },
    {
      accessorKey: "nome",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <a href={`/pacientes/${row.original.id}`}>
                <div className="first-letter text-left text-primary underline-offset-4 underline">
                  {row.getValue("nome")}
                </div>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              Clique para ver as consultas desse paciente
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
        );
      },
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "idade",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Idade
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("idade")}</div>
      ),
    },
    {
      accessorKey: "terapeuta",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Terapeuta
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("terapeuta")}</div>
      ),
    },
    {
      accessorKey: "responsavel",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Responsável
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("responsavel")}</div>
      ),
    },
    {
      accessorKey: "telefone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Telefone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("telefone")}</div>
      ),
    },
    {
      accessorKey: "ultima_consulta",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Última consulta
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("ultima_consulta") as string}
        </div>
      ),
    },
    {
      accessorKey: "editar",
      header: ({ column }) => {
        return (
          <Button variant="ghost" className="cursor-default text-center w-16">
            Editar
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-16 flex justify-center items-center text-center">
          <DialogEditarPaciente
            nome={row.original.nome}
            idade={row.original.idade}
            terapeuta={row.original.terapeuta}
            responsavel={row.original.responsavel}
            telefone={row.original.telefone}
            registro={row.original.registro}
            status={row.original.status}
            ultima_consulta={row.original.ultima_consulta}
            id={row.original.id}
          />
        </div>
      ),
    },
    {
      accessorKey: "excluir",
      header: ({ column }) => {
        return (
          <Button variant="ghost" className="cursor-default text-center w-16">
            Excluir
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-16 flex justify-center items-center text-center">
          <DialogExcluirPaciente
            delete={() => {
              deletePaciente(row.original.id)
            }}
          />
        </div>
      ),
    }
  ];

  // Função para buscar os pacientes

  async function fetchPacientes(): Promise<Paciente[]> {
    try {
      const response = await get("/pacientes/", BaseUrlKey.BACKEND, "");
      const res = response.data as Response;
      toast({
        variant: "success",
        title: "Pacientes carregados",
        description: "Os pacientes foram carregados com sucesso",
      });
      return res.data as Paciente[];
    } catch (error) {
      if ((error as any).response.status === 404) {
        toast({
          variant: "destructive",
          title: "Nenhum paciente cadastrado",
          description: "Não foi possível carregar os pacientes",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao carregar pacientes",
          description: "Não foi possível carregar os pacientes",
        });
      }
      console.error(error);
      return [];
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const pacientes = await fetchPacientes();
      setPacientes(pacientes);
      setLoading(false);
    };

    fetchData();

    return () => {};
  }, []);

  // Definindo a tabela
  const table = useReactTable({
    data: pacientes,
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
  });

  console.log("pós fetch", pacientes);
  return (
    <div className="w-full">
      <div className="flex items-center gap-10 py-4">
        <Input
          placeholder="Filtrar registros..."
          value={
            (table.getColumn("registro")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("registro")?.setFilterValue(event.target.value)
          }
          className="w-1/3"
          aria-label="Filtrar registro"
        />
        <Input
          placeholder="Filtrar nomes..."
          value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nome")?.setFilterValue(event.target.value)
          }
          className="w-1/3"
          aria-label="Filtrar nomes..."
        />
        <Input
          placeholder="Filtrar idades..."
          type="number"
          value={(table.getColumn("idade")?.getFilterValue() as number) ?? ""}
          onChange={(event) =>
            table.getColumn("idade")?.setFilterValue(event.target.value)
          }
          className="w-1/3"
          aria-label="Filtrar idades"
        />
        <Input
          placeholder="Filtrar terapeutas..."
          value={
            (table.getColumn("terapeuta")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("terapeuta")?.setFilterValue(event.target.value)
          }
          className="w-1/3"
          aria-label="Filtrar terapeuta"
        />
        <Input
          placeholder="Filtrar última consulta..."
          value={
            (table.getColumn("ultima_consulta")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("ultima_consulta")
              ?.setFilterValue(event.target.value)
          }
          className="w-1/3"
          aria-label="Filtrar última consulta"
        />
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
                  );
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
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="w-[10%]">
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
                  Nenhum paciente cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} paciente(s) selecionado(s).
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
  );
}
