import type { BoardConfig } from "./types";

let bgImagePath: string = "";
let mostrarVerso: boolean = true;

const preview = document.getElementById("preview") as HTMLDivElement;
const telaJogo = document.getElementById("tela-jogo") as HTMLDivElement;

/**
 * Helper para obter um HTMLInputElement pelo ID, com checagem de tipo.
 */
function getInput(id: string): HTMLInputElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLInputElement)) {
    throw new Error(`Elemento #${id} não é um <input>`);
  }
  return el;
}

/**
 * Atualiza a pré-visualização do tabuleiro conforme valores dos controles.
 */
export function atualizarPreview(): void {
  const cols    = +getInput("cols").value;
  const rows    = +getInput("rows").value;
  const numPares= +getInput("numPares").value;
  const totalCartas = numPares * 2;

  const gap          = +getInput("gap").value;
  const cardWidth    = +getInput("cardWidth").value;
  const cardHeight   = +getInput("cardHeight").value;
  const borderRadius = +getInput("borderRadius").value;

  const animationType     = (document.getElementById("animationType")  as HTMLSelectElement).value;
  const animationDuration = +getInput("animationDuration").value;

  // Ajusta estilos do container de preview
  preview.style.display = "grid";
  preview.style.gridTemplateColumns = `repeat(${cols}, ${cardWidth}px)`;
  preview.style.gridTemplateRows    = `repeat(${rows}, ${cardHeight}px)`;
  preview.style.gap                 = `${gap}px`;

  // Ajusta cartas
  Array.from(preview.children).forEach((child, idx) => {
    if (!(child instanceof HTMLDivElement)) return;
    child.style.width        = `${cardWidth}px`;
    child.style.height       = `${cardHeight}px`;
    child.style.borderRadius = `${borderRadius}px`;

    // mostra verso ou frente
    if (mostrarVerso) {
      child.textContent = "";
      child.style.backgroundImage = `url("${bgImagePath}")`;
    } else {
      child.textContent = String(idx % numPares + 1);
      child.style.backgroundImage = "none";
    }

    // animação
    child.style.transition = `transform ${animationDuration}ms ${animationType}`;
  });
}

/**
 * Carrega do localStorage a última configuração salva e atualiza preview.
 */
function carregarConfiguracaoSalva(): void {
  const raw = localStorage.getItem("boardConfig");
  if (!raw) return;
  try {
    const cfg: BoardConfig = JSON.parse(raw);
    // popula controles
    getInput("cols").value            = String(cfg.grid.cols);
    getInput("rows").value            = String(cfg.grid.rows);
    getInput("numPares").value        = String(cfg.grid.numPares);
    getInput("gap").value             = String(cfg.grid.gap);
    getInput("cardWidth").value       = String(cfg.card.width);
    getInput("cardHeight").value      = String(cfg.card.height);
    getInput("borderRadius").value    = String(cfg.card.borderRadius);
    (document.getElementById("animationType") as HTMLSelectElement).value       = cfg.animation.type;
    getInput("animationDuration").value = String(cfg.animation.duration);
    // bg image
    if (cfg.background.image) {
      bgImagePath = cfg.background.image;
      (document.getElementById("bgUpload") as HTMLInputElement).dataset["file"] = cfg.background.image;
    }
    // verso
    mostrarVerso = cfg.showFaces;
    const btnFaces = document.getElementById("toggleFaces") as HTMLButtonElement;
    btnFaces.dataset.active = String(mostrarVerso);
    btnFaces.textContent = mostrarVerso ? "Revelar Faces" : "Virar Cartas";
  } catch {
    console.warn("Configuração inválida em localStorage");
  }
}

/**
 * Monta o objeto BoardConfig, salva em localStorage e dispara download.
 */
export function salvarConfig(): void {
  const cfg: BoardConfig = {
    width: +getInput("telaWidth").value,
    height: +getInput("telaHeight").value,
    modo: (document.getElementById("modoTela") as HTMLSelectElement).value,
    animation: {
      type: (document.getElementById("animationType") as HTMLSelectElement).value,
      duration: +getInput("animationDuration").value,
    },
    grid: {
      cols: +getInput("cols").value,
      rows: +getInput("rows").value,
      numPares: +getInput("numPares").value,
      gap: +getInput("gap").value,
    },
    card: {
      width: +getInput("cardWidth").value,
      height: +getInput("cardHeight").value,
      borderRadius: +getInput("borderRadius").value,
      boxShadow: (document.getElementById("boxShadow") as HTMLInputElement).value,
      font: (document.getElementById("fontSelect") as HTMLSelectElement).value,
    },
    background: {
      color: (document.getElementById("bgColor") as HTMLInputElement).value,
      image: bgImagePath || null,
    },
    darkMode: (document.getElementById("toggleDark") as HTMLElement).dataset.active === "true",
    showFaces: mostrarVerso,
  };

  localStorage.setItem("boardConfig", JSON.stringify(cfg, null, 2));

  // forçar download do JSON
  const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "board-config.json";
  a.click();

  alert("Configuração salva!");
}

// Listeners
document.getElementById("cols")!
  .addEventListener("input", atualizarPreview);
document.getElementById("rows")!
  .addEventListener("input", atualizarPreview);
document.getElementById("numPares")!
  .addEventListener("input", atualizarPreview);
document.getElementById("gap")!
  .addEventListener("input", atualizarPreview);
document.getElementById("cardWidth")!
  .addEventListener("input", atualizarPreview);
document.getElementById("cardHeight")!
  .addEventListener("input", atualizarPreview);
document.getElementById("borderRadius")!
  .addEventListener("input", atualizarPreview);
(document.getElementById("animationType") as HTMLSelectElement)
  .addEventListener("change", atualizarPreview);
document.getElementById("animationDuration")!
  .addEventListener("input", atualizarPreview);

// toggle faces
document.getElementById("toggleFaces")!
  .addEventListener("click", (e) => {
    mostrarVerso = !mostrarVerso;
    atualizarPreview();
    const btn = e.currentTarget as HTMLButtonElement;
    btn.textContent = mostrarVerso ? "Revelar Faces" : "Virar Cartas";
  });

// onload
window.addEventListener("load", () => {
  carregarConfiguracaoSalva();
  atualizarPreview();
});

// expõe salvarConfig para HTML
(window as any).salvarConfig = salvarConfig;
