import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeConfiguracaoInicial(props: NodeProps) {
  const data = props.data || { cor: "", variaveisNumero: "", variaveisBinario: "", code: "" };
  const [cor, setCor] = useState(data.cor);
  const [variaveisNumero, setVariaveisNumero] = useState(data.variaveisNumero);
  const [variaveisBinario, setVariaveisBinario] = useState(data.variaveisBinario);

  const handleInputChange = (event: any, setter: Function, key: string) => {
    const value = event.target.value;
    setter(value);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({
        ...props.data,
        [key]: value,
        code: `var \n    numero ${variaveisNumero};\n    binario ${variaveisBinario};\n{\n    inicializar_com_cor("${cor}");\n`
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-teal-500 rounded w-[300px] h-[250px] text-center text-white text-xl p-4">
      <Handle type="source" position={Position.Right} className="-right-5 w-3 h-3 bg-blue-400" />
      <Handle type="target" position={Position.Left} className="-left-5 w-3 h-3 bg-blue-400" />
      <p>Configuração Inicial</p>
      <input
        type="text"
        value={cor}
        onChange={(e) => handleInputChange(e, setCor, "cor")}
        placeholder="Cor"
        className="mt-2 p-1 rounded text-black"
      />
      <input
        type="text"
        value={variaveisNumero}
        onChange={(e) => handleInputChange(e, setVariaveisNumero, "variaveisNumero")}
        placeholder="Variáveis Número (r1,r2...)"
        className="mt-2 p-1 rounded text-black"
      />
      <input
        type="text"
        value={variaveisBinario}
        onChange={(e) => handleInputChange(e, setVariaveisBinario, "variaveisBinario")}
        placeholder="Variáveis Binário (c,sair...)"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeConfiguracaoInicial;
