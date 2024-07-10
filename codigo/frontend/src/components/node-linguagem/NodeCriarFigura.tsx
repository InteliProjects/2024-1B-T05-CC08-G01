import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeCriarFigura(props: NodeProps) {
  const data = props.data || { tipo: "", cor: "", x: 0, y: 0, tamanho: 0, code: "" };
  const [tipo, setTipo] = useState(data.tipo);
  const [cor, setCor] = useState(data.cor);
  const [x, setX] = useState(data.x);
  const [y, setY] = useState(data.y);
  const [tamanho, setTamanho] = useState(data.tamanho);

  const handleInputChange = (event: any, setter: Function, key: string) => {
    const value = event.target.value;
    setter(value);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, [key]: value, code: `criar_figura("${tipo}", "${cor}", ${x}, ${y}, ${tamanho});` });
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
      <p>criar_figura</p>
      <input
        type="text"
        value={tipo}
        onChange={(e) => handleInputChange(e, setTipo, "tipo")}
        placeholder="Tipo"
        className="mt-2 p-1 rounded text-black"
      />
      <input
        type="text"
        value={cor}
        onChange={(e) => handleInputChange(e, setCor, "cor")}
        placeholder="Cor"
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
      <input
        type="number"
        value={tamanho}
        onChange={(e) => handleInputChange(e, setTamanho, "tamanho")}
        placeholder="Tamanho"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeCriarFigura;
