/**
 * Classe `CanvasManager` é responsável por gerenciar o canvas e suas interações com elementos gráficos e eventos do usuário.
 *
 * @class
 */
export class CanvasManager {
    /**
     * Construtor da classe que inicializa o objeto CanvasManager com um ID de canvas e um ID de uma div contendo imagens.
     * 
     * @param {string} canvasId - O ID do elemento canvas na página HTML.
     * @param {string} divImagensId - O ID da div que contém imagens para serem usadas como figuras.
     */
    constructor(canvasId, divImagensId) {
        this.listaDeObjetos = [];
        this.ultimaPos = 0;
        this.largura = 500;
        this.altura = 500;
        this.figurasValidas = ["quadrado", "circulo"];
        this.canvas = document.getElementById(canvasId);
        this.divImagens = document.getElementById(divImagensId);
        this.ultimoQuadrantePressionado = 0;

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
    }
    /**
     * Função assíncrona que retorna uma promessa que resolve após um determinado tempo especificado em milissegundos.
     * 
     * @param {number} ms - Tempo de espera em milissegundos.
     * @returns {Promise<void>} Uma promessa que resolve após o tempo especificado.
     */
    async esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Configura o canvas com uma cor de fundo específica.
     * 
     * @param {string} cor - Cor de fundo do canvas.
     */
    inicializarComCor(cor) {
        this.canvas.style.borderWidth = "1px";
        this.canvas.style.borderStyle = "solid";
        this.canvas.style.borderColor = "grey";
        this.canvas.style.backgroundColor = cor;
    }
    /**
     * Limpa o conteúdo do canvas.
     */
    limparTela() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.largura, this.altura);
    }
    /**
     * Desenha uma figura no canvas com base nos parâmetros fornecidos.
     * 
     * @param {string} tipo - Tipo da figura ("quadrado" ou "circulo").
     * @param {string} cor - Cor da figura.
     * @param {number} x - Posição X da figura.
     * @param {number} y - Posição Y da figura.
     * @param {number} tamanho - Tamanho da figura.
     */
    desenharFigura(tipo, cor, x, y, tamanho) {
        const ctx = this.canvas.getContext("2d");
        if (tipo === "quadrado") {
            ctx.fillStyle = cor;
            ctx.fillRect(x, y, tamanho, tamanho);
        } else if (tipo === "circulo") {
            ctx.beginPath();
            ctx.fillStyle = cor;
            ctx.arc(x, y, tamanho, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    /**
     * Cria uma nova figura no canvas e adiciona à lista de objetos.
     * 
     * @param {string} tipo - Tipo da figura.
     * @param {string} cor - Cor da figura.
     * @param {number} x - Posição X da figura.
     * @param {number} y - Posição Y da figura.
     * @param {number} tamanho - Tamanho da figura.
     * @returns {number} ID da figura criada.
     */
    criarFigura(tipo, cor, x, y, tamanho) {
        if (this.figurasValidas.includes(tipo)) {
            this.listaDeObjetos[this.ultimaPos] = { tipo, cor, x, y, tamanho };
            this.desenharFigura(tipo, cor, x, y, tamanho);
            this.ultimaPos++;
            return this.ultimaPos - 1;
        } else {
            return -1;
        }
    }
    /**
     * Redefine uma figura existente no canvas.
     * 
     * @param {number} id - ID da figura a ser redefinida.
     * @param {string} tipo - Novo tipo da figura.
     * @param {string} cor - Nova cor da figura.
     * @param {number} x - Nova posição X da figura.
     * @param {number} y - Nova posição Y da figura.
     * @param {number} tamanho - Novo tamanho da figura.
     * @returns {boolean} Verdadeiro se a figura foi redefinida com sucesso, falso caso contrário.
     */
    redefinirFigura(id, tipo, cor, x, y, tamanho) {
        if (id >= 0 && id < this.listaDeObjetos.length && this.figurasValidas.includes(tipo)) {
            this.listaDeObjetos[id] = { tipo, cor, x, y, tamanho };
            this.limparTela();
            this.desenharFigura(tipo, cor, x, y, tamanho);
            this.redesenharTodosComExcecao(id);
            return true;
        } else {
            return false;
        }
    }
    /**
     * Desenha uma imagem no canvas.
     * 
     * @param {number} x - Posição X da imagem.
     * @param {number} y - Posição Y da imagem.
     * @param {string} url - URL da imagem.
     */
    desenharImagem(x, y, url) {
        const ctx = this.canvas.getContext("2d");
        const img = this.divImagens.querySelector(`img[src='${url}']`);
        if (img) {
            ctx.drawImage(img, x, y);
        }
    }
    /**
     * Cria uma nova imagem no canvas e adiciona à lista de objetos.
     * 
     * @param {string} url - URL da imagem.
     * @param {number} x - Posição X da imagem.
     * @param {number} y - Posição Y da imagem.
     * @returns {number} ID da imagem criada.
     */
    criarImagem(url, x, y) {
        const img = document.createElement("img");
        img.src = url;
        this.divImagens.appendChild(img);
        this.listaDeObjetos[this.ultimaPos] = { tipo: "imagem", x, y, url };

        (async () => {
            await this.esperar(50);
            this.desenharImagem(x, y, url);
        })();

        this.ultimaPos++;
        return this.ultimaPos - 1;
    }
    /**
     * Move uma figura ou imagem no canvas.
     * 
     * @param {number} id - ID da figura/imagem a ser movida.
     * @param {number} dx - Deslocamento X.
     * @param {number} dy - Deslocamento Y.
     */
    mover(id, dx, dy) {
        if (this.listaDeObjetos[id]) {
            const obj = this.listaDeObjetos[id];
            this.limparTela();
            obj.x += dx;
            obj.y += dy;
            if (obj.tipo === "imagem") {
                this.desenharImagem(obj.x, obj.y, obj.url);
            } else {
                this.desenharFigura(obj.tipo, obj.cor, obj.x, obj.y, obj.tamanho);
            }
            this.redesenharTodosComExcecao(id);
        }
    }
    /**
     * Verifica se duas figuras ou imagens colidiram.
     * 
     * @param {number} id1 - ID da primeira figura/imagem.
     * @param {number} id2 - ID da segunda figura/imagem.
     * @returns {boolean} Verdadeiro se as figuras/imagens colidirem, falso caso contrário.
     */
    colidiu(id1, id2) {
        if (id1 >= 0 && id2 >= 0 && id1 < this.listaDeObjetos.length && id2 < this.listaDeObjetos.length) {
            const obj1 = this.listaDeObjetos[id1];
            const obj2 = this.listaDeObjetos[id2];
            let w1, w2, h1, h2;

            if (obj1.tipo === "imagem") {
                const img1 = this.divImagens.querySelector(`img[src='${obj1.url}']`);
                w1 = img1.width;
                h1 = img1.height;
            } else {
                w1 = obj1.tamanho;
                h1 = obj1.tamanho;
            }

            if (obj2.tipo === "imagem") {
                const img2 = this.divImagens.querySelector(`img[src='${obj2.url}']`);
                w2 = img2.width;
                h2 = img2.height;
            } else {
                w2 = obj2.tamanho;
                h2 = obj2.tamanho;
            }

            if (obj1.x < obj2.x + w2 &&
                obj1.x + w1 > obj2.x &&
                obj1.y < obj2.y + h2 &&
                obj1.y + h1 > obj2.y) {
                return true;
            }
        }
        return false;
    }
    /**
     * Exibe uma mensagem na tela.
     * 
     * @param {string} msg - Mensagem a ser exibida.
     */
    mostrar(msg) {
        document.getElementById("mensagem").textContent = msg;
    }
    /**
     * Lê um número inteiro do usuário através de uma caixa de diálogo.
     * 
     * @param {string} msg - Mensagem solicitando ao usuário para inserir um número.
     * @returns {number} Número inteiro inserido pelo usuário.
     */
    lerNumero(msg) {
        let num;
        do {
            num = Number(prompt(msg));
        } while (isNaN(num) || num % 1 !== 0);
        return num;
    }
    /**
     * Lê uma resposta binária (verdadeiro ou falso) do usuário através de uma caixa de diálogo.
     * 
     * @param {string} msg - Mensagem solicitando ao usuário para responder verdadeiro ou falso.
     * @returns {"true" | "false"} Resposta binária do usuário.
     */
    lerBinario(msg) {
        let resposta = '';
        do {
            resposta = prompt(msg).toLowerCase();
        } while (resposta !== 'v' && resposta !== 'f');
        return resposta;
    }
    /**
     * Lê uma entrada de teclado e retorna um código correspondente.
     * 
     * @param {KeyboardEvent} evento - Evento de teclado.
     * @returns {number} Código de entrada do teclado.
     */
    ler(keyCode) {
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
    /**
     * Manipula o evento de tecla pressionada.
     * 
     * @param {KeyboardEvent} evento - Evento de tecla pressionada.
     */
    handleKeyDown(evento) {
        this.ultimoQuadrantePressionado = this.ler(evento.keyCode);
    }
    /**
     * Manipula o evento de movimento do mouse.
     * 
     * @param {MouseEvent} evento - Evento de movimento do mouse.
     */
    handleMouseMove(evento) {
        this.ultimoQuadrantePressionado = this.lerMouse(evento);
    }
    /**
     * Manipula o evento de clique do mouse.
     * 
     * @param {MouseEvent} evento - Evento de clique do mouse.
     */
    handleMouseDown(evento) {
        this.ultimoQuadrantePressionado = this.lerMouse(evento);
    }
    /**
     * Lê o código do botão do mouse a partir do evento.
     * 
     * @param {MouseEvent} evento - Evento de mouse.
     * @returns {number} Código do botão do mouse.
     */
    lerMouse(evento) {
        let codigo = 0;
        if (evento.buttons === 1) codigo = 7; // Botão esquerdo do mouse
        if (evento.buttons === 2) codigo = 8; // Botão direito do mouse
        if (evento.buttons === 4) codigo = 9; // Mouse para cima
        if (evento.buttons === 8) codigo = 10; // Mouse para baixo
        if (evento.buttons === 16) codigo = 11; // Mouse para esquerda
        if (evento.buttons === 32) codigo = 12; // Mouse para direita
        return codigo;
    }
    /**
     * Consulta o último quadrante pressionado e reinicia o contador.
     * 
     * @returns {number} O último quadrante pressionado antes de resetar.
     */
    async consultar() {
        let resultado = this.ultimoQuadrantePressionado;
        this.ultimoQuadrantePressionado = 0;
        return resultado;
    }
    /**
     * Retorna um número aleatório entre dois valores.
     * 
     * @param {number} min - Valor mínimo inclusivo.
     * @param {number} max - Valor máximo exclusivo.
     * @returns {number} Um número aleatório entre min e max.
     */
    aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * Inicializa o canvas com uma imagem específica.
     * 
     * @param {string} arq - Caminho ou URL da imagem.
     */
    inicializarComImagem(arq) {
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
    /**
     * Redefine uma imagem existente no canvas.
     * 
     * @param {number} ref - Referência da imagem a ser redefinida.
     * @param {string} arq - Nova URL da imagem.
     * @param {number} x - Nova posição X da imagem.
     * @param {number} y - Nova posição Y da imagem.
     * @returns {boolean} Verdadeiro se a imagem foi redefinida com sucesso, falso caso contrário.
     */
    redefinirImagem(ref, arq, x, y) {
        if (ref >= 0 && ref < this.listaDeObjetos.length) {
            const oldImg = this.listaDeObjetos[ref].url;
            if (oldImg) {
                const oldImgElement = document.querySelector(`img[src='${oldImg}']`);
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
    /**
     * Destaca uma figura específica na lista de objetos, alterando a opacidade de todas as figuras.
     * Figuras não selecionadas são definidas como semi-transparentes (0.5), enquanto a selecionada permanece totalmente opaca (1).
     * Após atualizar as opacidades, redesenha todas as figuras com exceção da selecionada.
     *
     * @param {number} ref - Índice da figura a ser destacada na lista de objetos.
     */
    destacar(ref) {
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
    /**
     * Reverte o destaque de todas as figuras, restaurando a opacidade total (1) para todas as figuras na lista de objetos.
     * Após atualizar as opacidades, redesenha todas as figuras.
     *
     */
    reverterDestaque() {
        for (let i = 0; i < this.listaDeObjetos.length; i++) {
            this.listaDeObjetos[i].opacidade = 1;
        }
        this.redesenharTodosComExcecao(-1);
    }
    /**
     * Toca um arquivo de áudio especificado pelo caminho fornecido.
     *
     * @param {string} arq - Caminho do arquivo de áudio a ser reproduzido.
     */
    tocar(arq) {
        const audio = new Audio(arq);
        audio.play();
    }
    /**
     * Redesenha todas as figuras na lista de objetos, exceto a figura especificada por seu índice.
     * Este método é útil para atualizar a visualização após mudanças nas propriedades das figuras.
     *
     * @param {number} idExcecao - Índice da figura a ser excluída do redesenho.
     */
    redesenharTodosComExcecao(idExcecao) {
        for (let i = 0; i < this.listaDeObjetos.length; i++) {
            if (i !== idExcecao) {
                const obj = this.listaDeObjetos[i];
                if (obj.tipo === "imagem") {
                    this.desenharImagem(obj.x, obj.y, obj.url);
                } else {
                    this.desenharFigura(obj.tipo, obj.cor, obj.x, obj.y, obj.tamanho);
                }
            }
        }
    }
    /**
     * Desenha todas as figuras na lista de objetos no canvas.
     * Este método deve ser chamado regularmente para manter a interface gráfica atualizada.
     */
    draw() {
        if (this.canvas.getContext) {
            const ctx = this.canvas.getContext("2d");
        }
    }
}

// Inicializar a classe




// /**
//  * Este código é apenas um exemplo didático.
//  * Cada grupo precisará desenvolver sua própria biblioteca para incorporar
//  * todas as funções necessárias.
//  */

// const listaDeObjetos = [];
// let ultimaPos = 0;
// const largura = 500;
// const altura = 500;
// const figurasValidas = ["quadrado", "circulo"];

// const canvas = document.getElementById("tutorial");
// const divImagens = document.getElementById("imagens"); // id da div que armazena imagens

// // Espera ms milisegundos. Deve ser chamada como: await esperar(ms), dentro de uma função async
// function esperar(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// // Inicializa o canvas
// function inicializar_com_cor(cor) {
//     // verificar posteriormente a possibilidade de definir o tamanho do canvas em JS
//     canvas.style.borderWidth = "1px";
//     canvas.style.borderStyle = "solid";
//     canvas.style.borderColor = "grey";
//     canvas.style.backgroundColor = cor;
// }

// // Limpa todos os objetos do canvas
// function limparTela() {
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, largura, altura);
// }

// // desenha um objeto de um determinado tipo: "quadrado" ou "circulo" (podemos adicionar outras formas geométricas posteriormente)
// function desenharFigura(tipo, cor, x, y, tamanho) {
//     const ctx = canvas.getContext("2d");
//     if (tipo == "quadrado") {
//         ctx.fillStyle = cor;
//         ctx.fillRect(x, y, tamanho, tamanho);
//     } else if (tipo == "circulo") {
//         ctx.beginPath();
//         ctx.fillStyle = cor;
//         ctx.arc(x, y, tamanho, 0, 2 * Math.PI);
//         ctx.fill();
//     }
// }

// // cria uma figura geométrica e retorna o seu id (posição no array de objetos)
// function criar_figura(tipo, cor, x, y, tamanho) {
//     if (figurasValidas.indexOf(tipo) >= 0) {
//         listaDeObjetos[ultimaPos] = { "tipo": tipo, "cor": cor, "x": x, "y": y, "tamanho": tamanho }
//         desenharFigura(tipo, cor, x, y, tamanho);
//         ultimaPos++;
//         return ultimaPos - 1;
//     } else
//         return -1;
// }

// // reaproveita um id e associa outra figura a ele
// function redefinir_figura(id, tipo, cor, x, y, tamanho) {
//     if (id >= 0 && id < listaDeObjetos.length && figurasValidas.indexOf(tipo) >= 0) {
//         listaDeObjetos[id] = { "tipo": tipo, "cor": cor, "x": x, "y": y, "tamanho": tamanho }
//         limparTela();
//         desenharFigura(tipo, cor, x, y, tamanho);
//         redesenharTodosComExcecao(id);
//         return true;
//     } else
//         return false;
// }


// // desenha a imagem no canvas na coordenada x, y
// function desenharImagem(x, y, url) {
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(divImagens.querySelector("img[src='" + url + "']"), x, y);
// }


// // cria uma imagem pela url e retorna o seu id
// function criar_imagem(url, x, y) {
//     const img = document.createElement("img");
//     img.src = url;
//     divImagens.appendChild(img);
//     listaDeObjetos[ultimaPos] = { "tipo": "imagem", "x": x, "y": y, "url": url }

//     // precisa aguardar um pouco para que a figura de fato esteja na div
//     async function aguardaParaExibir() {
//         await esperar(50);
//         desenharImagem(x, y, url);
//     };
//     aguardaParaExibir();

//     ultimaPos++;
//     return ultimaPos - 1;
// }


// // move um objeto no sentido raster, de acordo com o deslocamento dx e dy (podem ser inteiros positivos ou negativos)
// function mover(id, dx, dy) {
//     if (listaDeObjetos[id] != null) {
//         obj = listaDeObjetos[id];
//         limparTela();
//         obj.x += dx;
//         obj.y += dy;
//         if (obj.tipo == "imagem")
//             desenharImagem(obj.x, obj.y, obj.url)
//         else
//             desenharFigura(obj.tipo, obj.cor, obj.x, obj.y, obj.tamanho);
//         redesenharTodosComExcecao(id);
//     }
// }

// // Detecta colisão entre dois objetos. Trata todos eles como retângulos, para facilitar a implementação
// function colidiu(id1, id2) {
//     if (id1 >= 0 && id2 >= 0 && id1 < listaDeObjetos.length && id2 < listaDeObjetos.length) {
//         obj1 = listaDeObjetos[id1];
//         obj2 = listaDeObjetos[id2];
//         let w1;
//         let w2;
//         let h1;
//         let h2;

//         if (obj1.tipo == "imagem") {
//             w1 = divImagens.querySelector("img[src='" + obj1.url + "']").width;
//             h1 = divImagens.querySelector("img[src='" + obj1.url + "']").height;
//         }
//         else {
//             w1 = obj.tamanho;
//             h1 = obj.tamanho;
//         }

//         if (obj2.tipo == "imagem") {
//             w2 = divImagens.querySelector("img[src='" + obj2.url + "']").width;
//             h2 = divImagens.querySelector("img[src='" + obj2.url + "']").height;
//         }
//         else {
//             w2 = obj.tamanho;
//             h2 = obj.tamanho;
//         }

//         if (obj1.x < obj2.x + w2 &&
//             obj1.x + w1 > obj2.x &&
//             obj1.y < obj2.y + h2 &&
//             obj1.y + h1 > obj2.y)
//             return true;
//     }
//     return false;
// }

// function mostrar(msg) {
//     document.getElementById("mensagem").textContent = msg;
// }

// function ler_numero(msg) {
//     let num;
//     do {
//         num = Number(prompt(msg));
//     } while (isNaN(num) || num % 1 !== 0);
//     return num;
// }

// function ler_binario(msg) {
//     let resposta = '';
//     do {
//         resposta = prompt(msg).toLowerCase(); // Converte a resposta para minúsculas para facilitar a comparação
//     } while (resposta!== 'v' && resposta!== 'f');
//     return resposta;
// }



// function ler(keyCode) {
//     let ultimoEvento = 0;

//     window.addEventListener('keydown', (evento) => {
//         ultimoEvento = ler(evento.keyCode);
//     });
//     switch (keyCode) {
//         case 38: return 1; // Seta para cima
//         case 40: return 2; // Seta para baixo
//         case 37: return 3; // Seta para esquerda
//         case 39: return 4; // Seta para direita
//         case 32: return 5; // Espaço
//         case 13: return 6; // Enter
//         case 36: return 7; // Botão esquerdo do mouse
//         case 35: return 8; // Botão direito do mouse
//         case 46: return 9; // Mouse para cima
//         case 45: return 10; // Mouse para baixo
//         case 33: return 11; // Mouse para esquerda
//         case 34: return 12; // Mouse para direita
//         default: return 0; // Outros casos
//     }
// }

// // Para capturar movimentos do mouse, você precisaria adicionar um listener de mouse separadamente
// // e ajustar a função ler para lidar com os códigos de eventos de mouse.
// let ultimoQuadrantePressionado = 0;

// // Função para lidar com eventos de teclado
// function handleKeyDown(evento) {
//     ultimoQuadrantePressionado = ler(evento.keyCode);
// }

// // Função para lidar com eventos de mouse
// function handleMouseMove(evento) {
//     ultimoQuadrantePressionado = lerMouse(evento);
// }

// // Função para lidar com eventos de clique do mouse
// function handleMouseDown(evento) {
//     ultimoQuadrantePressionado = lerMouse(evento);
// }

// // Função auxiliar para lidar com eventos de mouse
// function lerMouse(evento) {
//     let codigo = 0;
//     if (evento.buttons === 1) codigo = 7; // Botão esquerdo do mouse
//     if (evento.buttons === 2) codigo = 8; // Botão direito do mouse
//     if (evento.buttons === 4) codigo = 9; // Mouse para cima
//     if (evento.buttons === 8) codigo = 10; // Mouse para baixo
//     if (evento.buttons === 16) codigo = 11; // Mouse para esquerda
//     if (evento.buttons === 32) codigo = 12; // Mouse para direita
//     return codigo;
// }

// // Adiciona os event listeners
// window.addEventListener('keydown', handleKeyDown);
// window.addEventListener('mousemove', handleMouseMove);
// window.addEventListener('mousedown', handleMouseDown);

// // Implementação da função consultar()
// async function consultar() {
//     let resultado = ultimoQuadrantePressionado;
//     ultimoQuadrantePressionado = 0; // Limpa o valor armazenado
//     return resultado;
// }

// function aleatorio(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function inicializar_com_imagem(arq) {
//     // Cria um novo elemento <img>
//     var imgElement = document.createElement('img');

//     // Define o src do elemento <img> para o caminho da imagem fornecido
//     imgElement.src = arq;

//     // Adiciona o elemento <img> ao DOM
//     document.body.appendChild(imgElement);

//     // Obtém o contexto do canvas
//     var ctx = canvas.getContext('2d');

//     // Redimensiona o elemento <img> para preencher o canvas
//     imgElement.onload = function() {
//         // Calcula a nova escala para manter a proporção da imagem
//         var scale = Math.min(largura / imgElement.width, altura / imgElement.height);

//         // Redimensiona o elemento <img>
//         imgElement.style.transformOrigin = 'top left';
//         imgElement.style.transform = 'scale(' + scale + ')';

//         // Desenha o elemento <img> no canvas
//         ctx.drawImage(imgElement, 0, 0, imgElement.width * scale, imgElement.height * scale);
//     };

//     // Limpa o plano de fundo anterior
//     limparTela();
// }

// function redefinir_imagem(ref, arq, x, y) {
//     // Verifica se a referência existe na lista de objetos
//     if (ref >= 0 && ref < listaDeObjetos.length) {
//         // Remove a imagem antiga associada à referência
//         var oldImg = listaDeObjetos[ref].url;
//         if (oldImg) {
//             // Remove a imagem antiga do DOM
//             var oldImgElement = document.querySelector(`img[src='${oldImg}']`);
//             if (oldImgElement) {
//                 oldImgElement.remove();
//             }
//         }

//         // Carrega a nova imagem
//         var imgElement = document.createElement('img');
//         imgElement.src = arq;

//         // Adiciona a nova imagem ao DOM
//         divImagens.appendChild(imgElement);

//         // Atualiza a URL da imagem na lista de objetos
//         listaDeObjetos[ref].url = arq;

//         // Atualiza a posição da imagem no canvas
//         listaDeObjetos[ref].x = x;
//         listaDeObjetos[ref].y = y;

//         // Redesenha a imagem no canvas
//         desenharImagem(x, y, arq);
//     }
// }

// function destacar(ref) {
//     // Verifica se a referência existe na lista de objetos
//     if (ref >= 0 && ref < listaDeObjetos.length) {
//         // Itera sobre todos os objetos na lista
//         for (var i = 0; i < listaDeObjetos.length; i++) {
//             // Verifica se a referência atual é diferente da referência passada
//             if (i!== ref) {
//                 // Altera a opacidade do objeto para torná-lo translúcido
//                 listaDeObjetos[i].opacidade = 0.5; // Opacidade personalizada, ajuste conforme necessário
//             } else {
//                 // Mantém a opacidade original do objeto destacado
//                 listaDeObjetos[i].opacidade = 1;
//             }
//         }

//         // Redesenha todos os objetos com exceção do destacado
//         redesenharTodosComExcecao(ref);
//     }
// }

// function reverter_destaque() {
//     // Itera sobre todos os objetos na lista
//     for (var i = 0; i < listaDeObjetos.length; i++) {
//         // Restaura a opacidade normal de todos os objetos
//         listaDeObjetos[i].opacidade = 1;
//     }

//     // Redesenha todos os objetos com a opacidade normal
//     redesenharTodosComExcecao(-1); // Passa -1 para indicar que nenhum objeto deve ser excluído
// }

// function tocar(arq) {
//     // Cria um novo elemento de áudio
//     var audio = new Audio(arq);

//     // Toca o áudio imediatamente
//     audio.play();
// }



// /* -------------------------------------------------- */
// /* HELPER FUNCTIONS: não precisam existir na linguagem dos alunos */
// /* -------------------------------------------------- */

// function redesenharTodosComExcecao(idExcecao) {
//     for (let i = 0; i < listaDeObjetos.length; i++) {
//         if (i != idExcecao) {
//             obj = listaDeObjetos[i];
//             if (obj.tipo == "imagem")
//                 desenharImagem(obj.x, obj.y, obj.url);
//             else // então é figura
//                 desenharFigura(obj.tipo, obj.cor, obj.x, obj.y, obj.tamanho);
//         }
//     }
// }


// function draw() {
//     if (canvas.getContext) {
//         const ctx = canvas.getContext("2d");
//     }
// }
// window.addEventListener("load", draw);
