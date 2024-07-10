import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeDestacar(props: NodeProps) {
  const data = props.data || { ref: 0, code: "" };
  const [ref, setRef] = useState(data.ref);

  const handleInputChange = (event: any) => {
    const newRef = event.target.value;
    setRef(newRef);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, ref: newRef, code: `destacar(${newRef});` });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-pink-500 rounded w-[300px] h-[150px] text-center text-white text-xl p-4">
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
      <p>destacar</p>
      <input
        type="number"
        value={ref}
        onChange={handleInputChange}
        placeholder="Ref"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeDestacar;
