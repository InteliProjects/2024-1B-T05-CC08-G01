import { NodeProps, Handle, Position } from "reactflow"; // Importa props e componentes necessários do React Flow
import { useState, useEffect } from "react"; // Importa hook de estado e de efeito do React

export function NodeWhile(props: NodeProps) { // Componente de nó para o loop while
  const data = props.data || { condition: "", dentro: "" }; // Dados do nó: condição do loop e código interno
  const [condition, setCondition] = useState(data.condition); // Estado para a condição do loop

  useEffect(() => { // Efeito para atualizar o código quando a condição ou o código interno mudam
    if (props.data && props.data.onUpdate) { // Verifica se existe uma função onUpdate nos dados do nó
      props.data.onUpdate({ // Chama a função onUpdate para atualizar o estado global
        ...props.data,
        condition, // Atualiza a condição do loop
        code: `while (${condition}) {${data.dentro}}`, // Atualiza o código com a nova condição e o código interno
      });
    }
  }, [condition, data.dentro]); // Dependências do efeito: condição do loop e código interno

  const handleConditionChange = (event: any) => { // Função para lidar com mudanças na condição do loop
    setCondition(event.target.value); // Atualiza o estado da condição do loop
  };

  return (
    <div className="flex flex-row items-center justify-center bg-red-500 rounded w-[450px] h-[200px] text-center text-white text-2xl p-4">
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
      <p>while</p> 
      <input // Input para inserir a condição do loop
        type="text"
        value={condition}
        onChange={handleConditionChange}
        placeholder="Enter condition"
        className="mt-2 p-1 rounded text-black ml-4 mr-2"
      />
      <p>:</p> 
    </div>
  );
}
