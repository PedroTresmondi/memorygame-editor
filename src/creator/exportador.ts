import { state } from "./state";

export function salvarConfiguracaoCadastro() {
  const json = JSON.stringify({
    background: state.background,
    containers: state.containers,
    elements: state.elements,
  }, null, 2);

  fetch("http://localhost:5500/salvar-config-cadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao salvar");
      alert("Configuração salva com sucesso!");
    })
    .catch((err) => {
      console.error("Erro ao salvar JSON:", err);
      alert("Erro ao salvar configuração.");
    });
}
