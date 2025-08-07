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

/**
 * Valida o layout antes de exportar.
 * Retorna uma lista de mensagens de erro, ou array vazio se tudo OK.
 */
function validarLayout(): string[] {
  const erros: string[] = [];

  // Campos dentro de containers
  state.containers.forEach((c) => {
    c.fields.forEach((f) => {
      if (!f.label) {
        erros.push(`Campo "${f.id}" sem label.`);
      }
      if (
        ["text", "email", "tel", "checkbox", "number"].includes(f.type) &&
        !f.placeholder
      ) {
        erros.push(`Campo "${f.id}" (${f.label}) sem placeholder.`);
      }
      // Verifica limites
      const fieldHeight = 40; // altura padrão de campo
      if (
        f.left < 0 ||
        f.top < 0 ||
        f.left + (f.width || 0) > c.width ||
        f.top + fieldHeight > c.height
      ) {
        erros.push(
          `Campo "${f.id}" está fora dos limites do container "${c.id}".`
        );
      }
    });
  });

  // Imagens sem alt
  state.elements
    .filter((e) => e.type === "image")
    .forEach((e: any) => {
      if (!e.alt) {
        erros.push(`Imagem "${e.id}" sem texto alternativo (alt).`);
      }
    });

  return erros;
}

export async function salvarConfiguracaoCadastro() {
  // 1) valida layout
  const erros = validarLayout();
  if (erros.length) {
    mostrarMensagemPainel(
      "⚠️ Erros no layout:\n" + erros.map((e) => "• " + e).join("\n"),
      "erro"
    );
    return;
  }

  try {
    const elementosValidos = state.elements.filter(validarElemento);
    const containersValidos = state.containers.filter(validarContainer);

    const payload = {
      elements: elementosValidos,
      containers: containersValidos,
      background: state.background,
    };

    const response = await fetch(
      "http://localhost:5500/salvar-config-cadastro",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload, null, 2),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao salvar configuração no servidor");
    }

    mostrarMensagemPainel("✅ Configuração salva com sucesso!");
  } catch (err) {
    mostrarMensagemPainel("❌ Erro ao salvar configuração", "erro");
    if (debugMode) console.error("Erro ao salvar JSON:", err);
  }

  limparModificacao();
}
