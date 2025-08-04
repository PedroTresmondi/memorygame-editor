interface Campo {
  id: string;
  label: string;
  labelPosition: "top" | "left";
  type: string;
  placeholder?: string;
  required?: boolean;
  top?: number;
  left?: number;
  width?: number;
}

interface Container {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  campos?: Campo[];
  fields?: Campo[];
}

interface ElementoExtra {
  id: string;
  type: "button" | "image";
  top: number;
  left: number;
  width: number;
  height?: number;
  label?: string;
  action?: "submit" | "reset" | "custom";
  src?: string;
  alt?: string;
}

interface ConfigCadastro {
  background?: {
    type: "color" | "image";
    value: string;
  };
  containers: Container[];
  elements?: ElementoExtra[];
}

const wrapper = document.getElementById("formularioWrapper")!;
const form = document.getElementById("formularioReal")!;

fetch("http://localhost:5500/data/configCadastro.json")
  .then((res) => res.json())
  .then((config: ConfigCadastro) => {
    // 🎨 Fundo
    if (config.background?.type === "color") {
      wrapper.style.background = config.background.value;
    } else if (config.background?.type === "image") {
      wrapper.style.backgroundImage = `url('${config.background.value}')`;
      wrapper.style.backgroundSize = "cover";
      wrapper.style.backgroundPosition = "center";
    }

    // 📦 Containers e campos
    config.containers.forEach((container) => {
      const containerDiv = document.createElement("div");
      containerDiv.style.position = "absolute";
      containerDiv.style.top = container.top + "px";
      containerDiv.style.left = container.left + "px";
      containerDiv.style.width = container.width + "px";
      containerDiv.style.height = container.height + "px";
      containerDiv.style.border = "1px solid #ccc";
      containerDiv.style.padding = "10px";
      containerDiv.style.background = "#ffffffaa";
      containerDiv.style.backdropFilter = "blur(2px)";
      containerDiv.style.boxSizing = "border-box";
      containerDiv.style.borderRadius = "8px";

      const campos = container.campos ?? container.fields ?? [];

      campos.forEach((campo) => {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.style.position = "absolute";
        fieldWrapper.style.top = (campo.top ?? 0) + "px";
        fieldWrapper.style.left = (campo.left ?? 0) + "px";
        fieldWrapper.style.width = (campo.width ?? 200) + "px";
        fieldWrapper.style.boxSizing = "border-box";

        if (campo.labelPosition === "left") {
          fieldWrapper.style.display = "flex";
          fieldWrapper.style.alignItems = "center";
          fieldWrapper.style.gap = "8px";
        } else {
          fieldWrapper.style.display = "block";
        }

        const label = document.createElement("label");
        label.textContent = campo.label;
        label.setAttribute("for", campo.id);

        const input = document.createElement("input");
        input.type = campo.type;
        input.id = campo.id;
        input.name = campo.id;
        input.placeholder = campo.placeholder || "";
        input.required = campo.required ?? false;
        input.style.width = "100%";

        fieldWrapper.appendChild(label);
        fieldWrapper.appendChild(input);
        containerDiv.appendChild(fieldWrapper);
      });

      form.appendChild(containerDiv);
    });

    // 🎯 Elementos extras: botões e imagens
    // 🎯 Elementos extras: botões e imagens
    config.elements?.forEach((el) => {
      const baseStyle: Partial<CSSStyleDeclaration> = {
        position: "absolute",
        top: el.top + "px",
        left: el.left + "px",
        width: el.width + "px",
        height: (el.height ?? 40) + "px",
        backgroundColor: el.backgroundColor || "",
        color: el.color || "",
        borderRadius: el.borderRadius || "",
        zIndex: "10",
      };

      if (el.type === "button") {
        const button = document.createElement("button");
        button.id = el.id;
        button.textContent = el.label || "Botão";

        Object.assign(button.style, baseStyle);

        // Ações do botão
        if (el.action === "submit") {
          button.type = "submit";
        } else if (el.action === "reset") {
          button.type = "reset";
        } else {
          button.type = "button";
          button.addEventListener("click", () => {
            alert(`Botão custom '${el.label}' clicado`);
          });
        }

        form.appendChild(button);
      }

      if (el.type === "image") {
        const img = document.createElement("img");
        img.src = el.src || "";
        img.alt = el.alt || "imagem";

        Object.assign(img.style, {
          ...baseStyle,
          objectFit: "contain",
        });

        form.appendChild(img);
      }
    });
  })
  .catch((err) => {
    console.error("Erro ao carregar configCadastro.json", err);
  });

// 📤 Captura ao enviar (delegado via form submit)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const dados = new FormData(form as HTMLFormElement);
  const obj = Object.fromEntries(dados.entries());
  console.log("Dados do formulário:", obj);

  // Aqui você pode usar fetch() para enviar os dados
});
