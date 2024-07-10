import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeEnquanto(props: NodeProps) {
  const data = props.data || { condicao: "", code: "" };
  const [condicao, setCondicao] = useState(data.condicao);

  const handleInputChange = (event: any, setter: Function, key: string) => {
    const value = event.target.value;
    setter(value);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, [key]: value, code: `enquanto (${condicao}) { ${data.code} }` });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-green-500 rounded w-[300px] h-[150px] text-center text-white text-xl p-4">
      <Handle type="source" position={Position.Right} className="-right-5 w-3 h-3 bg-blue-400" />
      <Handle type="target" position={Position.Left} className="-left-5 w-3 h-3 bg-blue-400" />
      <p>Enquanto</p>
      <input
        type="text"
        value={condicao}
        onChange={(e) => handleInputChange(e, setCondicao, "condicao")}
        placeholder="Condição"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeEnquanto;
