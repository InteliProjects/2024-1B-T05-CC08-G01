// Importações
import Image from "next/image";
import instagram from "@/assets/instagram.svg";
import whatsapp from "@/assets/whatsapp.svg";
import linkedin from "@/assets/linkedin.svg";
import site_inteli from "@/assets/site_inteli.svg";
import email_inteli from "@/assets/email_inteli.svg";
import phd from "@/assets/phd.svg";
import masqueico from "@/assets/marcos.svg";
import samusbuy from "@/assets/samuel.svg";
import tonyboy from "@/assets/tony.svg";
import yaguinho from "@/assets/yaguinho.svg";
import VLibrasComponent from "../vlibras";
import { Navbar } from "@/components/navbar/navbar";

// Definindo o componente da página de Sobre
export default function Sobre() {
  return (
    <>
    <main className="flex flex-col min-h-screen items-center pt-24 gap-7">
      <Navbar />
      <div className="flex justify-center items-center w-4/5 p-5 pt-10 border-b-4 border-[#D9D9D9]">
        <h1 className="text-[#CAAC3D] font-bold text-3xl">
          SOBRE NÓS
        </h1>
      </div>
      <section className="flex flex-col justify-around gap-6 w-4/5">
        <p className="text-lg">
          Bem-vindos ao FOFUXOS, um grupo dedicado à inovação e liderança no Instituto de Tecnologia e Liderança (Inteli). Aqui, somos preparados não apenas para liderar, mas também para enfrentar desafios reais por meio de projetos significativos e colaborativos.
        </p>
        <p className="text-lg">
          No Inteli, adotamos a metodologia Project Based Learning (PBL), na qual mergulhamos em projetos reais em parceria com empresas e organizações. Com isso, nossos alunos têm a oportunidade de aplicar seus conhecimentos em situações práticas, desenvolvendo habilidades essenciais para o mundo profissional.
        </p>
        <p className="text-lg">
          Além disso, integramos em nosso currículo a metodologia ágil Scrum, que nos permite organizar nosso trabalho em ciclos de duas semanas, chamados de Sprints. Ao final de cada Sprint, entregamos uma parte do projeto ao nosso parceiro, garantindo uma abordagem iterativa e adaptativa.
        </p>

        <p className="text-lg">
          Atualmente, estamos colaborando com a FOFITO, um departamento de terapia ocupacional da renomada Universidade de São Paulo (USP). A FOFITO dedica-se ao cuidado de crianças com Transtorno do Espectro Autista (TEA), e nosso projeto em conjunto busca utilizar um tapete sensorial como ferramenta terapêutica. Por meio de jogos, histórias e estímulos sensoriais, buscamos apoiar o desenvolvimento dessas crianças, proporcionando experiências enriquecedoras e personalizadas.
        </p>

        <p className="text-lg">
          Junte-se a nós nesta jornada de aprendizado, inovação e impacto social. No FOFUXOS, estamos moldando os líderes e profissionais do futuro, prontos para enfrentar os desafios mais complexos com criatividade, resiliência e empatia.
        </p>
      </section>
      <section className="flex flex-col justify-center items-center gap-5 w-full">
        <h1 className="font-bold text-3xl text-[#CAAC3D]">
          INTEGRANTES
        </h1>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex justify-around pt-10 w-3/4">
            <div className="flex flex-col justify-center items-center">
              <Image
                src={phd}
                alt="Imagem Guilherme Moura"
                width={180}
                height={180}
              />
              <h2 className="font-semibold text-xl">
                Guilherme Moura
              </h2>
            </div>
            <div className="flex flex-col justify-center items-center">
              <Image
                src={masqueico}
                alt="Imagem Marcos Vinycius"
                width={180}
                height={180}
              />
              <h2 className="font-semibold text-xl">
                Marcos Vinycius
              </h2>
            </div>
            <div className="flex flex-col justify-center items-center">
              <Image
                src={samusbuy}
                alt="Imagem Samuel Lucas"
                width={180}
                height={180}
              />
              <h2 className="font-semibold text-xl">
                Samuel Lucas
              </h2>
            </div>
            
          </div>
          <div className="flex w-2/4 justify-around items-center pt-10">
          <div className="flex flex-col justify-center items-center">
              <Image
                src={tonyboy}
                alt="Imagem Tony Sousa"
                width={180}
                height={180}
              />
              <h2 className="font-semibold text-xl">
                Tony Sousa
              </h2>
            </div>
            <div className="flex flex-col justify-center items-center">
              <Image
                src={yaguinho}
                alt="Imagem Yago Phellipe"
                width={180}
                height={180}
              />
              <h2 className="font-semibold text-xl">
                Yago Phellipe
              </h2>
            </div>
          </div>
        </div>

      </section>
      <div className="flex flex-col justify-center items-center w-4/5 p-5 pt-10 border-b-4 border-[#D9D9D9]">
        <h1 className="font-bold text-3xl text-[#CAAC3D]">
          CONTATO
        </h1>
      </div>

      <section className="flex justify-between items-center w-4/5 p-5 pt-10 border-b-4 border-[#D9D9D9] pb-40 max-lg:flex-col max-lg:gap-12">
        <div className="flex flex-col justify-center items-center gap-5">
          <h2 className="font-bold text-3xl">
            Contate-nos ou siga
          </h2>
          <p className="w-2/3 text-center text-xl">
            Em apenas um toque venha nos conhecer melhor e acompanhar cada jornada
          </p>
          <div className="flex gap-5">
            <Image
              src={instagram}
              alt="Instagram"
              width={50}
              height={50}
            />
            <Image
              src={whatsapp}
              alt="Whatsapp"
              width={50}
              height={50}
            />
            <Image
              src={linkedin}
              alt="Linkedin"
              width={50}
              height={50}
            />
          </div>
        </div>
        <div className="flex gap-5">
          <Image
            src={site_inteli}
            alt="Site Inteli"
            width={300}
            height={300}
          />
          <Image
            src={email_inteli}
            alt="Email Inteli"
            width={300}
            height={300}
          />
        </div>
      </section>
    </main>
    <VLibrasComponent forceOnload/>

    </>
  );
}
