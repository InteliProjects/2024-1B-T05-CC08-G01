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
import { saveAs } from 'file-saver';
import { Navbar } from "@/components/navbar/navbar";

import DefaultEdge from "@/components/edges/DefaultEdge"; // Importa componente de arestas personalizado
import * as Toolbar from "@radix-ui/react-toolbar"; // Importa biblioteca de toolbar
import ShowCode from "../../components/showCode/showCode"; // Importa componente para mostrar código gerado
import VLibrasComponent from "../vlibras";
import { put, CompileResponse } from "@/api/api";
import { BaseUrlKey } from "@/api/config";

// Importa componentes de nós personalizados
import ButtonExportHtml from '@/components/button-export-html/buttonExportHtml';
import NodeColisoesIncremento from "@/components/node-agrupados/NodeColisoesIncremento";
import NodeCondicoesMovimentos from "@/components/node-agrupados/NodeCondMovimentos";
import NodeConfiguracaoAmbiente from "@/components/node-agrupados/NodeConfiguracaoAmbiente";
import NodeCriacaoImagens from "@/components/node-agrupados/NodeCriacaoImagens";
import NodeLoopAcoes from "@/components/node-agrupados/NodeLoopAcoes";
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
// import { buttonExportHTML } from "@/components/buttonExportHTML/buttonExportHTML";

// Define tipos de nós personalizados
const NODE_TYPES = {
  node_colisoes_incremento: NodeColisoesIncremento,
  node_condicoes_movimentos: NodeCondicoesMovimentos,
  node_configuracao_ambiente: NodeConfiguracaoAmbiente,
  node_criacao_imagens: NodeCriacaoImagens,
  node_loop_acoes: NodeLoopAcoes,
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
  esperar: NodeEsperar
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

  // Atualiza código gerado quando os nós mudam
  useEffect(() => {
    generateCode();
  }, [nodes]);

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
    const compiledCode = `programa "FOFUXOS"\n\n` + `var\n  numero x;\n numero y;\n` + `\n{\n`+ nodes.map((node) => node.data.code || "").join("\n") + `\n}`;
    const blob = new Blob([compiledCode], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'program.fofi');
  };

  const handleCompile = async () => {
    const compiledCode = `programa "FOFUXOS"\n\n` + `\n`+ nodes.map((node) => node.data.code || "").join("\n") + `\n}\n}`;

    console.log(compiledCode)
    try {
      const response = await put<CompileResponse>('/consulta_tratamento/edc7dced-c77a-4f6f-9bbd-b6d8af1e363f', {
        nome_projeto: "Nome do Projeto",  // Exemplo de preenchimento
        codigo_fonte: compiledCode,
        status_compilador: "algum_status",
        tipo_projeto: "algum_tipo"
      }, BaseUrlKey.BACKEND, "");
      if (response.status === 200) {
        // downloadHTML(response.data.data);
        setSourceCode(response.data.data);
        setBlockCode(false);

      } else {
        console.log('Erro na compilação:', response);
        console.error('Erro na compilação:', response.data.message);
      }
    } catch (error) {
      console.error('Falha na comunicação com o backend', error);
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
  
    const element = document.createElement('a');
    const file = new Blob([htmlContent], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = "jogo.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  
  return (
    <>
      <main className="flex flex-col min-h-screen items-center pt-10 gap-7">
        <Navbar />
        
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
            
            <Toolbar.Root className="flex flex-col items-center justify-start bg-white rounded-2xl shadow-lg border border-zinc-300 px-8 py-4 h-full">
              <Toolbar.Button className="w-24 h-24 bg-blue-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('node_configuracao_ambiente', 'configuracao_ambiente')}>
                Configuração Inicial do Ambiente
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-blue-700 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('node_criacao_imagens', 'criacao_figuras_flow')}>
                Criação de Imagens
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-green-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('node_loop_acoes', 'loop_acoes')}>
                Loop de Ações
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-blue-100 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('node_condicoes_movimentos', 'condicoes_movimentos')}>
                Condições e Movimentos
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-blue-300 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('node_colisoes_incremento', 'colisoes_incremento')}>
                Colisões e Incremento
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-green-300 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('ler', 'ler')}>
                Ler
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-green-100 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('consultar', 'consultar')}>
                Consultar
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-purple-100 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('criar_figura', 'criar_figura')}>
                Criar Figura
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-purple-300 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('criar_imagem', 'criar_imagem')}>
                Criar Imagem
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-purple-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('colidiu', 'colidiu')}>
                Colidiu
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-gray-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('limpar', 'limpar')}>
                Limpar
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-teal-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('inicializar_com_cor', 'inicializar_com_cor')}>
                Inicializar com Cor
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-teal-700 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('inicializar_com_imagem', 'inicializar_com_imagem')}>
                Inicializar com Imagem
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-pink-300 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('redefinir_figura', 'redefinir_figura')}>
                Redefinir Figura
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-pink-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('redefinir_imagem', 'redefinir_imagem')}>
                Redefinir Imagem
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-yellow-300 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('mover', 'mover')}>
                Mover
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-yellow-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('destacar', 'destacar')}>
                Destacar
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-yellow-700 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('reverter_destaque', 'reverter_destaque')}>
                Reverter Destaque
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-red-300 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('tocar', 'tocar')}>
                Tocar
              </Toolbar.Button>
              <Toolbar.Button className="w-24 h-24 bg-red-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white" onClick={() => addNode('esperar', 'esperar')}>
                Esperar
              </Toolbar.Button>
            </Toolbar.Root>
          </div>


          </div>

          
        </div>
        <button onClick={handleCompile} className="bg-blue-500 text-white p-2 rounded">
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
