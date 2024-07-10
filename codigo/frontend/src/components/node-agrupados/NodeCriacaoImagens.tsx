import { NodeProps, Handle, Position } from "reactflow";
import { useState, useEffect } from "react";

interface Imagem {
  nome: string;
  arquivo: string;
  x: number;
  y: number;
}

function NodeCriarImagem(props: NodeProps) {
  const initialData = { imagens: [] as Imagem[], code: "" };
  const data = props.data || initialData;
  const [imagens, setImagens] = useState(data.imagens || []);

  useEffect(() => {
    if (!imagens) setImagens([]);
  }, [imagens]);

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedImagens = [...imagens];
    updatedImagens[index][field] = value;
    setImagens(updatedImagens);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({
        ...props.data,
        imagens: updatedImagens,
        code: updatedImagens.map((imagem: Imagem) => `${imagem.nome}: criar_imagem("${imagem.arquivo}", ${imagem.x}, ${imagem.y});`).join('\n')
      });
    }
  };

  const addImagem = () => {
    setImagens([...imagens, { nome: "", arquivo: "", x: 0, y: 0 }]);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-purple-500 rounded w-[300px] text-center text-white text-xl p-4" style={{ minHeight: '150px' }}>
      <Handle type="source" position={Position.Right} className="-right-5 w-3 h-3 bg-blue-400" />
      <Handle type="target" position={Position.Left} className="-left-5 w-3 h-3 bg-blue-400" />
      <p>Criar Imagens</p>
      {imagens.map((imagem: Imagem, index: number) => (
        <div key={index} className="mt-2">
          <label className="text-sm text-black">Nome:</label>
          <input
            type="text"
            value={imagem.nome}
            onChange={(e) => handleInputChange(index, "nome", e.target.value)}
            placeholder={`Nome ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <label className="text-sm text-black">Arquivo:</label>
          <input
            type="text"
            value={imagem.arquivo}
            onChange={(e) => handleInputChange(index, "arquivo", e.target.value)}
            placeholder={`Arquivo ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <label className="text-sm text-black">X:</label>
          <input
            type="number"
            value={imagem.x}
            onChange={(e) => handleInputChange(index, "x", e.target.value)}
            placeholder={`X ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <label className="text-sm text-black">Y:</label>
          <input
            type="number"
            value={imagem.y}
            onChange={(e) => handleInputChange(index, "y", e.target.value)}
            placeholder={`Y ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
        </div>
      ))}
      <button onClick={addImagem} className="mt-2 bg-blue-400 text-white p-1 rounded">
        Adicionar Imagem
      </button>
    </div>
  );
}

export default NodeCriarImagem;
