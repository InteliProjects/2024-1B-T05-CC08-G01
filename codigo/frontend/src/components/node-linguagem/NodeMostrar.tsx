import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeMostrar(props: NodeProps) {
  const data = props.data || { valor: "", code: "" };
  const [valor, setValor] = useState(data.valor);

  const handleInputChange = (event: any) => {
    const newValor = event.target.value;
    setValor(newValor);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, valor: newValor, code: `mostrar("${newValor}");` });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-green-500 rounded w-[300px] h-[150px] text-center text-white text-xl p-4">
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
      <p>mostrar</p>
      <input
        type="text"
        value={valor}
        onChange={handleInputChange}
        placeholder="Valor"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeMostrar;
