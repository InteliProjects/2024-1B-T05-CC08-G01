import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeRedefinirImagem(props: NodeProps) {
  const data = props.data || { ref: 0, arq: "", x: 0, y: 0, code: "" };
  const [ref, setRef] = useState(data.ref);
  const [arq, setArq] = useState(data.arq);
  const [x, setX] = useState(data.x);
  const [y, setY] = useState(data.y);

  const handleInputChange = (event: any, setter: Function, key: string) => {
    const value = event.target.value;
    setter(value);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, [key]: value, code: `redefinir_imagem(${ref}, "${arq}", ${x}, ${y});` });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-blue-500 rounded w-[300px] h-[200px] text-center text-white text-xl p-4">
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
      <p>redefinir_imagem</p>
      <input
        type="number"
        value={ref}
        onChange={(e) => handleInputChange(e, setRef, "ref")}
        placeholder="Ref"
        className="mt-2 p-1 rounded text-black"
      />
      <input
        type="text"
        value={arq}
        onChange={(e) => handleInputChange(e, setArq, "arq")}
        placeholder="Arquivo"
        className="mt-2 p-1 rounded text-black"
      />
      <input
        type="number"
        value={x}
        onChange={(e) => handleInputChange(e, setX, "x")}
        placeholder="X"
        className="mt-2 p-1 rounded text-black"
      />
      <input
        type="number"
        value={y}
        onChange={(e) => handleInputChange(e, setY, "y")}
        placeholder="Y"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeRedefinirImagem;
