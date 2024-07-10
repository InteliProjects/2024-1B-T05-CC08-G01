// src/components/node-tapete/Quadrado.tsx

import { NodeProps, Handle, Position } from "reactflow"; // Importa props e componentes necessários do React Flow

function Quadrado(props: NodeProps) { // Componente de nó para quadrado
  const data = props.data || { code: "quadrado" }; // Dados do nó: código padrão
  return (
    <div className="flex flex-row items-center justify-center bg-purple-500 rounded w-[150px] h-[50px] text-center text-white text-2xl p-4">
      <Handle // Handle para conexão de saída à direita
        id="right"
        type="source"
        position={Position.Right}
        className="-right-5 w-3 h-3 bg-blue-400"
      />
      <Handle // Handle para conexão de entrada à esquerda
        id="left"
        type="target"
        position={Position.Left}
        className="-left-5 w-3 h-3 bg-blue-400"
      />
      <p>Quadrado (↑)</p> {/* Rótulo do nó */}
    </div>
  );
}

export default Quadrado; // Exporta o componente de nó 'Quadrado'
