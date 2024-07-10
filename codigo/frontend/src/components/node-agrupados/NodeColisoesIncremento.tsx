import { NodeProps, Handle, Position } from "reactflow";
import { useState, useEffect } from "react";

interface Colisao {
  figura1: string;
  figura2: string;
  mensagem: string;
}

interface Acao {
  acao: string;
  parametros: any[];
}

interface Incremento {
  variavel: string;
  valor: number;
  condicao: string;
  acoes: Acao[];
}

function NodeColisoesIncremento(props: NodeProps) {
  const initialData = { colisoes: [] as Colisao[], incremento: { variavel: "", valor: 0, condicao: "", acoes: [] } as Incremento, code: "" };
  const data = props.data || initialData;
  const [colisoes, setColisoes] = useState(data.colisoes || []);
  const [incremento, setIncremento] = useState(data.incremento || initialData.incremento);

  useEffect(() => {
    if (!colisoes) setColisoes([]);
    if (!incremento) setIncremento(initialData.incremento);
  }, [colisoes, incremento]);

  const handleInputChange = (index: number, field: string, value: any, type: string) => {
    if (type === "colisao") {
      const updatedColisoes = [...colisoes];
      updatedColisoes[index][field] = value;
      setColisoes(updatedColisoes);
      if (props.data && props.data.onUpdate) {
        props.data.onUpdate({
          ...props.data,
          colisoes: updatedColisoes,
          code: generateCode(updatedColisoes, incremento)
        });
      }
    } else if (type === "incremento") {
      const updatedIncremento = { ...incremento, [field]: value };
      setIncremento(updatedIncremento);
      if (props.data && props.data.onUpdate) {
        props.data.onUpdate({
          ...props.data,
          incremento: updatedIncremento,
          code: generateCode(colisoes, updatedIncremento)
        });
      }
    }
  };

  const handleAcaoInputChange = (acaoIndex: number, field: string, value: any) => {
    const updatedAcoes = [...incremento.acoes];
    updatedAcoes[acaoIndex][field] = value;
    const updatedIncremento = { ...incremento, acoes: updatedAcoes };
    setIncremento(updatedIncremento);
    if (props.data && props.data.onUpdate) {
      props.data.onUpdate({
        ...props.data,
        incremento: updatedIncremento,
        code: generateCode(colisoes, updatedIncremento)
      });
    }
  };

  const generateCode = (colisoes: Colisao[], incremento: Incremento) => {
    const colisoesCode = colisoes.map((col: Colisao) => `c : colidiu(${col.figura1}, ${col.figura2}); se (c) { mostrar("${col.mensagem}"); setWhile: 0; }`).join('\n');
    const incrementoCode = `i: i + ${incremento.valor};\nse (${incremento.condicao}) {\n` +
      incremento.acoes.map((acao: Acao) => {
        if (acao.acao === 'i' && acao.parametros.length === 1) {
          return `i: ${acao.parametros[0]};`;
        }
        if (acao.acao === 'setWhile' && acao.parametros.length === 1) {
          return `setWhile: ${acao.parametros[0]};`;
        }
        return `${acao.acao}(${acao.parametros.join(', ')});`;
      }).join('\n') + "\n}";
    return colisoesCode + '\n' + incrementoCode;
  };

  const addColisao = () => {
    setColisoes([...colisoes, { figura1: "", figura2: "", mensagem: "" }]);
  };

  const addAcao = () => {
    setIncremento({ ...incremento, acoes: [...incremento.acoes, { acao: "", parametros: [] }] });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-red-500 rounded w-[300px] text-center text-white text-xl p-4" style={{ minHeight: '150px' }}>
      <Handle type="source" position={Position.Right} className="-right-5 w-3 h-3 bg-blue-400" />
      <Handle type="target" position={Position.Left} className="-left-5 w-3 h-3 bg-blue-400" />
      <p>Colisões e Incremento</p>
      {colisoes.map((col: Colisao, index: number) => (
        <div key={index} className="mt-2">
          <input
            type="text"
            value={col.figura1}
            onChange={(e) => handleInputChange(index, "figura1", e.target.value, "colisao")}
            placeholder={`Figura 1 ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <input
            type="text"
            value={col.figura2}
            onChange={(e) => handleInputChange(index, "figura2", e.target.value, "colisao")}
            placeholder={`Figura 2 ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <input
            type="text"
            value={col.mensagem}
            onChange={(e) => handleInputChange(index, "mensagem", e.target.value, "colisao")}
            placeholder={`Mensagem ${index + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
        </div>
      ))}
      <button onClick={addColisao} className="mt-2 bg-blue-400 text-white p-1 rounded">
        Adicionar Colisão
      </button>
      <div className="mt-4">
        <input
          type="text"
          value={incremento.variavel}
          onChange={(e) => handleInputChange(0, "variavel", e.target.value, "incremento")}
          placeholder="Variável"
          className="mt-1 p-1 rounded text-black"
        />
        <input
          type="number"
          value={incremento.valor}
          onChange={(e) => handleInputChange(0, "valor", e.target.value, "incremento")}
          placeholder="Valor"
          className="mt-1 p-1 rounded text-black"
        />
        <input
          type="text"
          value={incremento.condicao}
          onChange={(e) => handleInputChange(0, "condicao", e.target.value, "incremento")}
          placeholder="Condição"
          className="mt-1 p-1 rounded text-black"
        />
      </div>
      {incremento.acoes.map((acao: Acao, acaoIndex: number) => (
        <div key={acaoIndex} className="mt-2">
          <input
            type="text"
            value={acao.acao}
            onChange={(e) => handleAcaoInputChange(acaoIndex, "acao", e.target.value)}
            placeholder={`Ação ${acaoIndex + 1}`}
            className="mt-1 p-1 rounded text-black"
          />
          <input
            type="text"
            value={acao.parametros.join(", ")}
            onChange={(e) => handleAcaoInputChange(acaoIndex, "parametros", e.target.value.split(", "))}
            placeholder={`Parâmetros ${acaoIndex + 1}`}
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

export default NodeColisoesIncremento;
