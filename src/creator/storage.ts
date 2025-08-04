import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";

export function salvarLocal() {
  localStorage.setItem(
    "cadastroConfig",
    JSON.stringify({
      background: state.background,
      containers: state.containers,
    })
  );
}

export function carregarLocal() {
  const saved = localStorage.getItem("cadastroConfig");
  if (saved) {
    const config = JSON.parse(saved);
    state.background = config.background;
    state.containers = config.containers;
    atualizarPreview();
  }
}

export function exportarJSON() {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          background: state.background,
          containers: state.containers,
        },
        null,
        2
      ),
    ],
    { type: "application/json" }
  );

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "cadastro-config.json";
  link.click();
}

export function salvarConfiguracao() {
  const config = {
    background: state.background,
    containers: state.containers,
  };

  fetch("/salvar-config-cadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  })
    .then((res) => {
      if (res.ok) alert("Configuração salva!");
      else alert("Erro ao salvar configuração.");
    })
    .catch((err) => console.error("Erro na requisição:", err));
}
