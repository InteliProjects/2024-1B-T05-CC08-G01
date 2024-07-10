import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeAleatorio(props: NodeProps) {
  const data = props.data || { min: 0, max: 100, code: "" };
  const [min, setMin] = useState(data.min);
  const [max, setMax] = useState(data.max);

  const handleInputChange = (event: any, setter: Function, key: string) => {
    const value = event.target.value;
    setter(value);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, [key]: value, code: `aleatorio(${min}, ${max});` });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-purple-500 rounded w-[300px] h-[150px] text-center text-white text-xl p-4">
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
      <p>aleatorio</p>
      <input
        type="number"
        value={min}
        onChange={(e) => handleInputChange(e, setMin, "min")}
        placeholder="Min"
        className="mt-2 p-1 rounded text-black"
      />
      <input
        type="number"
        value={max}
        onChange={(e) => handleInputChange(e, setMax, "max")}
        placeholder="Max"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeAleatorio;
