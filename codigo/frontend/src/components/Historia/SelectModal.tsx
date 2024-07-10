import { useState, useEffect } from 'react';
import Image from 'next/image';

const imagesBackground = [
  { src: '/historia_imgs/backgrounds/campo_primavera.webp', symbol: '🟥', description: 'Campo na Primavera', width: 400, height: 400 },
  { src: '/historia_imgs/backgrounds/castelo_neve.webp', symbol: '🔷', description: 'Castelo de Neve', width: 400, height: 400 },
  { src: '/historia_imgs/backgrounds/cidade_doce.webp', symbol: '⭐', description: 'Cidade Doce', width: 400, height: 400 },
  { src: '/historia_imgs/backgrounds/cidade.jpg', symbol: '🟥', description: 'Cidade', width: 400, height: 400 },
  { src: '/historia_imgs/backgrounds/floresta_animais.webp', symbol: '🔷', description: 'Floresta com Animais', width: 400, height: 400 },
  { src: '/historia_imgs/backgrounds/floresta_encantada.webp', symbol: '⭐', description: 'Floresta Encantada', width: 400, height: 400 },
  { src: '/historia_imgs/backgrounds/marte.avif', symbol: '🟥', description: 'Marte', width: 400, height: 400 },
  { src: '/historia_imgs/backgrounds/praia.jpg', symbol: '🔷', description: 'Praia', width: 400, height: 400 },
];

const imagesPersonagens = [
  { src: '/historia_imgs/personagens/ariel.png', symbol: '🟥', description: 'Princesa Ariel', width: 400, height: 400 },
  { src: '/historia_imgs/personagens/bela_adormecida.webp', symbol: '🔷', description: 'Bela Adormecida', width: 400, height: 800 },
  { src: '/historia_imgs/personagens/cinderela.png', symbol: '⭐', description: 'Cinderela', width: 400, height: 400 },
  { src: '/historia_imgs/personagens/incriveis.png', symbol: '🟥', description: 'Incríveis', width: 400, height: 400 },
  { src: '/historia_imgs/personagens/monstro_sa.webp', symbol: '🔷', description: 'James P. Sullivan (Monstros SA)', width: 400, height: 400 },
  { src: '/historia_imgs/personagens/nemo.png', symbol: '⭐', description: 'Nemo', width: 400, height: 400 },
  { src: '/historia_imgs/personagens/rel-mcqueen.png', symbol: '🟥', description: 'Relâmpago Mcqueen', width: 400, height: 400 },
  { src: '/historia_imgs/personagens/woody.png', symbol: '🔷', description: 'Woody', width: 400, height: 400 },
];

const imagesObjetos = [
  { src: '/historia_imgs/objetos/aviao_brinquedo.png', symbol: '🟥', description: 'Avião de brinquedo', width: 400, height: 400 },
  { src: '/historia_imgs/objetos/chapeu-cartoon.webp', symbol: '🔷', description: 'Chapéu de Hogwarts', width: 400, height: 400 },
  { src: '/historia_imgs/objetos/foguete.png', symbol: '⭐', description: 'Foguete', width: 400, height: 400 },
  { src: '/historia_imgs/objetos/helicoptero.png', symbol: '🟥', description: 'Helicóptero', width: 400, height: 400 },
  { src: '/historia_imgs/objetos/lapis.webp', symbol: '🔷', description: 'Lápis', width: 400, height: 400 },
  { src: '/historia_imgs/objetos/pa_de_areia.webp', symbol: '⭐', description: 'Pá de areia', width: 400, height: 400 },
  { src: '/historia_imgs/objetos/pato_borracha.webp', symbol: '🟥', description: 'Pato de borracha', width: 400, height: 400 },
  { src: '/historia_imgs/objetos/pizza.webp', symbol: '🔷', description: 'Pizza', width: 400, height: 400 },
];

interface SelectModalProps {
  type: string;
  onClose: () => void;
  onSelect: (image: string, description: string) => void;
}

const SelectModal: React.FC<SelectModalProps> = ({ type, onClose, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  let images: any;
  if (type === 'background') {
    images = imagesBackground;
  } else if (type === 'personagem') {
    images = imagesPersonagens;
  } else if (type === 'objeto') {
    images = imagesObjetos;
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 3) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 3 + images.length) % images.length);
  };

  const handleImageClick = (image: string, description: string) => {
    onSelect(image, description);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          const starImage = images.find((img: any) => img.symbol === '⭐');
          if (starImage) handleImageClick(starImage.src, starImage.description);
          break;
        case ' ':
          event.preventDefault(); // Prevents the default action for the space key
          const circleImage = images.find((img: any) => img.symbol === '🔷');
          if (circleImage) handleImageClick(circleImage.src, circleImage.description);
          break;
        case 'ArrowRight': // This is the key code for right-click on some keyboards
          const cloudImage = images.find((img: any) => img.symbol === '🟥');
          if (cloudImage) handleImageClick(cloudImage.src, cloudImage.description);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [images]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">✖️</button>
        <h2 className="text-2xl font-bold mb-4">Selecionar {type}</h2>
        <div className="flex items-center justify-between">
          <button onClick={handlePrev} className="text-2xl">⬅️</button>
          <div className="flex justify-center space-x-4">
            {images.slice(currentIndex, currentIndex + 3).map((image: any, index: any) => (
              <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => handleImageClick(image.src, image.description)}>
                <div className="w-40 h-40 bg-gray-200 rounded-lg overflow-hidden">
                  <Image src={image.src} alt={`Image ${index}`} width={image.width} height={image.height} className="w-full h-full object-cover" />
                </div>
                <div className="mt-5 text-5xl">{image.symbol}</div>
              </div>
            ))}
          </div>
          <button onClick={handleNext} className="text-2xl">➡️</button>
        </div>
      </div>
    </div>
  );
};

export default SelectModal;
