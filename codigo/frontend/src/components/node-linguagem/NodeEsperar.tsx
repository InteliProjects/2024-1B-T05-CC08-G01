import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeEsperar(props: NodeProps) {
  const data = props.data || { tempo: 0, code: "" };
  const [tempo, setTempo] = useState(data.tempo);

  const handleInputChange = (event: any) => {
    const newTempo = event.target.value;
    setTempo(newTempo);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({ ...props.data, tempo: newTempo, code: `esperar(${newTempo});` });
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
      <p>esperar</p>
      <input
        type="number"
        value={tempo}
        onChange={handleInputChange}
        placeholder="Tempo (ms)"
        className="mt-2 p-1 rounded text-black"
      />
    </div>
  );
}

export default NodeEsperar;
