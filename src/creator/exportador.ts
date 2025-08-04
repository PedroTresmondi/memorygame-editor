import { state } from "./state";

export function salvarConfiguracaoCadastro() {
  const jsonCompleto = {
    background: state.background,
    containers: state.containers,
  };

  fetch("http://localhost:5500/salvar-config-cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonCompleto, null, 2),
  })
    .then((res) => {
      if (res.ok) {
        alert("Configuração salva com sucesso!");
      } else {
        alert("Erro ao salvar.");
      }
    })
    .catch((err) => {
      console.error("Erro ao salvar JSON:", err);
    });
}
