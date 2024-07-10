import React, { useState } from 'react';
import logo from '@/assets/logo.svg';
import Image from 'next/image';
import Link from 'next/link';

export const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between h-24 bg-transparent text-black fixed top-0 w-full z-50 p-10">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Logo do site"
                className="w-40"
              />
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-2xl border-b-4 border-[#DFC566] text-black hover:text-gray-500">Home</Link>
          <Link href="/pacientes" className="font-bold text-2xl border-b-4 border-[#DFC566] text-black hover:text-gray-500 ml-4">Pacientes</Link>
          <Link href="/historia" className="font-bold text-2xl border-b-4 border-[#DFC566] text-black hover:text-gray-500 ml-4">História</Link>
          <a onClick={openModal} className="font-bold text-2xl text-black hover:text-gray-500 ml-4 cursor-pointer">Manual do Usuario</a>
          <Link href="/sobre" className="font-bold text-2xl text-black hover:text-gray-500 ml-4">Sobre/Contato</Link>
        </div>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-2/3 max-w-2xl">
            <div className="flex justify-end">
              <button onClick={closeModal} className="text-xl font-bold">X</button>
            </div>
            <div className='flex items-center justify-center font-bold text-[20px]'>
              Manual do usuário
            </div>
            <div className="mt-4">
              <iframe
                width="100%"
                height="400px"
                src="https://www.youtube.com/embed/XeT1RbtAs-c?si=lZTl4s2-od6uJ4pp"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
