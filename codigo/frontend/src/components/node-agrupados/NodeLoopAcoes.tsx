import { NodeProps, Handle, Position } from "reactflow";
import { useState, useEffect } from "react";

interface VariavelLoop {
  nome: string;
  valor: number;
}

interface Acao {
  acao: string;
  parametros: any[];
}

function NodeLoopPrincipal(props: NodeProps) {
  const initialData = { variaveisLoop: [] as VariavelLoop[], acoes: [] as Acao[], code: "" };
  const data = props.data || initialData;
  const [variaveisLoop, setVariaveisLoop] = useState(data.variaveisLoop || []);
  const [acoes, setAcoes] = useState(data.acoes || []);

  useEffect(() => {
    if (!variaveisLoop) setVariaveisLoop([]);
    if (!acoes) setAcoes([]);
  }, [variaveisLoop, acoes]);

  const handleInputChange = (index: number, field: string, value: any, type: string) => {
    if (type === "variaveisLoop") {
      const updatedVariaveisLoop = [...variaveisLoop];
      updatedVariaveisLoop[index][field] = value;
      setVariaveisLoop(updatedVariaveisLoop);
    } else if (type === "acoes") {
      const updatedAcoes = [...acoes];
      updatedAcoes[index][field] = value;
      setAcoes(updatedAcoes);
    }
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({
        ...props.data,
        variaveisLoop,
        acoes,
        code: variaveisLoop.map((varLoop: VariavelLoop) => `${varLoop.nome}: ${varLoop.valor};`).join('\n') +
              "\nenquanto(setWhile >= 1) {\n" +
              acoes.map((acao: Acao) => `${acao.acao}(${acao.parametros.join(', ')});`).join('\n')
      });
    }
  };

  const addVariavelLoop = () => {
    setVariaveisLoop([...variaveisLoop, { nome: "", valor: 0 }]);
  };

  const addAcao = () => {
    setAcoes([...acoes, { acao: "", parametros: [] }]);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-green-500 rounded w-[300px] text-center text-white text-xl p-4" style={{ minHeight: '150px' }}>
      <Handle type="source" position={Position.Right} className="-right-5 w-3 h-3 bg-blue-400" />
      <Handle type="target" position={Position.Left} className="-left-5 w-3 h-3 bg-blue-400" />
      <p>Loop Principal</p>
      {variaveisLoop.map((varLoop: VariavelLoop, index: number) => (
        <div key={index} className="mt-2">
          <label className="text-sm text-black">Var:</label>
          <input
            type="text"
            value={varLoop.nome}
            onChange={(e) => handleInputChange(index, "nome", e.target.value, "variaveisLoop")}
            placeholder={`Nome Var ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <label className="text-sm text-black">Valor:</label>
          <input
            type="number"
            value={varLoop.valor}
            onChange={(e) => handleInputChange(index, "valor", e.target.value, "variaveisLoop")}
            placeholder={`Valor Var ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
        </div>
      ))}
      <button onClick={addVariavelLoop} className="mt-2 bg-blue-400 text-white p-1 rounded">
        Adicionar Variável
      </button>
      {acoes.map((acao: Acao, index: number) => (
        <div key={index} className="mt-2">
          <label className="text-sm text-black">Ação:</label>
          <input
            type="text"
            value={acao.acao}
            onChange={(e) => handleInputChange(index, "acao", e.target.value, "acoes")}
            placeholder={`Ação ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <label className="text-sm text-black">Parâmetros:</label>
          <input
            type="text"
            value={acao.parametros.join(", ")}
            onChange={(e) => handleInputChange(index, "parametros", e.target.value.split(", "), "acoes")}
            placeholder={`Parâmetros ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
        </div>
      ))}
      <button onClick={addAcao} className="mt-2 bg-blue-400 text-white p-1 rounded">
        Adicionar Ação
      </button>
    </div>
  );
}

export default NodeLoopPrincipal;
