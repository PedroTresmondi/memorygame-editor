import { iniciarJogo } from "./funcoesCartas";
import type { BoardConfig } from "./types";

const raw = localStorage.getItem("boardConfig");
let cfg: BoardConfig | null = raw ? JSON.parse(raw) : null;

if (cfg) {
  const tela = document.getElementById("tela-jogo")!;
  tela.style.width  = `${cfg.width}px`;
  tela.style.height = `${cfg.height}px`;
  tela.style.background = cfg.background.image
    ? `url('${cfg.background.image}') center/cover`
    : cfg.background.color;

  const board = document.getElementById("tabuleiro")!;
  board.style.display = "grid";
  board.style.gridTemplateColumns = `repeat(${cfg.grid.cols}, 1fr)`;
  board.style.gridTemplateRows    = `repeat(${cfg.grid.rows}, 1fr)`;
  board.style.gap                 = `${cfg.grid.gap}px`;

  iniciarJogo({ ...cfg });
} else {
  iniciarJogo();
}