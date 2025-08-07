import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";

const inputPresets: Record<string, Record<string, string>> = {
  clean: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "16px",
  },
  classic: {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "14px",
  },
  dark: {
    backgroundColor: "#222",
    color: "#fff",
    border: "1px solid #444",
  },
};

export function abrirPainelPropriedades(elemento: any) {
  const painel = document.getElementById("painelPropriedades")!;
  const conteudo = document.getElementById("conteudoPropriedades")!;
  painel.style.display = "block";
  conteudo.innerHTML = "";

  const propriedadesComuns = [
    { key: "width", label: "Largura", type: "range", min: 50, max: 1000 },
    { key: "height", label: "Altura", type: "range", min: 20, max: 500 },
    { key: "margin", label: "Margem", type: "text" },
    { key: "padding", label: "Padding", type: "text" },
    { key: "border", label: "Borda", type: "text" },
    {
      key: "borderRadius",
      label: "Arredondamento",
      type: "range",
      min: 0,
      max: 100,
    },
    { key: "backgroundColor", label: "Cor de Fundo", type: "color" },
    { key: "color", label: "Cor do Texto", type: "color" },
    { key: "fontSize", label: "Tamanho da Fonte", type: "text" },
    {
      key: "fontWeight",
      label: "Peso da Fonte",
      type: "select",
      options: [
        { label: "Normal", value: "normal" },
        { label: "Negrito", value: "bold" },
        { label: "Muito Negrito", value: "900" },
      ],
    },
    {
      key: "textAlign",
      label: "Alinhamento",
      type: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
    },
  ];

  const propriedadesEspecificas: Record<string, any[]> = {
    text: [{ key: "content", label: "Conteúdo", type: "textarea" }],
    button: [{ key: "label", label: "Texto do Botão", type: "text" }],
    image: [
      {
        key: "objectFit",
        label: "Ajuste da Imagem",
        type: "select",
        options: [
          { label: "Preencher", value: "fill" },
          { label: "Conter", value: "contain" },
          { label: "Cobrir", value: "cover" },
        ],
      },
    ],
  };

  const todasProps = [
    ...propriedadesComuns,
    ...(propriedadesEspecificas[elemento.type] || []),
  ];

  if (elemento.placeholder !== undefined) {
    const presetWrapper = document.createElement("div");
    presetWrapper.style.marginBottom = "12px";

    const label = document.createElement("label");
    label.textContent = "Preset de Estilo";
    label.style.display = "block";
    presetWrapper.appendChild(label);

    const select = document.createElement("select");
    Object.keys(inputPresets).forEach((presetName) => {
      const option = document.createElement("option");
      option.value = presetName;
      option.textContent = presetName;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      const selected = inputPresets[select.value];
      Object.entries(selected).forEach(([key, val]) => {
        elemento[key] = val;
      });
      atualizarPreview();
    });

    presetWrapper.appendChild(select);
    conteudo.appendChild(presetWrapper);
  }

  todasProps.forEach((prop) => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";

    const label = document.createElement("label");
    label.textContent = prop.label;
    label.style.display = "block";
    wrapper.appendChild(label);

    const valorAtual = elemento[prop.key] || "";

    if (prop.type === "color") {
      const input = document.createElement("input");
      input.type = "color";

      try {
        input.value = valorAtual.startsWith("#") ? valorAtual : "#000000";
      } catch {
        input.value = "#000000";
      }

      input.addEventListener("input", () => {
        elemento[prop.key] = input.value;
        atualizarPreview();
      });

      wrapper.appendChild(input);
    } else if (prop.type === "range") {
      const range = document.createElement("input");
      range.type = "range";
      range.min = String(prop.min ?? 0);
      range.max = String(prop.max ?? 500);
      range.value = parseInt(valorAtual.toString()) || 0;

      const output = document.createElement("span");
      output.textContent = range.value + "px";

      range.addEventListener("input", () => {
        elemento[prop.key] = range.value + "px";
        output.textContent = range.value + "px";
        atualizarPreview();
      });

      wrapper.appendChild(range);
      wrapper.appendChild(output);
    } else if (prop.type === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.value = valorAtual;
      input.style.width = "100%";

      input.addEventListener("input", () => {
        elemento[prop.key] = input.value;
        atualizarPreview();
      });

      wrapper.appendChild(input);
    } else if (prop.type === "textarea") {
      const textarea = document.createElement("textarea");
      textarea.value = valorAtual;
      textarea.rows = 3;
      textarea.style.width = "100%";

      textarea.addEventListener("input", () => {
        elemento[prop.key] = textarea.value;
        atualizarPreview();
      });

      wrapper.appendChild(textarea);
    } else if (prop.type === "select") {
      const select = document.createElement("select");
      prop.options.forEach((opt: any) => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        if (valorAtual === opt.value) option.selected = true;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        elemento[prop.key] = select.value;
        atualizarPreview();
      });

      wrapper.appendChild(select);
    }

    conteudo.appendChild(wrapper);
  });
}
