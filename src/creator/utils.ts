export function snapToGrid(value: number, gridSize = 10): number {
  return Math.round(value / gridSize) * gridSize;
}


export function exibirMensagem(
  msg: string,
  tipo: "erro" | "sucesso" | "info" = "info"
) {
  const painel = document.getElementById("painelMensagens");
  if (!painel) return;

  painel.innerHTML = `<div class="mensagem ${tipo}">${msg}</div>`;
  painel.style.display = "block";

  setTimeout(() => {
    painel.style.display = "none";
  }, 4000);
}
