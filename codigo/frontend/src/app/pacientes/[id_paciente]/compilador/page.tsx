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
import NodeIf from "@/components/nodeIf/nodeIf"; // Importa componentes de nós personalizados
import { Var } from "@/components/nodeVar/var";
import { NodeWhile } from "@/components/nodeWhile/nodeWhile";
import { NodeElse } from "@/components/nodeElse/nodeElse";
import { NodeMostrar } from "@/components/nodeMostrar/nodeMostrar"; 
import DefaultEdge from "@/components/edges/DefaultEdge"; // Importa componente de arestas personalizado
import * as Toolbar from "@radix-ui/react-toolbar"; // Importa biblioteca de toolbar
import ShowCode from "@/components/showCode/showCode"; // Importa componente para mostrar código gerado
import VLibrasComponent from "../../../vlibras";

// Importa componentes de nós personalizados
import Quadrado from "@/components/node-tapete/Quadrado"; 
import Circulo from "@/components/node-tapete/Circulo";
import Triangulo from "@/components/node-tapete/Triangulo";
import Estrela from "@/components/node-tapete/Estrela";
import Coracao from "@/components/node-tapete/Coracao";
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

// Define tipos de nós personalizados

const NODE_TYPES = {
  quadrado: Quadrado,
  circulo: Circulo,
  triangulo: Triangulo,
  estrela: Estrela,
  coracao: Coracao,
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
  const [images, setImages] = useState<string[]>([]);

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

  // Função para fazer upload de imagens
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para adicionar nodos ao fluxo
  const addNode = (type: string, code: string) => {
    const id = crypto.randomUUID();
    const newNode = {
      id,
      type,
      position: { x: 400, y: 400 },
      data: {
        code,
        onUpdate: (data: any) => updateNodeData(id, data),
      },
    };
    setNodes((nodes) => [...nodes, newNode]);
  };

  // Funções para adicionar novos tipos de nós ao fluxo
  function addIfNode() {
    const id = crypto.randomUUID();
    const newNode = {
      id,
      type: "if",
      position: { x: 400, y: 400 },
      data: {
        condition: "",
        dentro: "",
        code: "if (condition) {\n\n}",
        onUpdate: (data: any) => updateNodeData(id, data),
      },
    };
    setNodes((nodes) => [...nodes, newNode]);
  }

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const handleCompile = () => {
    const compiledCode = `programa "FOFUXOS"\n\n` + `var\n  numero x;\n numero y;\n` + `\n{\n`+ nodes.map((node) => node.data.code || "").join("\n") + `\n}`;
    const blob = new Blob([compiledCode], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'program.fofi');
  };


  return (
    <>
    
    <main className="flex flex-col min-h-screen items-center pt-10 gap-7">
      <div className="flex w-full relative">
        <div className="flex flex-col items-center mt-20">
          <h1 className="font-bold text-[20px]">Imagens</h1>
          <div className="w-full h-96 mt-4 border border-gray-300 flex flex-col items-center justify-center">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Uploaded ${index}`} className="max-w-full max-h-full my-2" />
            ))}
            <input className="" type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>
        <div className="flex justify-center items-center w-[50vw] h-[80vh] mt-20 border border-lg border-black border-r relative ml-4">
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
          <Toolbar.Root className="flex items-center justify-center absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-2xl shadow-lg border border-zinc-300 px-8 py-4">
            
            <Toolbar.Button
              className="w-24 h-24 bg-violet-500 mt-6 rounded transition-transform hover:-translate-y-4 text-white"
              onClick={() => addNode('quadrado', 'quadrado {}')}
            >
              Add Quadrado
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-blue-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => setNodes([...nodes, { id: crypto.randomUUID(), type: 'circulo', position: { x: 400, y: 400 }, data: { code: 'circulo' } }])}
            >
              Add Circulo
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-red-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => setNodes([...nodes, { id: crypto.randomUUID(), type: 'triangulo', position: { x: 400, y: 400 }, data: { code: 'triangulo' } }])}
            >
              Add Triangulo
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-yellow-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => setNodes([...nodes, { id: crypto.randomUUID(), type: 'estrela', position: { x: 400, y: 400 }, data: { code: 'estrela' } }])}
            >
              Add Estrela
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-pink-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => setNodes([...nodes, { id: crypto.randomUUID(), type: 'coracao', position: { x: 400, y: 400 }, data: { code: 'coracao' } }])}
            >
              Add Coracao
            </Toolbar.Button>


          <Toolbar.Button
              className="w-24 h-24 bg-blue-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('circulo', 'circulo')}
            >
              Add Circulo
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-red-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('triangulo', 'triangulo')}
            >
              Add Triangulo
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-yellow-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('estrela', 'estrela')}
            >
              Add Estrela
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-pink-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('coracao', 'coracao')}
            >
              Add Coracao
            </Toolbar.Button>

            {/* <Toolbar.Button
              className="w-24 h-24 bg-green-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('ler_numero', 'ler_numero')}
            >
              Ler Número
            </Toolbar.Button> */}

            {/* <Toolbar.Button
              className="w-24 h-24 bg-green-700 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('ler_binario', 'ler_binario')}
            >
              Ler Binário
            </Toolbar.Button> */}

            <Toolbar.Button
              className="w-24 h-24 bg-green-300 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('ler', 'ler')}
            >
              Ler
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-green-100 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('consultar', 'consultar')}
            >
              Consultar
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-purple-100 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('criar_figuraaaf', 'criar_figura')}
            >
              Criar Figura
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-purple-300 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('criar_imagem', 'criar_imagem')}
            >
              Criar Imagem
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-purple-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('colidiu', 'colidiu')}
            >
              Colidiu
            </Toolbar.Button>

            {/* <Toolbar.Button
              className="w-24 h-24 bg-purple-700 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('aleatorio', 'aleatorio')}
            >
              Aleatório
            </Toolbar.Button> */}

            <Toolbar.Button
              className="w-24 h-24 bg-gray-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('limpar', 'limpar')}
            >
              Limpar
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-teal-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('inicializar_com_cor', 'inicializar_com_cor')}
            >
              Inicializar com Cor
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-teal-700 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('inicializar_com_imagem', 'inicializar_com_imagem')}
            >
              Inicializar com Imagem
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-pink-300 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('redefinir_figura', 'redefinir_figura')}
            >
              Redefinir Figura
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-pink-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('redefinir_imagem', 'redefinir_imagem')}
            >
              Redefinir Imagem
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-yellow-300 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('mover', 'mover')}
            >
              Mover
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-yellow-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('destacar', 'destacar')}
            >
              Destacar
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-yellow-700 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('reverter_destaque', 'reverter_destaque')}
            >
              Reverter Destaque
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-red-300 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('tocar', 'tocar')}
            >
              Tocar
            </Toolbar.Button>

            <Toolbar.Button
              className="w-24 h-24 bg-red-500 mt-6 rounded transition-transform hover:-translate-y-4 ml-4 text-white"
              onClick={() => addNode('esperar', 'esperar')}
            >
              Esperar
            </Toolbar.Button>

          </Toolbar.Root>
        </div>
        <div className="flex flex-col w-[40vw] h-[80vh] ml-10 mr-10 mt-20 items-center justify-center overflow-auto">
          <ShowCode code={code} />
        </div>
      </div>
      <button onClick={handleCompile} className="mt-4 bg-blue-500 text-white p-2 rounded">
        Compilar
      </button>
    </main>
    <VLibrasComponent forceOnload />
    </>
  );
}