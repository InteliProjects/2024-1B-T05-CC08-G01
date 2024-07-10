import { NodeProps, Handle, Position } from "reactflow";
import { useState, useEffect } from "react";

function NodeInicializarComCor(props: NodeProps) {
  const data = props.data || { cor: "", code: "inicializar_com_cor();" };
  const [cor, setCor] = useState(data.cor);

  useEffect(() => {
    if (!cor && props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, code: "inicializar_com_cor();" });
    }
  }, []);

  const handleInputChange = (event: any) => {
    const newCor = event.target.value;
    setCor(newCor);
    if (props.data && props.data.onUpdate) {
      const newCode = newCor ? `inicializar_com_cor("${newCor}");` : "inicializar_com_cor();";
      props.data.onUpdate({ ...props.data, cor: newCor, code: newCode });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-teal-500 rounded w-[300px] h-[150px] text-center text-white text-xl p-4">
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
      <p>inicializar_com_cor</p>
      <input
        type="text"
        value={cor}
        onChange={handleInputChange}
        placeholder="Cor"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeInicializarComCor;
