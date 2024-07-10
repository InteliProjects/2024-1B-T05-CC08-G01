import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeColidiu(props: NodeProps) {
  const data = props.data || { ref1: 0, ref2: 0, code: "" };
  const [ref1, setRef1] = useState(data.ref1);
  const [ref2, setRef2] = useState(data.ref2);

  const handleInputChange = (event: any, setter: Function, key: string) => {
    const value = event.target.value;
    setter(value);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, [key]: value, code: `colidiu(${ref1}, ${ref2});` });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-red-500 rounded w-[300px] h-[150px] text-center text-white text-xl p-4">
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
      <p>colidiu</p>
      <input
        type="number"
        value={ref1}
        onChange={(e) => handleInputChange(e, setRef1, "ref1")}
        placeholder="Ref 1"
        className="mt-2 p-1 rounded text-black"
      />
      <input
        type="number"
        value={ref2}
        onChange={(e) => handleInputChange(e, setRef2, "ref2")}
        placeholder="Ref 2"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeColidiu;
