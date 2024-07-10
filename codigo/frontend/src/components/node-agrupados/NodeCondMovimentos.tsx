import { NodeProps, Handle, Position } from "reactflow";
import { useState, useEffect } from "react";

interface Movimento {
  figura: string;
  dx: number;
  dy: number;
}

interface Condicao {
  valor: number;
  movimento: Movimento;
}

function NodeCondicoesMovimento(props: NodeProps) {
  const initialData = { condicoes: [] as Condicao[], code: "" };
  const data = props.data || initialData;
  const [condicoes, setCondicoes] = useState(data.condicoes || []);

  useEffect(() => {
    if (!condicoes) setCondicoes([]);
  }, [condicoes]);

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedCondicoes = [...condicoes];
    const fields = field.split('.');
    if (fields.length > 1) {
      updatedCondicoes[index][fields[0]][fields[1]] = value;
    } else {
      updatedCondicoes[index][field] = value;
    }
    setCondicoes(updatedCondicoes);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({
        ...props.data,
        condicoes: updatedCondicoes,
        code: "lerT : consultar();\n" +
              updatedCondicoes.map((cond: Condicao) => `se (lerT = ${cond.valor}) { mover(${cond.movimento.figura}, ${cond.movimento.dx}, ${cond.movimento.dy}); }`).join('\n')
      });
    }
  };

  const addCondicao = () => {
    setCondicoes([...condicoes, { valor: 0, movimento: { figura: "", dx: 0, dy: 0 } }]);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-yellow-500 rounded w-[300px] text-center text-white text-xl p-4" style={{ minHeight: '150px' }}>
      <Handle type="source" position={Position.Right} className="-right-5 w-3 h-3 bg-blue-400" />
      <Handle type="target" position={Position.Left} className="-left-5 w-3 h-3 bg-blue-400" />
      <p>Condições de Movimento</p>
      {condicoes.map((cond: Condicao, index: number) => (
        <div key={index} className="mt-2">
          <label className="text-sm text-black">Valor:</label>
          <input
            type="number"
            value={cond.valor}
            onChange={(e) => handleInputChange(index, "valor", e.target.value)}
            placeholder={`Valor ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <label className="text-sm text-black">Figura:</label>
          <input
            type="text"
            value={cond.movimento.figura}
            onChange={(e) => handleInputChange(index, "movimento.figura", e.target.value)}
            placeholder={`Figura ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <label className="text-sm text-black">DX:</label>
          <input
            type="number"
            value={cond.movimento.dx}
            onChange={(e) => handleInputChange(index, "movimento.dx", e.target.value)}
            placeholder={`DX ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <label className="text-sm text-black">DY:</label>
          <input
            type="number"
            value={cond.movimento.dy}
            onChange={(e) => handleInputChange(index, "movimento.dy", e.target.value)}
            placeholder={`DY ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
        </div>
      ))}
      <button onClick={addCondicao} className="mt-2 bg-blue-400 text-white p-1 rounded">
        Adicionar Condição
      </button>
    </div>
  );
}

export default NodeCondicoesMovimento;
