interface Carta {
  nome: string;
  imagem: string;
}

let cartasSelecionadas: Carta[] = [];

export function carregarCartas(imagens: string[]): void {
  const listaCartas = document.getElementById("lista-cartas") as HTMLDivElement;
  listaCartas.innerHTML = "";

  imagens.forEach((imgSrc) => {
    const item = document.createElement("div");
    item.classList.add("item-carta");

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "Carta";
    img.addEventListener("click", () => {
      alternarCarta(imgSrc);
    });

    item.appendChild(img);
    listaCartas.appendChild(item);
  });
}

function alternarCarta(imagem: string): void {
  const index = cartasSelecionadas.findIndex((c) => c.imagem === imagem);

  if (index !== -1) {
    cartasSelecionadas.splice(index, 1);
  } else {
    const nome = gerarNomeCarta(imagem);
    cartasSelecionadas.push({ nome, imagem });
  }

  atualizarEstiloCartasSelecionadas();
}

function atualizarEstiloCartasSelecionadas(): void {
  const todasImagens = document.querySelectorAll("#lista-cartas img");
  todasImagens.forEach((img) => {
    if (cartasSelecionadas.some((c) => c.imagem === img.getAttribute("src"))) {
      img.style.border = "2px solid green";
    } else {
      img.style.border = "2px solid transparent";
    }
  });
}

function gerarNomeCarta(imagem: string): string {
  const partes = imagem.split("/");
  return partes[partes.length - 1].split(".")[0]; // nome do arquivo sem extensão
}

export function getCartasSelecionadas(): Carta[] {
  return cartasSelecionadas;
}

export function setCartasSelecionadas(cartas: Carta[]): void {
  cartasSelecionadas = cartas;
  atualizarEstiloCartasSelecionadas();
}
