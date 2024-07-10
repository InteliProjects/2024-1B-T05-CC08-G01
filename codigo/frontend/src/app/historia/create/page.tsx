"use client";

import { useState } from 'react';
import Image from 'next/image';
import SelectModal from '@/components/Historia/SelectModal';
import { Navbar } from '@/components/navbar/navbar';
import backgroundHistory from '@/assets/background_history.jpg';
import { useRouter } from 'next/navigation';

const API_KEY = TOKEN;

export default function CreateHistoria() {
  const router = useRouter();
  const [background, setBackground] = useState<string | null>(null);
  const [backgroundDesc, setBackgroundDesc] = useState('');
  const [personagens, setPersonagens] = useState<string[]>([]);
  const [personagensDesc, setPersonagensDesc] = useState<string[]>([]);
  const [objetos, setObjetos] = useState<string[]>([]);
  const [objetosDesc, setObjetosDesc] = useState<string[]>([]);
  const [contexto, setContexto] = useState('');
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [storyText, setStoryText] = useState('');

  const handleSelectClick = (type: string) => {
    setModalType(type);
    setShowSelectModal(true);
  };

  const handleSelectImage = (image: string, description: string) => {
    setShowSelectModal(false);
    if (modalType === 'background') {
      setBackground(image);
      setBackgroundDesc(description);
    } else if (modalType === 'personagem') {
      setPersonagens([...personagens, image]);
      setPersonagensDesc([...personagensDesc, description]);
    } else if (modalType === 'objeto') {
      setObjetos([...objetos, image]);
      setObjetosDesc([...objetosDesc, description]);
    }
  };

  const handleRemoveImage = (type: string, index: number) => {
    if (type === 'background') {
      setBackground(null);
      setBackgroundDesc('');
    } else if (type === 'personagem') {
      setPersonagens(personagens.filter((_, i) => i !== index));
      setPersonagensDesc(personagensDesc.filter((_, i) => i !== index));
    } else if (type === 'objeto') {
      setObjetos(objetos.filter((_, i) => i !== index));
      setObjetosDesc(objetosDesc.filter((_, i) => i !== index));
    }
  };

  const handleGenerateStory = async () => {
    console.log('Gerando história...');
    const prompt = generatePrompt();
    console.log('Prompt:', prompt);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Você é um escritor de histórias infantis.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      
      console.log('Resposta da API:', data);

      if (data.choices && data.choices[0]) {
        const story = data.choices[0].message.content;
        setStoryText(story);
        console.log('História gerada:', story);

        // Transformando story em json

        const audioResponse = await generateAudio(story);

        if (audioResponse) {
          const query = new URLSearchParams({
            story: story,
            audioUrl: audioResponse,
            background: background || '',
            backgroundDesc: backgroundDesc,
            personagens: JSON.stringify(personagens),
            personagensDesc: JSON.stringify(personagensDesc),
            objetos: JSON.stringify(objetos),
            objetosDesc: JSON.stringify(objetosDesc)
          });
        
          // Navegar para /historia/continue com a história e URL do áudio
          router.push(`/historia/continue?${query.toString()}`);
        } else {
          console.error('Erro ao gerar o URL do áudio');
        }
      } else {
        console.error('Erro ao gerar a história:', data);
      }
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
    }
  };
  const generateAudio = async (text: string) => {
    const apiKey = APITOKEN;
    try {
      console.log('Tentando gerar áudio...')
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ 
          input: text,
          voice: 'nova',
          model: 'tts-1'}),
      });

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      console.log('Resposta da API de áudio:', audioUrl);
      return audioUrl;
    } catch (error) {
      console.error('Erro ao gerar áudio:', error);
    }
  };

  const generatePrompt = () => {
    const characterDescriptions = personagensDesc.map((desc, index) => `Personagem ${index + 1}: ${desc}`).join('\n');
    const objectDescriptions = objetosDesc.map((desc, index) => `Objeto ${index + 1}: ${desc}`).join('\n');
    
    return `Você é um escritor de histórias infantis. Crie uma história infantil mágica e envolvente usando as informações fornecidas:

Background: ${backgroundDesc}

Personagens:
${characterDescriptions}

Objetos:
${objectDescriptions}

Contexto adicional: ${contexto}

A história deve ser divertida, educativa e apropriada para crianças pequenas. Inclua interações entre os personagens e detalhes visuais que aproveitem o cenário e os objetos fornecidos. A história deve ter um começo, meio e fim claros.

---

Título da história: "Aventura no ${backgroundDesc}"`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <div className="absolute inset-0">
        <Image src={backgroundHistory} alt="Background" layout="fill" objectFit="cover" className="-z-10" />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto">
          <h1 className="text-4xl font-bold mb-4 text-[#DFC566] text-center">Criar História</h1>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-[#8C7B3A]">Background</h2>
              <span onClick={() => handleSelectClick('background')} className="text-blue-500 cursor-pointer">Selecionar</span>
            </div>
            <div className="flex mt-2">
              {background && (
                <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden mr-2">
                  <Image src={background} alt="Background" width={400} height={400} className="w-full h-full object-cover" />
                  <div className="text-center mt-2 text-xs">{backgroundDesc}</div>
                  <button
                    onClick={() => handleRemoveImage('background', 0)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ❌
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-[#8C7B3A]">Personagens</h2>
              <span onClick={() => handleSelectClick('personagem')} className="text-blue-500 cursor-pointer">Selecionar</span>
            </div>
            <div className="flex mt-2 space-x-2">
              {personagens.map((personagem, index) => (
                <div key={index} className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                  <Image src={personagem} alt={`Personagem ${index}`} width={400} height={400} className="w-full h-full object-cover" />
                  <div className="text-center mt-2 text-xs">{personagensDesc[index]}</div>
                  <button
                    onClick={() => handleRemoveImage('personagem', index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-[#8C7B3A]">Objetos (opcional)</h2>
              <span onClick={() => handleSelectClick('objeto')} className="text-blue-500 cursor-pointer">Selecionar</span>
            </div>
            <div className="flex mt-2 space-x-2">
              {objetos.map((objeto, index) => (
                <div key={index} className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                  <Image src={objeto} alt={`Objeto ${index}`} width={400} height={400} className="w-full h-full object-cover" />
                  <div className="text-center mt-2 text-xs">{objetosDesc[index]}</div>
                  <button
                    onClick={() => handleRemoveImage('objeto', index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2 text-[#8C7B3A]">Contexto</h2>
            <textarea value={contexto} onChange={(e) => setContexto(e.target.value)} className="w-full p-2 border rounded" rows={4}></textarea>
          </div>
          <button onClick={handleGenerateStory} className="w-full px-4 py-2 bg-[#88B271] text-white rounded-lg">Gerar</button>
        </div>
      </div>

      {showSelectModal && <SelectModal type={modalType} onClose={() => setShowSelectModal(false)} onSelect={handleSelectImage} />}
    </div>
    </div>

  );
}
