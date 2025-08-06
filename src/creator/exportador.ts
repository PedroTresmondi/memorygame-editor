import { state } from "./state";
import { limparModificacao } from "./state";

// Ative para ver logs detalhados no console
const debugMode = true;

function mostrarMensagemPainel(msg: string, tipo: "info" | "erro" = "info") {
  const painel = document.getElementById("mensagemSistema");
  if (!painel) return;
  painel.textContent = msg;
  painel.style.color = tipo === "erro" ? "red" : "green";
  painel.style.display = "block";
}

function validarElemento(element: any) {
  if (
    !element.id ||
    !element.type ||
    element.top == null ||
    element.left == null ||
    element.width == null ||
    element.height == null
  ) {
    if (debugMode) console.warn("Elemento inválido:", element);
    return false;
  }
  return true;
}

function validarContainer(container: any) {
  if (
    !container.id ||
    container.top == null ||
    container.left == null ||
    container.width == null ||
    container.height == null
  ) {
    if (debugMode) console.warn("Container inválido:", container);
    return false;
  }
  if (!Array.isArray(container.fields)) return true;
  return container.fields.every(validarCampo);
}

function validarCampo(campo: any) {
  if (
    !campo.id ||
    !campo.label ||
    !campo.type ||
    campo.top == null ||
    campo.left == null ||
    campo.width == null
  ) {
    if (debugMode) console.warn("Campo inválido:", campo);
    return false;
  }
  return true;
}

export async function salvarConfiguracaoCadastro() {
  try {
    const elementosValidos = state.elements.filter(validarElemento);
    const containersValidos = state.containers.filter(validarContainer);

    const json = JSON.stringify(
      {
        elements: elementosValidos,
        containers: containersValidos,
        background: state.background,
      },
      null,
      2
    );

    const response = await fetch(
      "http://localhost:5500/salvar-config-cadastro",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      }
    );

    if (!response.ok)
      throw new Error("Erro ao salvar configuração no servidor");

    mostrarMensagemPainel("✅ Configuração salva com sucesso!");
  } catch (err) {
    mostrarMensagemPainel("❌ Erro ao salvar configuração", "erro");
    if (debugMode) console.error("Erro ao salvar JSON:", err);
  }
  limparModificacao();
}
