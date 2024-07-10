import { NodeProps, Handle, Position } from "reactflow"; // Importa props e componentes necessários do React Flow
import { useState, useEffect } from "react"; // Importa hooks do React

function NodeIf(props: NodeProps) { // Componente de nó para a condição 'if'
  const data = props.data || { condition: "", code: "if (condition) {\n\n}" }; // Dados do nó: condição e código padrão
  const [condition, setCondition] = useState(data.condition); // Estado para a condição do 'if'
  const [innerCode, setInnerCode] = useState(""); // Estado para o código interno do 'if'

  useEffect(() => { // Atualiza o código interno quando o código do nó muda
    const match = data.code.match(/\{([^}]*)\}/); // Encontra o código entre chaves dentro do código completo
    if (match) {
      setInnerCode(match[1]); // Atualiza o código interno com o que está entre as chaves
    }
  }, [data.code]);

  const handleConditionChange = (event: any) => { // Função para lidar com mudanças na condição
    const newCondition = event.target.value; // Obtém a nova condição do input
    setCondition(newCondition); // Atualiza o estado da condição

    if (props.data && props.data.onUpdate) { // Chama a função de atualização de dados
      props.data.onUpdate({ // Atualiza os dados com a nova condição e código interno
        ...props.data,
        condition: newCondition,
        code: `if (${newCondition}) {${innerCode}}`,
      });
    }
  };

  return (
    <div className="flex flex-row items-center justify-center bg-violet-500 rounded w-[400px] h-[200px] text-center text-white text-2xl p-4">
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
      <p>if</p> 
      <input
        type="text"
        value={condition}
        onChange={handleConditionChange} // Atualiza a condição ao digitar
        placeholder="Enter condition"
        className="mt-2 p-1 rounded text-black ml-4 mr-2"
      />
      <p>:</p>
    </div>
  );
}

export default NodeIf; // Exporta o componente de nó 'if'
