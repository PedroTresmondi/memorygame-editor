import { state, debugMode, estadoModificado } from "./state";
import { atualizarPreview } from "./previewRenderer";
import { adicionarContainer } from "./containerManager";
import { adicionarCampo } from "./fieldManager";
import { adicionarTexto } from "./textManager.ts";
import { exibirMensagem } from "./utils.ts";
import { adicionarBotao, adicionarImagem } from "./elementManager";
import { salvarEstado, desfazer, refazer } from "./historyManager";
import {
  salvarLocal,
  carregarLocal,
  exportarJSON,
  salvarConfiguracao,
} from "./storage";
import { salvarConfiguracaoCadastro } from "./exportador";
import { alternarPreviewFinal } from "./previewMode";
import { adicionarGuiasFixas } from "./guiasFixas";

// Expor funções globais que ainda dependem do HTML direto
(window as any).salvarConfiguracaoCadastro = salvarConfiguracaoCadastro;
(window as any).desfazer = desfazer;
(window as any).refazer = refazer;
(window as any).salvarLocal = salvarLocal;
(window as any).exportarJSON = exportarJSON;
(window as any).alternarPreviewFinal = alternarPreviewFinal;

// Carregamento inicial
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:5500/data/configCadastro.json");
    if (!res.ok) throw new Error("Erro ao carregar JSON. Status " + res.status);
    const json = await res.json();

    if (json.containers) state.containers = json.containers;
    if (json.elements) state.elements = json.elements;
    if (json.background) state.background = json.background;

    atualizarPreview();
    exibirMensagem("Configuração carregada com sucesso!", "sucesso");
  } catch (err: any) {
    exibirMensagem("❌ Não foi possível carregar a configuração.", "erro");
    if (debugMode) console.error("[Erro ao carregar JSON]:", err);
  }

  adicionarGuiasFixas();
});

document
  .getElementById("btnAlternarPreview")
  ?.addEventListener("click", alternarPreviewFinal);

document
  .getElementById("btnAddTexto")
  ?.addEventListener("click", adicionarTexto);
document
  .getElementById("btnAddBotao")
  ?.addEventListener("click", adicionarBotao);

// Seletores de elementos
const btnAddContainer = document.getElementById("btnAddContainer")!;
const btnAdicionar = document.getElementById("btnAdicionar")!;
const btnSalvar = document.getElementById("btnSalvar")!;
const bgColorPicker = document.getElementById(
  "bgColorPicker"
) as HTMLInputElement;
const bgImageUploader = document.getElementById(
  "bgImageUploader"
) as HTMLInputElement;
const zoomSlider = document.getElementById("zoomSlider") as HTMLInputElement;
const zoomLabel = document.getElementById("zoomLabel")!;
const previewWrapper = document.getElementById("previewWrapper")!;

// Grade de fundo
const gridOverlay = document.createElement("div");
gridOverlay.id = "gridOverlay";
gridOverlay.style.position = "absolute";
gridOverlay.style.top = "0";
gridOverlay.style.left = "0";
gridOverlay.style.right = "0";
gridOverlay.style.bottom = "0";
gridOverlay.style.pointerEvents = "none";
gridOverlay.style.zIndex = "0";
gridOverlay.style.backgroundImage = `
  linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`;
gridOverlay.style.backgroundSize = "10px 10px";
previewWrapper.appendChild(gridOverlay);

let gridAtiva = true;
function toggleGrid() {
  gridAtiva = !gridAtiva;
  gridOverlay.style.display = gridAtiva ? "block" : "none";
}

// Zoom
zoomSlider.addEventListener("input", () => {
  const scale = parseFloat(zoomSlider.value);
  previewWrapper.style.transform = `scale(${scale})`;
  zoomLabel.textContent = `${Math.round(scale * 100)}%`;
});

// Botões principais
btnAddContainer.addEventListener("click", adicionarContainer);
btnAdicionar.addEventListener("click", () => {
  const containerId = state.containerSelecionado;
  if (!containerId) {
    alert("Selecione um container antes de adicionar um campo.");
    return;
  }

  const label = prompt("Label do campo:") || "Campo";
  const type = prompt("Tipo (text, email, tel, checkbox, number):") || "text";
  const placeholder = prompt("Placeholder (opcional):") || label;
  const required = confirm("Este campo é obrigatório?");

  adicionarCampo(containerId, {
    id: `campo${Date.now()}`,
    label,
    type,
    top: 20,
    left: 20,
    width: 220,
    required,
    placeholder,
  });
});

btnSalvar.addEventListener("click", salvarConfiguracao);

document
  .getElementById("btnAddBotao")
  ?.addEventListener("click", adicionarBotao);
document
  .getElementById("btnAddImagem")
  ?.addEventListener("click", adicionarImagem);
document
  .getElementById("btnAddTexto")
  ?.addEventListener("click", adicionarTexto);
document
  .getElementById("btnAlternarPreview")
  ?.addEventListener("click", alternarPreviewFinal);

// Cor de fundo
bgColorPicker.addEventListener("input", (e) => {
  state.background = {
    type: "color",
    value: (e.target as HTMLInputElement).value,
  };
  atualizarPreview();
});

// Imagem de fundo
bgImageUploader.addEventListener("change", (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const fileName = file.name;
  const caminhoRelativo = `/assets/background/${fileName}`;

  state.background = {
    type: "image",
    value: caminhoRelativo,
  };

  atualizarPreview();
});

// Atalhos de teclado
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    salvarLocal();
    alert("Configuração salva localmente!");
  }

  if (e.ctrlKey && e.key.toLowerCase() === "g") {
    e.preventDefault();
    toggleGrid();
  }

  if (e.ctrlKey && e.key.toLowerCase() === "z") {
    e.preventDefault();
    desfazer();
  }

  if (
    e.ctrlKey &&
    (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))
  ) {
    e.preventDefault();
    refazer();
  }
});

// Salvar/Carregar inicial
carregarLocal();
atualizarPreview();

window.addEventListener("beforeunload", (e) => {
  if (estadoModificado) {
    e.preventDefault();
    e.returnValue = "Você tem alterações não salvas. Deseja sair?";
  }
});
