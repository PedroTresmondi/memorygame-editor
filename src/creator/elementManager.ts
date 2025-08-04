import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";

// Adiciona um botão
export function adicionarBotao() {
  const label = prompt("Texto do botão:", "Enviar") || "Enviar";
  const action = prompt("Ação do botão? (submit, reset, custom)", "submit") as
    | "submit"
    | "reset"
    | "custom";

  const novoBotao = {
    id: `botao${Date.now()}`,
    type: "button" as const,
    top: 100,
    left: 100,
    width: 140,
    height: 40,
    label,
    action,
  };

  state.elements.push(novoBotao);
  atualizarPreview();
}

// Adiciona uma imagem/logo
export function adicionarImagem() {
  const src = prompt("Caminho da imagem (ex: /assets/logo.png):", "/assets/logo.png");
  if (!src) return;

  const novaImagem = {
    id: `img${Date.now()}`,
    type: "image" as const,
    top: 50,
    left: 50,
    width: 200,
    height: 80,
    src,
    alt: "Logo",
  };

  state.elements.push(novaImagem);
  atualizarPreview();
}
