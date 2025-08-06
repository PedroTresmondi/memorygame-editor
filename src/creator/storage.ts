import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";

const debugMode = true;

function mostrarMensagemPainel(msg: string, tipo: "info" | "erro" = "info") {
  const painel = document.getElementById("mensagemSistema");
  if (!painel) return;
  painel.textContent = msg;
  painel.style.color = tipo === "erro" ? "red" : "green";
  painel.style.display = "block";
}

export function salvarLocal() {
  try {
    const config = {
      background: state.background,
      containers: state.containers,
      elements: state.elements,
    };
    localStorage.setItem("cadastroConfig", JSON.stringify(config));
    mostrarMensagemPainel("💾 Configuração salva localmente!");
  } catch (err) {
    mostrarMensagemPainel("❌ Erro ao salvar localmente.", "erro");
    if (debugMode) console.error("Erro ao salvar local:", err);
  }
}

export function carregarLocal() {
  try {
    const saved = localStorage.getItem("cadastroConfig");
    if (!saved) {
      mostrarMensagemPainel("ℹ️ Nenhuma configuração local encontrada.");
      return;
    }

    const config = JSON.parse(saved);
    if (config.background) state.background = config.background;
    if (config.containers) state.containers = config.containers;
    if (config.elements) state.elements = config.elements;

    atualizarPreview();
    mostrarMensagemPainel("📂 Configuração carregada com sucesso!");
  } catch (err) {
    mostrarMensagemPainel("❌ Erro ao carregar configuração local.", "erro");
    if (debugMode) console.error("Erro ao carregar local:", err);
  }
}

export function exportarJSON() {
  try {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            background: state.background,
            containers: state.containers,
            elements: state.elements,
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

    mostrarMensagemPainel("📦 JSON exportado com sucesso!");
  } catch (err) {
    mostrarMensagemPainel("❌ Erro ao exportar JSON.", "erro");
    if (debugMode) console.error("Erro ao exportar JSON:", err);
  }
}

export async function salvarConfiguracao() {
  try {
    const config = {
      background: state.background,
      containers: state.containers,
      elements: state.elements,
    };

    const res = await fetch("/salvar-config-cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    if (!res.ok) throw new Error("Erro na resposta do servidor");
    mostrarMensagemPainel("✅ Configuração enviada ao servidor com sucesso!");
  } catch (err) {
    mostrarMensagemPainel(
      "❌ Erro ao salvar configuração no servidor.",
      "erro"
    );
    if (debugMode) console.error("Erro na requisição:", err);
  }
}
