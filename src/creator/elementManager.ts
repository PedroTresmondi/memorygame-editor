import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";

// Adiciona um botão
export function adicionarBotao() {
  const label = prompt("Texto do botão:", "Enviar") || "Enviar";

  let action: "submit" | "reset" | "custom" = "submit";
  const acaoEscolhida = prompt(
    "Ação do botão? (submit, reset, custom)",
    "submit"
  );

  if (
    acaoEscolhida === "submit" ||
    acaoEscolhida === "reset" ||
    acaoEscolhida === "custom"
  ) {
    action = acaoEscolhida;
  } else {
    alert("Ação inválida. Botão será criado com ação 'submit' por padrão.");
    action = "submit";
  }

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
export async function adicionarImagem() {
  const folder =
    prompt("Pasta destino (ex: logo, background, etc):", "logo") || "logo";

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("http://localhost:5500/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro no upload");

      const data = await res.json();
      const novaImagem = {
        id: `img${Date.now()}`,
        type: "image" as const,
        top: 50,
        left: 50,
        width: 200,
        height: 80,
        src: data.filePath,
        alt: file.name,
      };

      state.elements.push(novaImagem);
      atualizarPreview();
    } catch (err) {
      alert("Erro ao fazer upload da imagem");
      console.error(err);
    }
  });

  document.body.appendChild(input);
  input.click();
  input.remove();
}

document.getElementById("addTextBtn")?.addEventListener("click", () => {
  const novoTexto = {
    id: "text_" + Date.now(),
    type: "text",
    text: "Texto de exemplo",
    top: 100,
    left: 100,
    width: 200,
    height: 40,
    fontSize: "16px",
    color: "#000000",
    fontWeight: "normal",
    textAlign: "left",
  };
  state.elements.push(novoTexto);
  atualizarPreview();
});
