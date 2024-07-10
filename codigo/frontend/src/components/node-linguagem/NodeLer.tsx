import { NodeProps, Handle, Position } from "reactflow";
import { useState, useEffect } from "react";

function NodeLer(props: NodeProps) {
  const data = props.data || { code: "ler();" };
  const [selectedOption, setSelectedOption] = useState(data.selectedOption || "");

  useEffect(() => {
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({
        ...props.data,
        selectedOption,
        code: `x: ${selectedOption};\ny: ler();\n\nenquanto(x != y) {\n  y: ler();\n}\n`,
      });
    }
  }, [selectedOption]);

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-red-500 rounded w-[150px] h-[150px] text-center text-white text-xl p-4">
      <Handle
        type="source"
        position={Position.Right}
        className="-right-5 w-3 h-3 bg-blue-400"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="-left-5 w-3 h-3 bg-blue-400"
      />
      <p>ler</p>
      <select
        value={selectedOption}
        onChange={handleSelectChange}
        className="mt-2 p-1 rounded text-black"
      >
        <option value="">Selecione</option>
        <option value="1">Nuvem</option>
        <option value="2">Círculo</option>
        <option value="3">Triângulo</option>
        <option value="5">Coração</option>
        <option value="5">Lua</option>
        <option value="5">Quadrado</option>
        <option value="5">Coração</option>
        <option value="4">Estrela</option>
      </select>
    </div>
  );
}

export default NodeLer;
