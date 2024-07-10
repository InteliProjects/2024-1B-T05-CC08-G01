import { NodeProps, Handle, Position } from "reactflow";

function NodeReverterDestaque(props: NodeProps) {
  const data = props.data || { code: "reverter_destaque();" };

  return (
    <div className="flex flex-row items-center justify-center bg-gray-500 rounded w-[200px] h-[150px] text-center text-white text-xl p-4">
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
      <p>reverter_destaque</p>
    </div>
  );
}

export default NodeReverterDestaque;
