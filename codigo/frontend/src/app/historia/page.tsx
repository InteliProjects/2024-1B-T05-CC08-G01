// src/app/historia/page.tsx

'use client';

import Link from 'next/link';
import { Navbar } from "@/components/navbar/navbar";
import Image from 'next/image';
import backgroundHistory from '@/assets/background_history.jpg';
import styles from '../historia/pag.module.css';

export default function Historia() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      <div className="absolute inset-0">
        <Image src={backgroundHistory} alt="Background" layout="fill" objectFit="cover" className="-z-10" />
      <div className="flex flex-col items-center pt-24">
        <h1 className={styles.title}>
          HISTÓRIA
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center mt-60">
              <Link href="/historia/create">
          <button className="w-[300px] h-[62px] bg-white text-[#8C7B3A] border-2 border-black rounded-[20px] text-2xl font-bold transition-colors duration-300 hover:bg-[#E2D3A3] py-2">
            Criar uma história
          </button>
        </Link>
      </div>
    </div>
    </div>

  );
}
