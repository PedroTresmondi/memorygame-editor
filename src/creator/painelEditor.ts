import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";

export function abrirPainelPropriedades(elemento: any) {
  const painel = document.getElementById("painelPropriedades")!;
  const conteudo = document.getElementById("conteudoPropriedades")!;
  painel.style.display = "block";
  conteudo.innerHTML = "";

  // Campo especial para texto (content)
  if (elemento.type === "text") {
    const inputTexto = document.createElement("textarea");
    inputTexto.value = elemento.content || "";
    inputTexto.rows = 3;
    inputTexto.style.width = "100%";
    inputTexto.addEventListener("input", () => {
      elemento.content = inputTexto.value;
      atualizarPreview();
    });

    const wrapperTexto = document.createElement("div");
    wrapperTexto.style.marginBottom = "10px";
    const labelTexto = document.createElement("label");
    labelTexto.textContent = "Conteúdo do Texto";
    labelTexto.style.display = "block";
    labelTexto.style.marginBottom = "4px";
    wrapperTexto.appendChild(labelTexto);
    wrapperTexto.appendChild(inputTexto);
    conteudo.appendChild(wrapperTexto);
  }

  // Lista de propriedades personalizáveis
  const propriedades = [
    { key: "backgroundColor", label: "Cor de Fundo", type: "color" },
    { key: "color", label: "Cor do Texto", type: "color" },
    { key: "borderRadius", label: "Borda Arredondada", type: "range", min: 0, max: 50 },
    { key: "fontSize", label: "Tamanho da Fonte", type: "range", min: 10, max: 48 },
    { key: "padding", label: "Padding", type: "range", min: 0, max: 50 },
    {
      key: "fontWeight",
      label: "Peso da Fonte",
      type: "select",
      options: [
        { label: "Normal", value: "normal" },
        { label: "Negrito", value: "bold" },
        { label: "Mais Negrito", value: "900" },
      ],
    },
    {
      key: "textAlign",
      label: "Alinhamento do Texto",
      type: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
    },
    {
      key: "boxShadow",
      label: "Sombra",
      type: "checkbox",
      getValue: () => elemento.boxShadow === "0px 0px 10px rgba(0,0,0,0.3)",
      setValue: (checked: boolean) => {
        elemento.boxShadow = checked ? "0px 0px 10px rgba(0,0,0,0.3)" : "none";
      },
    },
  ];

  propriedades.forEach((prop) => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";

    const label = document.createElement("label");
    label.textContent = prop.label;
    label.style.display = "block";
    label.style.marginBottom = "4px";
    wrapper.appendChild(label);

    let input: HTMLElement;

    if (prop.type === "color") {
      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.value = elemento[prop.key] || "#ffffff";
      colorInput.addEventListener("input", () => {
        elemento[prop.key] = colorInput.value;
        atualizarPreview();
      });
      input = colorInput;
    }

    else if (prop.type === "range") {
      const range = document.createElement("input");
      range.type = "range";
      range.min = String(prop.min ?? 0);
      range.max = String(prop.max ?? 100);
      range.value = parseInt(elemento[prop.key] || 0).toString();

      const output = document.createElement("span");
      output.textContent = range.value + "px";

      range.addEventListener("input", () => {
        elemento[prop.key] = range.value + "px";
        output.textContent = range.value + "px";
        atualizarPreview();
      });

      wrapper.appendChild(range);
      wrapper.appendChild(output);
      input = document.createElement("div"); // placeholder, já adicionado
    }

    else if (prop.type === "select") {
      const select = document.createElement("select");
      prop.options?.forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        if (elemento[prop.key] === opt.value) option.selected = true;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        elemento[prop.key] = select.value;
        atualizarPreview();
      });

      input = select;
    }

    else if (prop.type === "checkbox") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = prop.getValue?.() ?? false;

      checkbox.addEventListener("change", () => {
        prop.setValue?.(checkbox.checked);
        atualizarPreview();
      });

      input = checkbox;
    }

    if (input.tagName !== "DIV") {
      wrapper.appendChild(input);
    }

    conteudo.appendChild(wrapper);
  });
}
