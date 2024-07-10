/**
 * Este código é apenas um exemplo didático.
 * Cada grupo precisará desenvolver sua própria biblioteca para incorporar
 * todas as funções necessárias.
 */

const listaDeObjetos = [];
let ultimaPos = 0;
let ultimaTecla = -1;
const largura = 500;
const altura = 500;
const figurasValidas = ["quadrado", "circulo"];

const canvas = document.getElementById("tutorial");
const divImagens = document.getElementById("imagens"); // id da div que armazena imagens

// Espera ms milisegundos. Deve ser chamada como: await esperar(ms), dentro de uma função async
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function inicializar_com_imagem(imagemUrl) {
    canvas.style.borderWidth = "1px";
    canvas.style.borderStyle = "solid";
    canvas.style.borderColor = "grey";
    canvas.style.backgroundSize = "cover";
    canvas.style.backgroundImage = `url(${imagemUrl})`;
}


// Inicializa o canvas
function inicializar_com_cor(cor) {
    // verificar posteriormente a possibilidade de definir o tamanho do canvas em JS
    canvas.style.borderWidth = "1px";
    canvas.style.borderStyle = "solid";
    canvas.style.borderColor = "grey";
    // canvas.style.backgroundSize = "cover";
    canvas.style.backgroundImage = cor;
}

// Limpa todos os objetos do canvas
function limparTela() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, largura, altura);
}

// desenha um objeto de um determinado tipo: "quadrado" ou "circulo" (podemos adicionar outras formas geométricas posteriormente)
function desenharFigura(tipo, cor, x, y, tamanho) {
    const ctx = canvas.getContext("2d");
    if (tipo == "quadrado") {
        ctx.fillStyle = cor;
        ctx.fillRect(x, y, tamanho, tamanho);
    } else if (tipo == "circulo") {
        ctx.beginPath();
        ctx.fillStyle = cor;
        ctx.arc(x, y, tamanho, 0, 2*Math.PI);
        ctx.fill();
    }
}

// cria uma figura geométrica e retorna o seu id (posição no array de objetos)
function criar_figura(tipo, cor, x, y, tamanho) {
    if (figurasValidas.indexOf(tipo) >= 0) {
        listaDeObjetos[ultimaPos] = {"tipo": tipo, "cor": cor, "x": x, "y": y, "tamanho": tamanho}
        desenharFigura(tipo, cor, x, y, tamanho);
        ultimaPos++;
        return ultimaPos-1;
    } else
        return -1;
}

// reaproveita um id e associa outra figura a ele
function redefinir_figura(id, tipo, cor, x, y, tamanho) {
    if (id >= 0 && id < listaDeObjetos.length && figurasValidas.indexOf(tipo) >= 0) {
        listaDeObjetos[id] = {"tipo": tipo, "cor": cor, "x": x, "y": y, "tamanho": tamanho}
        limparTela();
        desenharFigura(tipo, cor, x, y, tamanho);
        redesenharTodosComExcecao(id);
        return true;
    } else
        return false;
}


// desenha a imagem no canvas na coordenada x, y
function desenharImagem(x, y, url) {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(divImagens.querySelector("img[src='" + url + "']"), x, y);
}


// cria uma imagem pela url e retorna o seu id
function criar_imagem(url, x, y) {
    const img = document.createElement("img");
    img.src = url;
    divImagens.appendChild(img);
    listaDeObjetos[ultimaPos] = {"tipo": "imagem", "x": x, "y": y, "url": url}
    
    // precisa aguardar um pouco para que a figura de fato esteja na div
    async function aguardaParaExibir() {
        await esperar(50);
        desenharImagem(x, y, url);    
    };
    aguardaParaExibir();

    ultimaPos++;
    return ultimaPos-1;
}


// move um objeto no sentido raster, de acordo com o deslocamento dx e dy (podem ser inteiros positivos ou negativos)
function mover(id, dx, dy) {
    if (listaDeObjetos[id] != null) {
        obj = listaDeObjetos[id];
        limparTela();
        obj.x += dx;
        obj.y += dy;

        if (dx == 0 && dy == 0){
            obj.x =0;
            obj.y =0;
        }
        
        if (obj.tipo == "imagem")
            desenharImagem(obj.x, obj.y, obj.url)
        else
            desenharFigura(obj.tipo, obj.cor, obj.x, obj.y, obj.tamanho);
        redesenharTodosComExcecao(id);
    }
}

// Detecta colisão entre dois objetos. Trata todos eles como retângulos, para facilitar a implementação
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

function consultar() {
    let valor = ultimaTecla;
    ultimaTecla = -1;
    return valor;
}


/* -------------------------------------------------- */
/* HELPER FUNCTIONS: não precisam existir na linguagem dos alunos */
/* -------------------------------------------------- */

function redesenharTodosComExcecao(idExcecao) {
    for(let i = 0; i < listaDeObjetos.length; i++) {
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
      console.log("ArrowLeft!");
    } else if (event.key == "ArrowRight") {
        console.log("ArrowRight!");
    } else if (event.key == "ArrowUp") {
        console.log("ArrowUp!");
    } else if (event.key == "ArrowDown") {
        console.log("ArrowDown!");
    } else if (event.key == "Enter") {
        console.log("Enter!");
        ultimaTecla = 6;
    } else if (event.key == " ") {
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
