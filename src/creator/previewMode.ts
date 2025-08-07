import { atualizarPreview } from "./previewRenderer";

export function isPreviewMode(): boolean {
  return document.body.classList.contains("modo-preview");
}

export function alternarPreviewFinal(): void {
  const ativado = document.body.classList.toggle("modo-preview");

  let btn = document.getElementById("btnSairPreview") as HTMLButtonElement;

  if (!btn) {
    btn = document.createElement("button");
    btn.id = "btnSairPreview";
    btn.textContent = "🔙 Voltar para edição";
    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.right = "10px";
    btn.style.padding = "10px 14px";
    btn.style.zIndex = "9999";
    btn.style.backgroundColor = "#007bff";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";
    btn.style.display = "none";

    btn.addEventListener("click", () => {
      document.body.classList.remove("modo-preview");
      btn.style.display = "none";
      atualizarPreview(); // ✅ ESSENCIAL para restaurar interface
    });

    document.body.appendChild(btn);
  }

  btn.style.display = ativado ? "block" : "none";
  atualizarPreview(); // ✅ Também atualiza ao entrar no preview
}
