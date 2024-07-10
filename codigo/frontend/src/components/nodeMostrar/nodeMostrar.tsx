import { NodeProps, Handle, Position } from "reactflow"; // Importa props e componentes necessários do React Flow
import { useState } from "react"; // Importa hook de estado do React

export function NodeMostrar(props: NodeProps) { // Componente de nó para mostrar
  const data = props.data || { condition: "" }; // Dados do nó: condição para mostrar
  const [mostrar, setmostrar] = useState(data.mostrar); // Estado para o texto a ser mostrado

  const handleMostrarChange = (event: any) => { // Função para lidar com mudanças no texto a ser mostrado
    const newmostrar = event.target.value; // Obtém o novo texto
    setmostrar(newmostrar); // Atualiza o estado do texto a ser mostrado

    // Chama a função onUpdate para atualizar o estado global
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, mostrar: newmostrar, code: `mostrar(${newmostrar}):` }); // Atualiza os dados com o novo texto
    }
  };

  return (
    <div className="flex flex-row items-center justify-center bg-violet-500 rounded w-[500px] h-[200px] text-center text-white text-2xl p-4">
      <Handle // Handle para conexão de saída à direita
        id="right"
        type="source"
        position={Position.Right}
        className="-right-5 w-3 h-3 bg-blue-400"
      />
      <Handle // Handle para conexão de saída à esquerda
        id="left"
        type="source"
        position={Position.Left}
        className="-left-5 w-3 h-3 bg-blue-400"
      />
      <p>mostrar</p> 
      <input // Input para inserir o texto a ser mostrado
        type="text"
        value={mostrar}
        onChange={handleMostrarChange}
        placeholder="mostrar"
        className="mt-2 p-1 rounded text-black ml-4 mr-2"
      />
    </div>
  );
}
