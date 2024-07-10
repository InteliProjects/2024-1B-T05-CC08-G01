import { NodeProps, Handle, Position } from "reactflow"; // Importa props e componentes necessários do React Flow
import { useState, useEffect } from "react"; // Importa hooks do React

export function NodeElse(props: NodeProps) { // Componente de nó para a condição 'else'
  const data = props.data || { condition: "", dentro: "" }; // Dados do nó: condição e código interno
  const [condition, setCondition] = useState(data.condition); // Estado para a condição do 'else'

  useEffect(() => { // Atualiza o código interno quando a condição ou o código interno mudam
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ // Atualiza os dados com a nova condição e código interno
        ...props.data,
        condition,
        code: `else {${data.dentro}}`, // Define o código 'else' com o código interno
      });
    }
  }, [condition, data.dentro]);

  const handleConditionChange = (event: any) => { // Função para lidar com mudanças na condição
    setCondition(event.target.value); // Atualiza o estado da condição
  };

  return (
    <div className="flex flex-row items-center justify-center bg-violet-800 rounded w-[450px] h-[200px] text-center text-white text-2xl p-4">
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
      <p>else</p>
     
      <p></p>
    </div>
  );
}
