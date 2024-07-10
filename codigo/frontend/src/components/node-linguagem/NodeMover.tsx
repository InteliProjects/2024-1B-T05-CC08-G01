import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeMover(props: NodeProps) {
  const data = props.data || { ref: 0, dx: 0, dy: 0, code: "" };
  const [ref, setRef] = useState(data.ref);
  const [dx, setDx] = useState(data.dx);
  const [dy, setDy] = useState(data.dy);

  const handleInputChange = (event: any, setter: Function, key: string) => {
    const value = event.target.value;
    setter(value);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, [key]: value, code: `mover(${ref}, ${dx}, ${dy});` });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-yellow-500 rounded w-[300px] h-[150px] text-center text-white text-xl p-4">
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
      <p>mover</p>
      <input
        type="number"
        value={ref}
        onChange={(e) => handleInputChange(e, setRef, "ref")}
        placeholder="Ref"
        className="mt-2 p-1 rounded text-black"
      />
      <input
        type="number"
        value={dx}
        onChange={(e) => handleInputChange(e, setDx, "dx")}
        placeholder="DX"
        className="mt-2 p-1 rounded text-black"
      />
      <input
        type="number"
        value={dy}
        onChange={(e) => handleInputChange(e, setDy, "dy")}
        placeholder="DY"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeMover;
