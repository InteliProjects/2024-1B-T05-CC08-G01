import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeCondicional(props: NodeProps) {
  const data = props.data || { condicao: "", codeIf: "", codeElse: "", hasElse: false };
  const [condicao, setCondicao] = useState(data.condicao);
  const [hasElse, setHasElse] = useState(data.hasElse);

  const handleInputChange = (event: any, setter: Function, key: string) => {
    const value = event.target.value;
    setter(value);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, [key]: value, code: `se (${condicao}) { ${data.codeIf} } ${hasElse ? `senao { ${data.codeElse} }` : ''}` });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-blue-500 rounded w-[300px] h-[200px] text-center text-white text-xl p-4">
      <Handle type="source" position={Position.Right} className="-right-5 w-3 h-3 bg-blue-400" />
      <Handle type="target" position={Position.Left} className="-left-5 w-3 h-3 bg-blue-400" />
      <p>Condicional</p>
      <input
        type="text"
        value={condicao}
        onChange={(e) => handleInputChange(e, setCondicao, "condicao")}
        placeholder="Condição"
        className="mt-2 p-1 rounded text-black"
      />
      <label className="mt-2">
        <input
          type="checkbox"
          checked={hasElse}
          onChange={() => setHasElse(!hasElse)}
        />
        Incluir bloco `&apos;senao`&apos;
      </label>
    </div>
  );
}

export default NodeCondicional;
