import { NodeProps, Handle, Position } from "reactflow";
import { useState } from "react";

function NodeCriarImagem(props: NodeProps) {
  const data = props.data || { arq: "", x: 0, y: 0, code: "" };
  const [arq, setArq] = useState(data.arq);
  const [x, setX] = useState(data.x);
  const [y, setY] = useState(data.y);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setArq(result);
        if (props.data && props.data.onUpdate) {
          props.data.onUpdate({
            ...props.data,
            arq: result,
            code: `criar_imagem("${result}", ${x}, ${y});`
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (event: any, setter: Function, key: string) => {
    const value = event.target.value;
    setter(value);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({
        ...props.data,
        [key]: value,
        code: `criar_imagem("${arq}", ${x}, ${y});`
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-orange-500 rounded w-[300px] h-[250px] text-center text-white text-xl p-4">
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
      <p>criar_imagem</p>
      <input
        type="file"
        onChange={handleFileChange}
        className="mt-2 p-1 rounded text-black w-full"
      />
      <input
        type="number"
        value={x}
        onChange={(e) => handleInputChange(e, setX, "x")}
        placeholder="Coordenada X"
        className="mt-2 p-1 rounded text-black w-full"
      />
      <input
        type="number"
        value={y}
        onChange={(e) => handleInputChange(e, setY, "y")}
        placeholder="Coordenada Y"
        className="mt-2 p-1 rounded text-black w-full"
      />
    </div>
  );
}

export default NodeCriarImagem;
