let turno = "branca";  // Começamos com o jogador branco
let contadorBrancas = 0;
let contadorPretas = 0;
let tabuleiro = [];
const tabuleiroElement = document.getElementById("tabuleiro");
let jogador1 = { nome: "", time: "branca" };
let jogador2 = { nome: "", time: "preta" };

const letras = ["A", "B", "C", "D", "E", "F", "G", "H"];

const initTabuleiro = () => {
  // Reinicia o tabuleiro
  tabuleiro = [];

  for (let linha = 1; linha <= 8; linha++) {
    for (let coluna = 0; coluna < 8; coluna++) {
      const casa = document.createElement("div");
      casa.classList.add("casa", (linha + coluna) % 2 === 0 ? "branca" : "preta");
      casa.setAttribute("data-posicao", `${letras[coluna]}${linha}`);

      if ((linha + coluna) % 2 !== 0) {
        // Adiciona peças do jogador 1 (brancas) nas 3 primeiras linhas
        if (linha <= 3) {
          const peca = document.createElement("div");
          peca.classList.add("peca", "branca");
          peca.setAttribute("data-time", "branca");
          peca.setAttribute("data-posicao", `${letras[coluna]}${linha}`);
          casa.appendChild(peca);
        } 
        // Adiciona peças do jogador 2 (pretas) nas 3 últimas linhas
        else if (linha >= 6) {
          const peca = document.createElement("div");
          peca.classList.add("peca", "preta");
          peca.setAttribute("data-time", "preta");
          peca.setAttribute("data-posicao", `${letras[coluna]}${linha}`);
          casa.appendChild(peca);
        }
      }

      // Adiciona a casa ao tabuleiro
      tabuleiro.push({ linha, coluna, casa });
      tabuleiroElement.appendChild(casa);

      // Adiciona evento de "drop" (soltar)
      casa.addEventListener("dragover", (e) => {
        e.preventDefault();  // Permite o drop
      });

      casa.addEventListener("drop", (e) => {
        e.preventDefault();
        const peca = document.querySelector(".arrastando");
        if (peca) {
          const novaPosicao = casa.getAttribute("data-posicao");
          moverPeca(peca, novaPosicao);
        }
      });
    }
  }
  renderPlacares();
};

const renderPlacares = () => {
  const placar = document.getElementById("placar");
  placar.innerHTML = `Brancas: ${contadorBrancas} - Pretas: ${contadorPretas}`;
};

// Função para verificar se uma peça virou dama
const verificarDama = (peca, linha, coluna) => {
  if (peca.classList.contains("branca") && linha === 8) {
    peca.classList.add("dama");
    const coroa = document.createElement("span");
    coroa.classList.add("coroa");
    peca.appendChild(coroa);
  }
  if (peca.classList.contains("preta") && linha === 1) {
    peca.classList.add("dama");
    const coroa = document.createElement("span");
    coroa.classList.add("coroa");
    peca.appendChild(coroa);
  }
};

// Função para movimentar a peça
const moverPeca = (peca, novaPosicao) => {
  const antigaPosicao = peca.getAttribute("data-posicao");
  const [letraAntiga, numeroAntigo] = antigaPosicao.split("");
  const linhaAntiga = parseInt(numeroAntigo);
  const colunaAntiga = letras.indexOf(letraAntiga);

  const [letraNova, numeroNovo] = novaPosicao.split("");
  const linhaNova = parseInt(numeroNovo);
  const colunaNova = letras.indexOf(letraNova);

  // Verifica se a peça realmente existe
  const casaAntiga = document.querySelector(`[data-posicao='${antigaPosicao}']`);
  const casaNova = document.querySelector(`[data-posicao='${novaPosicao}']`);
  const pecaAntiga = casaAntiga ? casaAntiga.querySelector(".peca") : null;

  if (pecaAntiga && casaNova) {
    // Remove a peça da casa antiga (se realmente existir)
    casaAntiga.removeChild(peca);

    // Adiciona a peça na nova casa
    casaNova.appendChild(peca);
    peca.setAttribute("data-posicao", novaPosicao);

    // Verifica se a peça virou dama
    verificarDama(peca, linhaNova, colunaNova);

    // Verifica se a peça comeu alguma peça
    if (Math.abs(linhaNova - linhaAntiga) > 1 || Math.abs(colunaNova - colunaAntiga) > 1) {
      const linhaComida = (linhaNova + linhaAntiga) / 2;
      const colunaComida = (colunaNova + colunaAntiga) / 2;
      const posicaoComida = `${letras[colunaComida]}${linhaComida}`;
      const casaComida = document.querySelector(`[data-posicao='${posicaoComida}']`);
      const pecaComida = casaComida ? casaComida.querySelector(".peca") : null;

      if (pecaComida) {
        // Remove a peça comida do tabuleiro
        casaComida.removeChild(pecaComida);
        if (peca.classList.contains("branca")) {
          contadorBrancas++;
        } else {
          contadorPretas++;
        }
        renderPlacares();
      }
    }

    // Troca de turno
    turno = turno === "branca" ? "preta" : "branca";
  }
};

// Adiciona os eventos para arrastar as peças
const adicionarEventosDeArraste = () => {
  const pecas = document.querySelectorAll(".peca");
  pecas.forEach(peca => {
    peca.setAttribute("draggable", "true");  // Habilita a peça para ser arrastada

    peca.addEventListener("dragstart", (e) => {
      if (peca.classList.contains(turno)) {
        e.dataTransfer.setData("text", peca.getAttribute("data-posicao"));
        peca.classList.add("arrastando");  // Marca que a peça está sendo arrastada
      } else {
        e.preventDefault();  // Impede o arraste caso não seja a vez do jogador
      }
    });

    peca.addEventListener("dragend", () => {
      peca.classList.remove("arrastando");  // Remove a marcação de arrastando
    });
  });
};

// Função para solicitar o nome e time dos jogadores
const selecionarJogadores = () => {
  jogador1.nome = prompt("Digite o nome do jogador 1 (time branco):");
  jogador2.nome = prompt("Digite o nome do jogador 2 (time preto):");
  alert(`${jogador1.nome}, você é o time BRANCO!`);
  alert(`${jogador2.nome}, você é o time PRETO!`);
};

// Inicializa o jogo
window.onload = () => {
  selecionarJogadores();
  initTabuleiro();
  adicionarEventosDeArraste();
};
