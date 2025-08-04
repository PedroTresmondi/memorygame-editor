import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";

export function atualizarPainelCampo() {
  const painel = document.getElementById("painelCampo");
  if (!painel) return;
  painel.innerHTML = "";

  const campo = getCampoSelecionado();
  if (!campo) {
    painel.innerHTML = "<p>Nenhum campo selecionado</p>";
    return;
  }

  const createInput = (
    labelText: string,
    value: string,
    onChange: (val: string) => void
  ) => {
    const group = document.createElement("div");
    group.style.marginBottom = "8px";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.display = "block";
    label.style.fontWeight = "bold";

    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.style.width = "100%";
    input.addEventListener("input", (e) => {
      onChange((e.target as HTMLInputElement).value);
    });

    group.appendChild(label);
    group.appendChild(input);
    return group;
  };

  const createCheckbox = (
    labelText: string,
    checked: boolean,
    onChange: (val: boolean) => void
  ) => {
    const group = document.createElement("div");
    group.style.marginBottom = "8px";

    const label = document.createElement("label");
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "6px";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    input.addEventListener("change", () => {
      onChange(input.checked);
    });

    label.appendChild(input);
    label.append(labelText);
    group.appendChild(label);
    return group;
  };

  const createSelect = (
    labelText: string,
    value: string,
    options: string[],
    onChange: (val: string) => void
  ) => {
    const group = document.createElement("div");
    group.style.marginBottom = "8px";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.display = "block";
    label.style.fontWeight = "bold";

    const select = document.createElement("select");
    select.style.width = "100%";
    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent =
        opt === "top"
          ? "Acima do input"
          : opt === "left"
          ? "À esquerda do input"
          : opt;
      if (opt === value) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
      onChange((e.target as HTMLSelectElement).value);
    });

    group.appendChild(label);
    group.appendChild(select);
    return group;
  };

  // Entradas padrão do painel
  painel.appendChild(
    createInput("Label", campo.label, (val) => {
      campo.label = val;
      atualizarPreview();
    })
  );

  painel.appendChild(
    createInput("Placeholder", campo.placeholder || "", (val) => {
      campo.placeholder = val;
      atualizarPreview();
    })
  );

  painel.appendChild(
    createInput("Largura (px)", String(campo.width || 220), (val) => {
      const num = parseInt(val);
      if (!isNaN(num)) campo.width = num;
      atualizarPreview();
    })
  );

  painel.appendChild(
    createCheckbox("Obrigatório", campo.required || false, (val) => {
      campo.required = val;
      atualizarPreview();
    })
  );

  painel.appendChild(
    createSelect(
      "Tipo do Campo",
      campo.type || "text",
      ["text", "email", "tel", "number"],
      (val) => {
        campo.type = val;
        atualizarPreview();
      }
    )
  );

  // 🔁 NOVO: Posição da Label
  painel.appendChild(
    createSelect(
      "Posição da Label",
      campo.labelPosition || "top",
      ["top", "left"],
      (val) => {
        campo.labelPosition = val;
        atualizarPreview();
      }
    )
  );
}

function getCampoSelecionado() {
  const id = state.campoSelecionado;
  for (const container of state.containers) {
    const campo = container.fields.find((f) => f.id === id);
    if (campo) return campo;
  }
  return null;
}
