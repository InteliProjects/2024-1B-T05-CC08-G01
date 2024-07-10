import { NodeProps, Handle, Position } from "reactflow";

function NodeConsultar(props: NodeProps) {
  const data = props.data || { code: "consultar(); " };

  return (
    <div className="flex flex-row items-center justify-center bg-teal-500 rounded w-[150px] h-[150px] text-center text-white text-xl p-4">
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
      <p>consultar</p>
    </div>
  );
}

export default NodeConsultar;
