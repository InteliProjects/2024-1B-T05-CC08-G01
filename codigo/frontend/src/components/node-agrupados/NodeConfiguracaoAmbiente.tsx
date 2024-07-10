import { NodeProps, Handle, Position } from "reactflow";
import { useState, useEffect } from "react";

function NodeConfiguracaoInicial(props: NodeProps) {
  const initialData = { cor: "", variaveisNumero: "", variaveisBinario: "", code: "" };
  const data = props.data || initialData;
  const [cor, setCor] = useState(data.cor || "");
  const [variaveisNumero, setVariaveisNumero] = useState(data.variaveisNumero || "");
  const [variaveisBinario, setVariaveisBinario] = useState(data.variaveisBinario || "");

  useEffect(() => {
    if (!variaveisNumero) setVariaveisNumero("");
    if (!variaveisBinario) setVariaveisBinario("");
  }, [variaveisNumero, variaveisBinario]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, setter: Function, key: string) => {
    const value = event.target.value;
    setter(value);
    if (props.data && props.data.onUpdate) {
      let code = `var \n    numero ${variaveisNumero};\n    binario ${variaveisBinario};\n`;
      if (cor) {
        code += `{\n    inicializar_com_cor("${cor}");\n`;
      } else {
        code += '{\n';
      }
      props.data.onUpdate({
        ...props.data,
        [key]: value,
        code,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-teal-500 rounded w-[300px] text-center text-white text-xl p-4" style={{ minHeight: '150px' }}>
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
