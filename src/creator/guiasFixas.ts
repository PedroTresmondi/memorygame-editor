export function adicionarGuiasFixas() {
  const wrapper = document.getElementById("previewWrapper")!;
  const centerX = document.createElement("div");
  const centerY = document.createElement("div");

  centerX.className = "guia-central-x";
  centerY.className = "guia-central-y";

  wrapper.appendChild(centerX);
  wrapper.appendChild(centerY);
}
