"use client";

import { useState } from 'react';

interface InsertModalProps {
  type: string;
  onClose: () => void;
}

export default function InsertModal({ type, onClose }: InsertModalProps) {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleInsert = () => {
    // Lógica para inserir a imagem
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Inserir {type}</h2>
        <input type="file" onChange={handleImageUpload} className="mb-4" />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição da imagem" className="w-full p-2 border rounded mb-4" />
        <button onClick={handleInsert} className="w-full px-4 py-2 bg-green-500 text-white rounded">Inserir</button>
        <button onClick={onClose} className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded">Fechar</button>
      </div>
    </div>
  );
}
