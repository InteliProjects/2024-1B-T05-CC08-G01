import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeInicializarComImagem(props: NodeProps) {
  const data = props.data || { arq: "", code: "" };
  const [arq, setArq] = useState(data.arq);

  const handleInputChange = (event: any) => {
    const newArq = event.target.value;
    setArq(newArq);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, arq: newArq, code: `inicializar_com_imagem("${newArq}");` });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-orange-500 rounded w-[300px] h-[150px] text-center text-white text-xl p-4">
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
      <p>inicializar_com_imagem</p>
      <input
        type="text"
        value={arq}
        onChange={handleInputChange}
        placeholder="Arquivo"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeInicializarComImagem;
