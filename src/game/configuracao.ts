import { setRegrasJogo } from "./estadoConfiguracao";
import { atualizarResumo } from "./funcoesResumo";
import { setDificuldade, mostrarPersonalizado, resetarBotoes } from "./funcoesDificuldade";
import { adicionarFaixa, atualizarFaixas } from "./funcoesScore";
import { getCartasSelecionadas } from "./funcoesCartas";
import { adicionarRegistro } from "./funcoesRegistros";

import {
  carregarEstoque,
  adicionarBrinde,
  abrirSeletorImagem,
  selecionarImagemBrinde,
  atualizarQuantidade,
  editarNomeBrinde,
  removerBrinde,
} from "./funcoesEstoque";

declare global {
  interface Window {
    toggleCampoBonus: () => void;
    toggleCampoPopup: () => void;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  configurarEventos();
  carregarEstoque(); // ✅ corrigido aqui
  atualizarFaixas();
  atualizarResumo();
});

function configurarEventos(): void {
  const hudTempoCheckbox = document.getElementById("hudTempo") as HTMLInputElement;
  const hudTempoValor = document.getElementById("hudTempoValor") as HTMLInputElement;
  const hudPontos = document.getElementById("hudPontos") as HTMLInputElement;
  const hudParesEncontrados = document.getElementById("hudParesEncontrados") as HTMLInputElement;
  const hudTotalPares = document.getElementById("hudTotalPares") as HTMLInputElement;

  const bonusTempoCheckbox = document.getElementById("habilitar-bonus-tempo") as HTMLInputElement;
  const valorBonusTempo = document.getElementById("valor-bonus-tempo") as HTMLInputElement;

  const popupCheckbox = document.getElementById("habilitar-popup-acerto") as HTMLInputElement;
  const valorPopupTempo = document.getElementById("valor-popup-tempo") as HTMLInputElement;

  const btnSalvar = document.querySelector("button[onclick='salvarConfiguracao()']") as HTMLButtonElement;
  const btnResetar = document.querySelector("button[onclick='resetarConfiguracao()']") as HTMLButtonElement;
  const btnIrEditor = document.querySelector("button[onclick='irParaEditor()']") as HTMLButtonElement;

  if (btnSalvar) btnSalvar.onclick = salvarConfiguracao;
  if (btnResetar) btnResetar.onclick = resetarConfiguracao;
  if (btnIrEditor) btnIrEditor.onclick = irParaEditor;

  window.toggleCampoBonus = () => {
    const campo = document.getElementById("campo-bonus-tempo") as HTMLDivElement;
    campo.style.display = bonusTempoCheckbox.checked ? "block" : "none";
  };

  window.toggleCampoPopup = () => {
    const campo = document.getElementById("campo-popup-tempo") as HTMLDivElement;
    campo.style.display = popupCheckbox.checked ? "block" : "none";
  };
}

function salvarConfiguracao(): void {
  const hudTempo = (document.getElementById("hudTempo") as HTMLInputElement).checked;
  const hudTempoValor = Number((document.getElementById("hudTempoValor") as HTMLInputElement).value);
  const hudPontos = (document.getElementById("hudPontos") as HTMLInputElement).checked;
  const hudParesEncontrados = (document.getElementById("hudParesEncontrados") as HTMLInputElement).checked;
  const hudTotalPares = (document.getElementById("hudTotalPares") as HTMLInputElement).checked;
  const bonusTempo = (document.getElementById("habilitar-bonus-tempo") as HTMLInputElement).checked;
  const tempoBonus = Number((document.getElementById("valor-bonus-tempo") as HTMLInputElement).value);
  const popupAcerto = (document.getElementById("habilitar-popup-acerto") as HTMLInputElement).checked;
  const tempoPopup = Number((document.getElementById("valor-popup-tempo") as HTMLInputElement).value);

  setRegrasJogo({
    hudTempo,
    hudTempoValor,
    hudPontos,
    hudParesEncontrados,
    hudTotalPares,
    bonusTempo,
    tempoBonus,
    popupAcerto,
    tempoPopup,
  });

  atualizarResumo();

  const exportar = {
    configuracao: localStorage.getItem("configuracao-dificuldade"),
    faixas: localStorage.getItem("faixas-score"),
    regras: localStorage.getItem("regras-jogo"),
    cartas: getCartasSelecionadas(),
  };

  adicionarRegistro(JSON.stringify(exportar, null, 2));
}

function resetarConfiguracao(): void {
  localStorage.clear();
  window.location.reload();
}

function irParaEditor(): void {
  window.location.href = "editor.html";
}

// Expor funções usadas pelo HTML (onclick)
(window as any).setDificuldade = setDificuldade;
(window as any).mostrarPersonalizado = mostrarPersonalizado;
(window as any).adicionarFaixa = adicionarFaixa;
(window as any).adicionarBrinde = adicionarBrinde;
(window as any).abrirSeletorImagem = abrirSeletorImagem;
(window as any).selecionarImagemBrinde = selecionarImagemBrinde;
(window as any).atualizarQuantidade = atualizarQuantidade;
(window as any).editarNomeBrinde = editarNomeBrinde;
(window as any).removerBrinde = removerBrinde;
(window as any).salvarConfiguracao = salvarConfiguracao;
(window as any).resetarConfiguracao = resetarConfiguracao;
(window as any).irParaEditor = irParaEditor;
