import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeTriangulo(props: NodeProps) {
  const data = props.data || { key: "ArrowRight", code: "triangulo" };

  return (
    <div className="flex flex-row items-center justify-center bg-red-500 rounded w-[150px] h-[150px] text-center text-white text-2xl p-4">
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
      <p>Triângulo</p>
    </div>
  );
}

export default NodeTriangulo;
