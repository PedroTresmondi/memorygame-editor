import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";

const painel = document.getElementById("painelElemento")!;

export function abrirPainelElemento(elementoId: string) {
  const elemento = state.elements.find(e => e.id === elementoId);
  if (!elemento) return;

  painel.innerHTML = "";
  painel.style.display = "block";

  const titulo = document.createElement("h4");
  titulo.textContent = `Editar ${elemento.type === "button" ? "Botão" : "Imagem"}`;
  painel.appendChild(titulo);

  const createInput = (labelText: string, valor: string, onChange: (v: string) => void) => {
    const label = document.createElement("label");
    label.textContent = labelText;
    const input = document.createElement("input");
    input.value = valor;
    input.style.width = "100%";
    input.addEventListener("input", () => onChange(input.value));
    painel.appendChild(label);
    painel.appendChild(input);
  };

  createInput("Top", elemento.top.toString(), (v) => { elemento.top = parseInt(v); atualizarPreview(); });
  createInput("Left", elemento.left.toString(), (v) => { elemento.left = parseInt(v); atualizarPreview(); });
  createInput("Largura", elemento.width.toString(), (v) => { elemento.width = parseInt(v); atualizarPreview(); });
  createInput("Altura", (elemento.height || 40).toString(), (v) => { elemento.height = parseInt(v); atualizarPreview(); });

  if (elemento.type === "button") {
    createInput("Texto do Botão", elemento.label || "", (v) => { elemento.label = v; atualizarPreview(); });

    const select = document.createElement("select");
    ["submit", "reset", "custom"].forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      if (elemento.action === opt) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      elemento.action = select.value as "submit" | "reset" | "custom";
      atualizarPreview();
    });
    painel.appendChild(document.createTextNode("Ação do Botão"));
    painel.appendChild(select);
  }

  if (elemento.type === "image") {
    createInput("Alt", elemento.alt || "", (v) => { elemento.alt = v; atualizarPreview(); });
    createInput("Src", elemento.src || "", (v) => { elemento.src = v; atualizarPreview(); });
  }
}
