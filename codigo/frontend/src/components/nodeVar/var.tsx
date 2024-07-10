import { NodeProps, Handle, Position } from "reactflow"; // Importa props e componentes necessários do React Flow
import { useState, useEffect } from "react"; // Importa hooks do React

export function Var(props: NodeProps) { // Componente de nó para variável
  const data = props.data || { varName: "", value: "" }; // Dados do nó: nome da variável e valor
  const [varName, setVarName] = useState(data.varName); // Estado para o nome da variável
  const [valor, setValor] = useState(data.value); // Estado para o valor da variável

  useEffect(() => { // Atualiza os dados quando o nome ou o valor da variável mudam
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ // Atualiza os dados com o novo nome e valor da variável
        ...props.data,
        varName,
        value: valor,
        code: `var ${varName} = ${valor};`, // Define o código da variável
      });
    }
    //fazer uma condicional para verificar se esta dentro de outro nó se eles estiver ele altera no nó target
    //se não roda a logica normal
  }, [varName, valor]);

  const handleVarNameChange = (event: any) => { // Função para lidar com mudanças no nome da variável
    setVarName(event.target.value); // Atualiza o estado do nome da variável
  };

  const handleValorChange = (event: any) => { // Função para lidar com mudanças no valor da variável
    setValor(event.target.value); // Atualiza o estado do valor da variável
  };

  return (
    <div className="flex flex-col items-center justify-center bg-green-500 rounded w-[400px] h-[200px] text-center text-white text-2xl p-4">
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
      <input // Input para inserir o nome da variável
        type="text"
        value={varName}
        onChange={handleVarNameChange}
        placeholder="Enter variable name"
        className="mt-2 p-1 rounded text-black"
      />
      <p>:</p>
      <input // Input para inserir o valor da variável
        type="text"
        value={valor}
        onChange={handleValorChange}
        placeholder="Enter value"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}
