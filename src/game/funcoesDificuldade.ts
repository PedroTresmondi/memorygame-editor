import { setConfiguracaoDificuldade } from "./estadoConfiguracao";
import { atualizarResumo } from "./funcoesResumo";

export function setDificuldade(tipo: string): void {
  const botoes = document.querySelectorAll(".botoes-dificuldade button");
  botoes.forEach((btn) => btn.classList.remove("ativo"));

  const botao = document.getElementById(`btn-${tipo}`) as HTMLButtonElement;
  if (botao) botao.classList.add("ativo");

  const personalizado = document.getElementById("personalizado") as HTMLDivElement;
  if (tipo === "perso") {
    if (personalizado) personalizado.style.display = "block";
    return;
  } else {
    if (personalizado) personalizado.style.display = "none";
  }

  let tempo = 0;
  let tempoMem = 0;
  let cartas = 0;
  let tempoPopup = 3;

  switch (tipo) {
    case "facil":
      tempo = 60;
      tempoMem = 3;
      cartas = 6;
      break;
    case "medio":
      tempo = 90;
      tempoMem = 4;
      cartas = 10;
      break;
    case "dificil":
      tempo = 120;
      tempoMem = 5;
      cartas = 15;
      break;
  }

  const config = {
    dificuldade: tipo,
    tempo,
    tempoMemorizacao: tempoMem,
    cartas,
    tempoPopup,
  };

  setConfiguracaoDificuldade(config);
  atualizarResumo();
}

export function mostrarPersonalizado(): void {
  setDificuldade("perso");

  const tempo = Number((document.getElementById("tempo") as HTMLInputElement)?.value || 60);
  const tempoMem = Number((document.getElementById("tempo-mem") as HTMLInputElement)?.value || 4);
  const cartas = Number((document.getElementById("cartas") as HTMLInputElement)?.value || 10);
  const tempoPopup = Number((document.getElementById("tempo-popup") as HTMLInputElement)?.value || 3);

  const config = {
    dificuldade: "personalizado",
    tempo,
    tempoMemorizacao: tempoMem,
    cartas,
    tempoPopup,
  };

  setConfiguracaoDificuldade(config);
  atualizarResumo();
}

export function resetarBotoes(): void {
  const botoes = document.querySelectorAll(".botoes-dificuldade button");
  botoes.forEach((btn) => btn.classList.remove("ativo"));
}
