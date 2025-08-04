export function mostrarGuiaDinamica(tipo: "x" | "y") {
  const id = tipo === "x" ? "guia-dinamica-x" : "guia-dinamica-y";
  let guia = document.getElementById(id);

  if (!guia) {
    guia = document.createElement("div");
    guia.id = id;
    guia.className = tipo === "x" ? "guia-central-x" : "guia-central-y";
    guia.style.background = "rgba(0, 0, 255, 0.4)";
    guia.style.zIndex = "1";
    guia.style.pointerEvents = "none";
    guia.style.position = "absolute";
    document.getElementById("previewWrapper")!.appendChild(guia);
  }

  guia.style.opacity = "1";

  clearTimeout((guia as any)._timeout);
  (guia as any)._timeout = setTimeout(() => {
    guia!.style.opacity = "0";
  }, 500);
}
