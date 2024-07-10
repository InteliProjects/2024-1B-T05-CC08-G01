'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SelectModal from '@/components/Historia/SelectModal';
import { Navbar } from "@/components/navbar/navbar";
import Image from 'next/image';
import backgroundHistory from '@/assets/background_history.jpg';

const API_KEY = TOKEN;

export default function ContinueHistoria() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const story = searchParams.get('story');
  const audioUrl = searchParams.get('audioUrl');
  const background = searchParams.get('background');
  const backgroundDesc = searchParams.get('backgroundDesc');
  const personagens = JSON.parse(searchParams.get('personagens') || '[]');
  const personagensDesc = JSON.parse(searchParams.get('personagensDesc') || '[]');
  const objetos = JSON.parse(searchParams.get('objetos') || '[]');
  const objetosDesc = JSON.parse(searchParams.get('objetosDesc') || '[]');
  const [detalhes, setDetalhes] = useState('');
  const [storyText, setStoryText] = useState(story || '');
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const handleSelectClick = (type: string) => {
    setModalType(type);
    setShowSelectModal(true);
  };

  const handleSelectImage = (image: string, description: string) => {
    setShowSelectModal(false);
  };

  const renderCanvas = () => {
    const canvas = document.getElementById('storyCanvas') as HTMLCanvasElement;
    if (canvas && background) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const bgImage = new window.Image();
        bgImage.src = background as string;
        bgImage.onload = () => {
          ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
          personagens.forEach((char: string, index: number) => {
            const img = new window.Image();
            img.src = char;
            img.onload = () => {
              ctx.drawImage(img, 50 * (index + 1), 50, 50, 50);
            };
          });

          objetos.forEach((obj: string, index: number) => {
            const img = new window.Image();
            img.src = obj;
            img.onload = () => {
              ctx.drawImage(img, 50 * (index + 1), 150, 50, 50);
            };
          });
        };
      }
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [background, personagens, objetos]);

  const handleContinueStory = async () => {
    const prompt = generateContinuePrompt();
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'Você é um escritor de histórias infantis.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const newStory = storyText + data.choices[0].message.content;
        setStoryText(newStory);
      } else {
        console.error('Erro ao continuar a história:', data);
      }
    } catch (error) {
      console.error('Erro ao chamar a API:', error);
    }
  };

  const generateContinuePrompt = () => {
    const characterDescriptions = personagensDesc.map((desc: string, index: number) => `Personagem ${index + 1}: ${desc}`).join('\n');
    const objectDescriptions = objetosDesc.map((desc: string, index: number) => `Objeto ${index + 1}: ${desc}`).join('\n');
    
    return `Você é um escritor de histórias infantis. Continue a história a partir do ponto onde parou, usando as informações fornecidas:

História anterior: ${storyText}

Novos detalhes:

Personagens:
${characterDescriptions}

Objetos:
${objectDescriptions}

Contexto adicional: ${detalhes}

Continue a história de forma divertida, educativa e apropriada para crianças pequenas. Inclua interações entre os personagens e detalhes visuais que aproveitem o cenário e os objetos fornecidos.`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <div className="absolute inset-0">
        <Image src={backgroundHistory} alt="Background" layout="fill" objectFit="cover" className="-z-10" />
        <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-10">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-5xl">
          <h1 className="text-4xl font-bold mb-4 text-[#DFC566] text-center">Minha História</h1>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-1/3">
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-[#8C7B3A]">Personagens (opcional)</h2>
                  <span onClick={() => handleSelectClick('personagem')} className="text-blue-500 cursor-pointer">Selecionar</span>
                </div>
                <div className="flex mt-2 space-x-2">
                  {personagens.map((personagem: string, index: number) => (
                    <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      <Image src={personagem} alt={`Personagem ${index}`} width={80} height={80} className="w-full h-full object-cover" />
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
                  {objetos.map((objeto: string, index: number) => (
                    <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      <Image src={objeto} alt={`Objeto ${index}`} width={80} height={80} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2 text-[#8C7B3A]">Mais detalhes</h2>
                <textarea value={detalhes} onChange={(e) => setDetalhes(e.target.value)} className="w-full p-2 border rounded" rows={4}></textarea>
              </div>
              <button onClick={handleContinueStory} className="w-full px-4 py-2 bg-[#88B271] text-white rounded-lg">Executar</button>
            </div>
            <div className="w-full md:w-2/3 mt-4 md:mt-0">
              <div className="border p-4 rounded-lg mb-4" style={{ minHeight: '300px' }}>
                <canvas id="storyCanvas" width={600} height={300}></canvas>
              </div>
              <audio controls className="w-full">
                <source src={audioUrl as string} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>
      </div>
      {showSelectModal && <SelectModal type={modalType} onClose={() => setShowSelectModal(false)} onSelect={handleSelectImage} />}
    </div>
    </div>
  );
}
