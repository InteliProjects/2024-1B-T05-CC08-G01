import script from "next/script";
import { Button } from "../ui/button";

interface ButtonExportHtmlProps {
    codigoFonte: string;
    block: boolean;
}
export default function ButtonExportHtml(props: ButtonExportHtmlProps) {

    const lib = `

        
    const listaDeObjetos = [];
    let ultimaPos = 0;
    const largura = 500;
    const altura = 500;
    const figurasValidas = ["quadrado", "circulo"];
    const canvas = document.getElementById("tutorial");
    const divImagens = document.getElementById("imagens");
    const ultimoQuadrantePressionado = 0;
    let ultimaTecla = -1;

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mousedown', this.handleMouseDown.bind(this));


    async function esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function inicializarComCor(cor) {
        canvas.style.borderWidth = "1px";
        canvas.style.borderStyle = "solid";
        canvas.style.borderColor = "grey";
        canvas.style.backgroundColor = cor;
    }

    function limparTela() {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, largura, altura);
    }

    function desenharFigura(tipo, cor, x, y, tamanho) {
        const ctx = canvas.getContext("2d");
        if (tipo == "quadrado") {
            ctx.fillStyle = cor;
            ctx.fillRect(x, y, tamanho, tamanho);
        } else if (tipo == "circulo") {
            ctx.beginPath();
            ctx.fillStyle = cor;
            ctx.arc(x, y, tamanho, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function criarFigura(tipo, cor, x, y, tamanho) {
        if (figurasValidas.indexOf(tipo) >= 0) {
            listaDeObjetos[ultimaPos] = { "tipo": tipo, "cor": cor, "x": x, "y": y, "tamanho": tamanho }
            desenharFigura(tipo, cor, x, y, tamanho);
            ultimaPos++;
            return ultimaPos - 1;
        } else
            return -1;
    }

    function redefinirFigura(id, tipo, cor, x, y, tamanho) {
        if (id >= 0 && id < listaDeObjetos.length && figurasValidas.indexOf(tipo) >= 0) {
            listaDeObjetos[id] = { "tipo": tipo, "cor": cor, "x": x, "y": y, "tamanho": tamanho }
            limparTela();
            desenharFigura(tipo, cor, x, y, tamanho);
            redesenharTodosComExcecao(id);
            return true;
        } else
            return false;
    }


    function desenharImagem(x, y, url) {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(divImagens.querySelector("img[src='" + url + "']"), x, y);
    }


    function criarImagem(url, x, y) {
        const img = document.createElement("img");
        img.src = url;
        divImagens.appendChild(img);
        listaDeObjetos[ultimaPos] = { "tipo": "imagem", "x": x, "y": y, "url": url }

        // precisa aguardar um pouco para que a figura de fato esteja na div
        async function aguardaParaExibir() {
            await esperar(50);
            desenharImagem(x, y, url);
        };
        aguardaParaExibir();

        ultimaPos++;
        return ultimaPos - 1;
    }

    function mover(id, dx, dy) {
        if (listaDeObjetos[id] != null) {
            obj = listaDeObjetos[id];
            limparTela();
            obj.x += dx;
            obj.y += dy;
            if (obj.tipo == "imagem")
                desenharImagem(obj.x, obj.y, obj.url)
            else
                desenharFigura(obj.tipo, obj.cor, obj.x, obj.y, obj.tamanho);
            redesenharTodosComExcecao(id);
        }
    }
    function colidiu(id1, id2) {
        if (id1 >= 0 && id2 >= 0 && id1 < listaDeObjetos.length && id2 < listaDeObjetos.length) {
            obj1 = listaDeObjetos[id1];
            obj2 = listaDeObjetos[id2];
            let w1;
            let w2;
            let h1;
            let h2;

            if (obj1.tipo == "imagem") {
                w1 = divImagens.querySelector("img[src='" + obj1.url + "']").width;
                h1 = divImagens.querySelector("img[src='" + obj1.url + "']").height;
            }
            else {
                w1 = obj.tamanho;
                h1 = obj.tamanho;
            }

            if (obj2.tipo == "imagem") {
                w2 = divImagens.querySelector("img[src='" + obj2.url + "']").width;
                h2 = divImagens.querySelector("img[src='" + obj2.url + "']").height;
            }
            else {
                w2 = obj.tamanho;
                h2 = obj.tamanho;
            }

            if (obj1.x < obj2.x + w2 &&
                obj1.x + w1 > obj2.x &&
                obj1.y < obj2.y + h2 &&
                obj1.y + h1 > obj2.y)
                return true;
        }
        return false;
    }

    function mostrar(msg) {
        document.getElementById("mensagem").textContent = msg;
    }

    function lerNumero(msg) {
        let num;
        do {
            num = Number(prompt(msg));
        } while (isNaN(num) || num % 1 !== 0);
        return num;
    }

    function lerBinario(msg) {
        let resposta = '';
        do {
            resposta = prompt(msg).toLowerCase();
        } while (resposta !== 'v' && resposta !== 'f');
        return resposta;
    }

    function ler(keyCode) {
        switch (keyCode) {
            case 38: return 1; // Seta para cima
            case 40: return 2; // Seta para baixo
            case 37: return 3; // Seta para esquerda
            case 39: return 4; // Seta para direita
            case 32: return 5; // Espaço
            case 13: return 6; // Enter
            case 36: return 7; // Botão esquerdo do mouse
            case 35: return 8; // Botão direito do mouse
            case 46: return 9; // Mouse para cima
            case 45: return 10; // Mouse para baixo
            case 33: return 11; // Mouse para esquerda
            case 34: return 12; // Mouse para direita
            default: return 0; // Outros casos
        }
    }

    function handleKeyDown(evento) {
        this.ultimoQuadrantePressionado = this.ler(evento.keyCode);
    }

    function handleMouseMove(evento) {
        this.ultimoQuadrantePressionado = this.lerMouse(evento);
    }

    function handleMouseDown(evento) {
        this.ultimoQuadrantePressionado = this.lerMouse(evento);
    }

    function lerMouse(evento) {
        let codigo = 0;
        if (evento.buttons === 1) codigo = 7; // Botão esquerdo do mouse
        if (evento.buttons === 2) codigo = 8; // Botão direito do mouse
        if (evento.buttons === 4) codigo = 9; // Mouse para cima
        if (evento.buttons === 8) codigo = 10; // Mouse para baixo
        if (evento.buttons === 16) codigo = 11; // Mouse para esquerda
        if (evento.buttons === 32) codigo = 12; // Mouse para direita
        return codigo;
    }


    function consultar() {
        let valor = ultimaTecla;
        ultimaTecla = -1;
        return valor;
    }

    function aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function inicializarComImagem(arq) {
        const imgElement = document.createElement('img');
        imgElement.src = arq;
        document.body.appendChild(imgElement);
        const ctx = this.canvas.getContext('2d');

        imgElement.onload = () => {
            const scale = Math.min(this.largura / imgElement.width, this.altura / imgElement.height);
            imgElement.style.transformOrigin = 'top left';
            imgElement.style.transform = 'scale(' + scale + ')';
            ctx.drawImage(imgElement, 0, 0, imgElement.width * scale, imgElement.height * scale);
        };

        this.limparTela();
    }

    function redefinirImagem(ref, arq, x, y) {
        if (ref >= 0 && ref < this.listaDeObjetos.length) {
            const oldImg = this.listaDeObjetos[ref].url;
            if (oldImg) {
                const oldImgElement = document.querySelector(\`img[src='$\{oldImg\}']\`);
                if (oldImgElement) {
                    oldImgElement.remove();
                }
            }

            const imgElement = document.createElement('img');
            imgElement.src = arq;
            this.divImagens.appendChild(imgElement);

            this.listaDeObjetos[ref].url = arq;
            this.listaDeObjetos[ref].x = x;
            this.listaDeObjetos[ref].y = y;

            this.desenharImagem(x, y, arq);
        }
    }

    function destacar(ref) {
        if (ref >= 0 && ref < this.listaDeObjetos.length) {
            for (let i = 0; i < this.listaDeObjetos.length; i++) {
                if (i !== ref) {
                    this.listaDeObjetos[i].opacidade = 0.5;
                } else {
                    this.listaDeObjetos[i].opacidade = 1;
                }
            }
            this.redesenharTodosComExcecao(ref);
        }
    }

    function reverterDestaque() {
        for (let i = 0; i < this.listaDeObjetos.length; i++) {
            this.listaDeObjetos[i].opacidade = 1;
        }
        this.redesenharTodosComExcecao(-1);
    }

    function tocar(arq) {
        const audio = new Audio(arq);
        audio.play();
    }

    function redesenharTodosComExcecao(idExcecao) {
        for (let i = 0; i < listaDeObjetos.length; i++) {
            if (i != idExcecao) {
                obj = listaDeObjetos[i];
                if (obj.tipo == "imagem")
                    desenharImagem(obj.x, obj.y, obj.url);
                else // então é figura
                    desenharFigura(obj.tipo, obj.cor, obj.x, obj.y, obj.tamanho);
            }
        }
    }

    function draw() {
        if (canvas.getContext) {
            const ctx = canvas.getContext("2d");
        }
    }
    window.addEventListener("load", draw);

     window.addEventListener("keydown", event => {
        if (event.key == "ArrowLeft") {
            ultimaTecla= 3
        } else if (event.key == "ArrowRight") {
            ultimaTecla= 4
        } else if (event.key == "ArrowUp") {
            ultimaTecla= 1
        } else if (event.key == "ArrowDown") {
            ultimaTecla= 2
        } else if (event.key == "Enter") {
            console.log("Enter!");
            ultimaTecla = 6;
        } else if (event.key == " ") {
            ultimaTecla= 5
            console.log("Space!");
        }
    });

    window.addEventListener("mousedown", event => {
        if (event.button == 0) {
            console.log("Left button");
        } else if (event.button == 1) {
            console.log("Middle button");
        } else if (event.button == 2) {
            console.log("Right button");
        }
    });

    window.addEventListener("mousemove", event => {
        console.log("x = " + event.clientX + "; y = " + event.clientY);
    });

    window.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });



// Inicializar a classe
          `;

    const handleDownload = () => {
        const htmlContent = `
        <!doctype html>
        <html lang="en-US">
        
        <head>
            <meta charset="utf-8" />
            <title>Canvas tutorial</title>
        </head>
        
        <body>
            <canvas id="tutorial" width="500" height="500"></canvas>
            <p id="mensagem"></p>
            <div style="display: none" id="imagens"></div>
            <audio id="audio" autoplay controls style="display: none;">
			<source src="som.mp3" type="audio/mpeg" />
			Your browser does not support the audio element.
		    </audio>
            <script>
            ${lib}
            ${props.codigoFonte}
        </script>
    </body>
    </html>
    `;

        const element = document.createElement('a');
        const file = new Blob([htmlContent], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = 'template.html';
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    if (props.block) {
        return (
            <Button disabled className="w-32 bg-slate-500">Exportar</Button>
        );
    } else {
        return (
            <Button onClick={handleDownload} className="w-32 bg-green-500">Exportar</Button>
        );
    }
}
