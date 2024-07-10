"use client"; // Indica que este é um componente do lado do cliente
import React, { useCallback, useState, useEffect } from "react"; // Importa React e hooks
import ReactFlow, {
  Background,
  Connection,
  ConnectionMode,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow"; // Importa ReactFlow e suas funcionalidades
import "reactflow/dist/style.css"; // Importa estilos do ReactFlow
import { saveAs } from "file-saver";
import HelpIcon from "@mui/icons-material/Help";
import DefaultEdge from "@/components/edges/DefaultEdge"; // Importa componente de arestas personalizado
import * as Toolbar from "@radix-ui/react-toolbar"; // Importa biblioteca de toolbar
import ShowCode from "@/components/showCode/showCode"; // Importa componente para mostrar código gerado
import VLibrasComponent from "../../../../vlibras";
import { put, CompileResponse, get } from "@/api/api";
import { BaseUrlKey } from "@/api/config";

// Importa componentes de nós personalizados
import ButtonExportHtml from "@/components/button-export-html/buttonExportHtml";
import NodeAleatorio from "@/components/node-linguagem/NodeAleatorio";
import NodeLer from "@/components/node-linguagem/NodeLer";
import NodeLerBinario from "@/components/node-linguagem/NodeLerBinario";
import NodeLerNumero from "@/components/node-linguagem/NodeLerNumero";
import NodeConsultar from "@/components/node-linguagem/NodeConsultar";
import NodeCriarFigura from "@/components/node-linguagem/NodeCriarFigura";
import NodeCriarImagem from "@/components/node-linguagem/NodeCriarImagem";
import NodeColidiu from "@/components/node-linguagem/NodeColidiu";
import NodeLimpar from "@/components/node-linguagem/NodeLimpar";
import NodeInicializarComCor from "@/components/node-linguagem/NodeInicializarComCor";
import NodeInicializarComImagem from "@/components/node-linguagem/NodeInicializarComImagem";
import NodeRedefinirFigura from "@/components/node-linguagem/NodeRedefinirFigura";
import NodeRedefinirImagem from "@/components/node-linguagem/NodeRedefinirImagem";
import NodeMover from "@/components/node-linguagem/NodeMover";
import NodeDestacar from "@/components/node-linguagem/NodeDestacar";
import NodeReverterDestaque from "@/components/node-linguagem/NodeReverterDestaque";
import NodeTocar from "@/components/node-linguagem/NodeTocar";
import NodeEsperar from "@/components/node-linguagem/NodeEsperar";
import { CodigoFonte } from "@/components/codigo-fonte/codigo-fonte";
import { set } from "react-hook-form";
import Tooltip from "@mui/material/Tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Response } from "@/components/tabela-consultas/tabelaConsultas";
import { Consulta } from "@/components/tabela-consultas/tabelaConsultas";
// import { buttonExportHTML } from "@/components/buttonExportHTML/buttonExportHTML";
import { Navbar } from "@/components/navbar/navbar";


// Define tipos de nós personalizados
const NODE_TYPES = {
  ler_numero: NodeLerNumero,
  ler_binario: NodeLerBinario,
  ler: NodeLer,
  consultar: NodeConsultar,
  criar_figura: NodeCriarFigura,
  criar_imagem: NodeCriarImagem,
  colidiu: NodeColidiu,
  aleatorio: NodeAleatorio,
  limpar: NodeLimpar,
  inicializar_com_cor: NodeInicializarComCor,
  inicializar_com_imagem: NodeInicializarComImagem,
  redefinir_figura: NodeRedefinirFigura,
  redefinir_imagem: NodeRedefinirImagem,
  mover: NodeMover,
  destacar: NodeDestacar,
  reverter_destaque: NodeReverterDestaque,
  tocar: NodeTocar,
  esperar: NodeEsperar,
};

// Define tipo de aresta personalizada
const EDGE_TYPE = {
  default: DefaultEdge,
};

// Define nós iniciais vazios
const INITIAL_NODES = [] satisfies Node[];

export default function Codigo() {
  // Estados para edges, nodes, código gerado e imagens
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [code, setCode] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [blockCode, setBlockCode] = useState(true);
  const [consulta, setConsulta] = useState<Consulta>(); // [Consulta, setConsultas] = useState<Consulta[]>([])

  // Função para atualizar dados dos nós
  const updateNodeData = useCallback((id: string, data: any) => {
    setNodes((nds) => {
      const newNodes = nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      });
      return newNodes;
    });
  }, []);
  const pathname = usePathname().split("/")[2];
  const consulta_id = usePathname().split("/")[4];
  console.log("consulta id", consulta_id);

  // Função para buscar as consultas
  async function fetchConsultas(): Promise<Consulta[]> {
    try {
      const response = await get(
        `/consultas/paciente/${pathname}`,
        BaseUrlKey.BACKEND,
        "token"
      );
      const res = response.data as Response;
      toast({
        variant: "success",
        title: "Consultas carregadas",
        description: "Consultas carregadas com sucesso",
      });
      return res.data as Consulta[];
    } catch (error) {
      if ((error as any).response.status === 404) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não há consultas cadastradas para esse paciente",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar as consultas",
        });
      }
      console.error(error);
      return [];
    }
  }

  // Atualiza código gerado quando os nós mudam
  useEffect(() => {
    generateCode();
  }, [nodes]);

  useEffect(() => {
    const fetchData = async () => {
      const consultas = await fetchConsultas()
      const consulta = consultas.find((consulta) => consulta.consulta_id === consulta_id)
      setConsulta(consulta)
      console.log("consulta",consulta)
    }
    fetchData()
  }, [])

  // Gera código concatenando os códigos de cada nó
  const generateCode = () => {
    const codeLines = nodes.map((node) => node.data.code || "").join("\n");
    setCode(codeLines);
  };

  // Função para adicionar nodos ao fluxo
  const addNode = (type: string, code: string) => {
    const id = crypto.randomUUID();
    const newNode = {
      id,
      type,
      position: { x: 100, y: nodes.length * 100 + 50 },
      data: {
        code,
        onUpdate: (data: any) => updateNodeData(id, data),
      },
    };
    setNodes((nodes) => [...nodes, newNode]);
  };

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const handleCompile2 = () => {
    const compiledCode =
      `programa "FOFUXOS"\n\n` +
      `var\n  numero x;\n numero y;\n` +
      `\n{\n` +
      nodes.map((node) => node.data.code || "").join("\n") +
      `\n}`;
    const blob = new Blob([compiledCode], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "program.fofi");
  };

  const handleCompile = async () => {
    const compiledCode =
      `programa "FOFUXOS"\n\n` +
      `var\n  numero x;\n numero y;\n` +
      `\n{\n` +
      nodes.map((node) => node.data.code || "").join("\n") +
      `\n}`;

    try {
      const response = await put<CompileResponse>(
        `/consulta_tratamento/${consulta?.consulta_tratamento_id}`,
        {
          nome_projeto: consulta?.nome_projeto, // Exemplo de preenchimento
          codigo_fonte: compiledCode,
          status_compilador: consulta?.status_compilador,
          tipo_projeto: consulta?.tipo_projeto,
        },
        BaseUrlKey.BACKEND,
        ""
      );
      if (response.status === 200) {
        // downloadHTML(response.data.data);
        setSourceCode(response.data.data);
        setBlockCode(false);
      } else {
        console.log("Erro na compilação:", response);
        console.error("Erro na compilação:", response.data.message);
      }
    } catch (error) {
      console.error("Falha na comunicação com o backend", error);
    }
  };

  const downloadHTML = (javascriptCode: string) => {
    const htmlContent = `
  <!doctype html>
  <html lang="en">
  <head>
      <meta charset="utf-8">
      <title>Jogo Compilado</title>
  </head>
  <body>
      <script>
          ${javascriptCode}
      </script>
  </body>
  </html>
    `;

    const element = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "jogo.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <main className="flex flex-col min-h-screen items-center pt-10 gap-7">
        < Navbar />
        <div className="flex w-full h-full relative">
          <div className="flex justify-center items-center w-[100vw] h-[75vh] mt-20 border border-lg border-black border-r relative ml-4">
            <ReactFlow
              nodeTypes={NODE_TYPES}
              edgeTypes={EDGE_TYPE}
              nodes={nodes}
              edges={edges}
              onEdgesChange={onEdgesChange}
              onNodesChange={onNodesChange}
              onConnect={onConnect}
              connectionMode={ConnectionMode.Loose}
              defaultEdgeOptions={{
                type: "default",
              }}
            >
              <Background gap={12} size={2} color="#ddd" />
              <Controls />
            </ReactFlow>

            <div className="h-full overflow-y-auto">
              <Toolbar.Root className="flex flex-col items-center justify-start bg-white rounded-2xl shadow-lg border border-zinc-300 px-12 py-2 h-full">
                <Tabs
                  defaultValue="funcoes sem dados"
                  className="h-full w-52 flex flex-col justify-start items-center"
                >
                  <TabsList className="w-52">
                    <TabsTrigger
                      value="funcoes sem dados"
                      className="text-black font-bold w-1/3 text-xs"
                    >
                      Funções
                    </TabsTrigger>
                    <TabsTrigger
                      value="criar"
                      className="text-black font-bold w-1/3 text-xs"
                    >
                      Criar
                    </TabsTrigger>
                    <TabsTrigger
                      value="modificar"
                      className="text-black font-bold w-1/3 text-xs"
                    >
                      Modificar
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="funcoes sem dados"
                    className="flex flex-col justify-center items-center w-full"
                  >
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3"
                          title="A função ler() é uma função que espera até que o usuário faça alguma ação específica em um tapete ou dispositivo de entrada similar, ou seja, quando selecionado no tapete o simbolo quadrado, isso fara algo acontecer no jogo."
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>

                      <Toolbar.Button
                        className="flex items-center justify-center w-24 h-24 bg-green-300 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() => addNode("ler", "ler")}
                      >
                        Ler
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title="Ajuda: Adicione blocos de código arrastando do painel lateral para o espaço de trabalho. Conecte os blocos para criar a lógica do programa."
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-black mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() => addNode("consultar", "consultar")}
                      >
                        Consultar
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title="Ajuda: Função que limpa (remove todos os objetos) o canvas que representa a tela da aplicação. Quando colocado, todos objetos dentro da tela somem."
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-gray-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() => addNode("limpar", "limpar")}
                      >
                        Limpar
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função <code>colidiu(ref1, ref2)</code> é
                                usada para verificar se duas figuras ou imagens
                                em uma aplicação gráfica se colidiram (se
                                sobrepuseram). Aqui está uma explicação simples
                                de como ela funciona:
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Se as figuras ou imagens referenciadas por{" "}
                                <code>ref1</code> e <code>ref2</code> se
                                colidirem, a função <code>colidiu()</code>{" "}
                                retornará verdadeiro (true). Caso contrário, ela
                                retornará falso (false).
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                <code>ref1</code>: é um número que identifica a
                                primeira figura ou imagem. Este número é o
                                índice dessa figura em uma lista interna no
                                JavaScript.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                <code>ref2</code>: é um número que identifica a
                                segunda figura ou imagem. Este número é o índice
                                dessa figura em uma lista interna no JavaScript.
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-purple-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() => addNode("colidiu", "colidiu")}
                      >
                        Colidiu
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title="Ajuda: A função esperar(t) é uma função que pausa a execução do programa por um período de tempo especificado em milissegundos. Isso significa que o programa espera por t milissegundos antes de continuar executando o próximo código."
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-red-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() => addNode("esperar", "esperar")}
                      >
                        Esperar
                      </Toolbar.Button>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="criar"
                    className="flex flex-col justify-center items-center w-full"
                  >
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função{" "}
                                <code>
                                  criar_figura(tipo, cor, x, y, tamanho)
                                </code>{" "}
                                é utilizada para desenhar figuras (círculos ou
                                quadrados) em um canvas em uma aplicação
                                gráfica. Aqui está uma explicação didática e
                                resumida de como ela funciona:
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Parâmetros da Função
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                tipo: uma string que define o tipo de figura a
                                ser criada. Pode ser "circulo" ou "quadrado". Se
                                o tipo for diferente desses, a função não faz
                                nada.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                cor: uma string que define a cor da figura. Pode
                                ser qualquer valor válido de cor em JS/CSS (como
                                "red", "#FF0000", "rgb(255, 0, 0)", etc.).
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                x: um número que representa a coordenada x
                                inicial no canvas (a posição horizontal onde a
                                figura será desenhada).
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                y: um número que representa a coordenada y
                                inicial no canvas (a posição vertical onde a
                                figura será desenhada).
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                tamanho: um número que define o tamanho inicial
                                da figura. Para círculos, representa o raio;
                                para quadrados, representa o tamanho do lado.
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-purple-800 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() => addNode("criar_figura", "criar_figura")}
                      >
                        Criar Figura
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função <code>carregar_imagem(arq, x, y)</code>{" "}
                                é utilizada para carregar uma imagem no canvas
                                de uma aplicação gráfica. Aqui está uma
                                explicação didática e resumida de como ela
                                funciona:
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Parâmetros da Função
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                arq: texto com o nome do arquivo da imagem que
                                deverá ser carregada no canvas.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                x: número que representa a coordenada inicial x
                                no canvas (posição horizontal onde a imagem será
                                desenhada).
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                y: número que representa a coordenada inicial y
                                no canvas (posição vertical onde a imagem será
                                desenhada).
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                A função retorna um número que representa o
                                identificador único da imagem criada. Este
                                número é um inteiro, que corresponde ao índice
                                desta figura na lista interna da aplicação,
                                utilizada para armazenar as definições das
                                figuras criadas.
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-orange-800 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() => addNode("criar_imagem", "criar_imagem")}
                      >
                        Criar Imagem
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função <code>inicializar_com_cor(cor)</code> é
                                utilizada para modificar o plano de fundo de um
                                canvas com a cor especificada por parâmetro.
                                Aqui está uma explicação didática e resumida de
                                como ela funciona:
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Parâmetros da Função
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                cor: texto que representa a cor de fundo
                                desejada para o canvas.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Esta função não retorna nenhum valor específico,
                                pois seu propósito é modificar visualmente o
                                canvas.
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-teal-800 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() =>
                          addNode("inicializar_com_cor", "inicializar_com_cor")
                        }
                      >
                        Inicializar com Cor
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função{" "}
                                <code>inicializar_com_imagem(arq)</code> é
                                utilizada para modificar o plano de fundo de um
                                canvas carregando uma imagem especificada por
                                parâmetro. Aqui está uma explicação didática e
                                resumida de como ela funciona:
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Parâmetros da Função
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                arq: texto que representa o nome do arquivo da
                                imagem que será usada como plano de fundo do
                                canvas.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Esta função modifica visualmente o canvas para
                                exibir a imagem especificada como plano de
                                fundo.
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-yellow-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() =>
                          addNode(
                            "inicializar_com_imagem",
                            "inicializar_com_imagem"
                          )
                        }
                      >
                        Inicializar com Imagem
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função <code>tocar(arq)</code> é utilizada
                                para reproduzir imediatamente um arquivo de
                                áudio especificado pelo parâmetro{" "}
                                <code>arq</code>. Aqui está uma explicação
                                didática e resumida de como ela funciona:
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Parâmetros da Função
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                arq: texto que representa o nome do arquivo de
                                áudio que será reproduzido.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Esta função inicia a reprodução do arquivo de
                                áudio imediatamente após ser chamada.
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-red-600 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() => addNode("tocar", "tocar")}
                      >
                        Tocar
                      </Toolbar.Button>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="modificar"
                    className="flex flex-col justify-center items-center w-full"
                  >
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função{" "}
                                <code>
                                  redefinir_figura(ref, tipo, cor, x, y,
                                  tamanho)
                                </code>{" "}
                                é utilizada para modificar os atributos de uma
                                figura existente no canvas, identificada pela
                                referência <code>ref</code>. Aqui está uma
                                explicação didática e resumida de como ela
                                funciona:
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Parâmetros da Função
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                ref: referência para a figura existente que será
                                modificada. Se a referência não existir na lista
                                interna em JS, a função não faz nada.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                tipo: texto que define o tipo da figura a ser
                                modificada. Pode ser "circulo" ou "quadrado". Se
                                for diferente desses valores, a função não
                                realiza nenhuma modificação.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                cor: texto que define a cor da figura a ser
                                modificada (qualquer definição válida de cor em
                                JS/CSS).
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                x: número que representa a coordenada x inicial
                                onde a figura será reposicionada no canvas.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                y: número que representa a coordenada y inicial
                                onde a figura será reposicionada no canvas.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                tamanho: tamanho inicial da figura a ser
                                modificado. Para círculos, representa o raio;
                                para quadrados, representa o tamanho do lado.
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-pink-600 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() =>
                          addNode("redefinir_figura", "redefinir_figura")
                        }
                      >
                        Redefinir Figura
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função{" "}
                                <code>redefinir_imagem(ref, arq, x, y)</code> é
                                utilizada para modificar as propriedades de uma
                                imagem existente no canvas, identificada pela
                                referência <code>ref</code>. Aqui está uma
                                explicação didática e resumida de como ela
                                funciona:
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Parâmetros da Função
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                ref: referência para a imagem existente que será
                                modificada. Se a referência não existir na lista
                                interna em JS, a função não faz nada.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                arq: texto com o nome do arquivo da nova imagem
                                que será carregada no canvas.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                x: número que representa a coordenada x inicial
                                onde a imagem será reposicionada no canvas.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                y: número que representa a coordenada y inicial
                                onde a imagem será reposicionada no canvas.
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-green-600 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() =>
                          addNode("redefinir_imagem", "redefinir_imagem")
                        }
                      >
                        Redefinir Imagem
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função <code>mover(ref, dx, dy)</code> é
                                utilizada para mover uma figura existente no
                                canvas para uma nova posição, especificada pelos
                                deslocamentos <code>dx</code> e <code>dy</code>{" "}
                                nos eixos x e y, respectivamente. Aqui está uma
                                explicação didática e resumida de como ela
                                funciona:
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Parâmetros da Função
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                ref: referência para a figura existente que será
                                movida. Se a referência não existir na lista
                                interna em JS, a função não faz nada.
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                dx: deslocamento no eixo x. Pode ser positivo
                                (para mover para a direita) ou negativo (para
                                mover para a esquerda).
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                dy: deslocamento no eixo y. Pode ser positivo
                                (para mover para baixo) ou negativo (para mover
                                para cima).
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-blue-600 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() => addNode("mover", "mover")}
                      >
                        Mover
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função <code>destacar(ref)</code> é utilizada
                                para destacar uma figura ou imagem específica no
                                cenário, tornando todos os outros objetos
                                translúcidos. Aqui está uma explicação didática
                                e resumida de como ela funciona:
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                Parâmetros da Função
                              </Typography>
                              <Typography variant="body2" color="inherit">
                                ref: referência para a figura ou imagem que será
                                destacada. Se a referência não existir na lista
                                interna em JS, a função não faz nada.
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-yellow-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() => addNode("destacar", "destacar")}
                      >
                        Destacar
                      </Toolbar.Button>
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-col justify-center items-start w-1/3">
                        <Tooltip
                          className="flex flex-col justify-center items-start w-1/3  h-"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">Ajuda:</Typography>
                              <Typography variant="body2" color="inherit">
                                A função <code>reverter_destaque()</code> é
                                utilizada para reverter a opacidade de todos os
                                objetos (figuras ou imagens) para os níveis
                                normais (opacidade completa). Aqui está uma
                                explicação didática e resumida de como ela
                                funciona:
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          />
                        </Tooltip>
                      </div>
                      <Toolbar.Button
                        className="w-24 h-24 bg-yellow-700 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
                        onClick={() =>
                          addNode("reverter_destaque", "reverter_destaque")
                        }
                      >
                        Reverter Destaque
                      </Toolbar.Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </Toolbar.Root>
            </div>
          </div>
        </div>
        <button
          onClick={handleCompile}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Compilar
        </button>
        <ButtonExportHtml codigoFonte={sourceCode} block={blockCode} />

        <div className="flex flex-col w-[40vw] h-[80vh] ml-10 mr-10 mt-20 items-center justify-center overflow-auto">
          <ShowCode code={code} />
        </div>

        {/* Codigo fonte
        <div className="flex flex-col w-[40vw] h-[80vh] ml-10 mr-10 mt-20 items-center justify-center overflow-auto">
          <CodigoFonte code={code} />
        </div> */}

        {/* button HTML */}
        {/* <div className="flex flex-col w-[40vw] h-[80vh] ml-10 mr-10 mt-20 items-center justify-center overflow-auto">
          {buttonExportHTML(code)}
        </div> */}
      </main>
      <VLibrasComponent forceOnload />
    </>
  );
}
