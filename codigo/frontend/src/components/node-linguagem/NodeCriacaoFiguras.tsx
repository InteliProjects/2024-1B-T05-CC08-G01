import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeCriarFigura(props: any) {
    const [tipo, setTipo] = useState("");
    const [cor, setCor] = useState("");
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [tamanho, setTamanho] = useState(0);
  
    const handleInputChange = (setter: any, key: any, value: any) => {
      setter(value);
      if (props.data && props.data.onUpdate) {
        props.data.onUpdate({ [key]: value, code: `criar_figura("${tipo}", "${cor}", ${x}, ${y}, ${tamanho});` });
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center bg-purple-500 rounded w-[300px] h-[200px] text-center text-white text-xl p-4">
        <Handle type="source" position={Position.Right} className="-right-5 w-3 h-3 bg-blue-400" />
        <p>Criar Figura</p>
        <input type="text" value={tipo} onChange={(e) => handleInputChange(setTipo, "tipo", e.target.value)} placeholder="Tipo" className="mt-2 p-1 rounded text-black" />
        <input type="text" value={cor} onChange={(e) => handleInputChange(setCor, "cor", e.target.value)} placeholder="Cor" className="mt-2 p-1 rounded text-black" />
        <input type="number" value={x} onChange={(e) => handleInputChange(setX, "x", e.target.value)} placeholder="X" className="mt-2 p-1 rounded text-black" />
        <input type="number" value={y} onChange={(e) => handleInputChange(setY, "y", e.target.value)} placeholder="Y" className="mt-2 p-1 rounded text-black" />
        <input type="number" value={tamanho} onChange={(e) => handleInputChange(setTamanho, "tamanho", e.target.value)} placeholder="Tamanho" className="mt-2 p-1 rounded text-black" />
      </div>
    );
  }
  export default NodeCriarFigura;
  