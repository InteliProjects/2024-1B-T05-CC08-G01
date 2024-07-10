import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeLerBinario(props: NodeProps) {
  const data = props.data || { msg: "", code: "" };
  const [msg, setMsg] = useState(data.msg);

  const handleMsgChange = (event: any) => {
    const newMsg = event.target.value;
    setMsg(newMsg);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, msg: newMsg, code: `ler_binario("${newMsg}");` });
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
      <p>ler_binario</p>
      <input
        type="text"
        value={msg}
        onChange={handleMsgChange}
        placeholder="Digite a mensagem"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeLerBinario;
