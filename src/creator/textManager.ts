import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";

export function adicionarTexto() {
  const texto = prompt("Digite o conteúdo do texto:", "Texto de exemplo") || "Texto de exemplo";

  const novoTexto = {
    id: `texto_${Date.now()}`,
    type: "text" as const,
    content: texto,
    top: 100,
    left: 100,
    width: 250,
    height: 50,
    fontSize: "18px",
    fontWeight: "normal",
    color: "#000000",
    textAlign: "left",
    backgroundColor: "transparent",
    padding: "4px",
    borderRadius: "0px",
    boxShadow: "none"
  };

  state.elements.push(novoTexto);
  atualizarPreview();
}
