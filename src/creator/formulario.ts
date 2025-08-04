interface Campo {
  id: string;
  label: string;
  labelPosition: "top" | "left";
  type: string;
  placeholder?: string;
  required?: boolean;
}

interface Container {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  campos?: Campo[]; // preferencial
  fields?: Campo[]; // fallback
}

interface ConfigCadastro {
  background?: {
    type: "color" | "image";
    value: string;
  };
  containers: Container[];
}

const wrapper = document.getElementById("formularioWrapper")!;
const form = document.getElementById("formularioReal")!;
const btnEnviar = document.getElementById("btnEnviar")!;

fetch("http://localhost:5500/data/configCadastro.json")
  .then((res) => res.json())
  .then((config: ConfigCadastro) => {
    // 🎨 Aplica o fundo da página
    if (config.background?.type === "color") {
      wrapper.style.background = config.background.value;
    } else if (config.background?.type === "image") {
      wrapper.style.backgroundImage = `url('${config.background.value}')`;
      wrapper.style.backgroundSize = "cover";
      wrapper.style.backgroundPosition = "center";
    }

    // 📦 Renderiza os containers e campos
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
  })
  .catch((err) => {
    console.error("Erro ao carregar configCadastro.json", err);
  });

// 📤 Captura e exibe os dados ao enviar
btnEnviar.addEventListener("click", (e) => {
  e.preventDefault();

  const dados = new FormData(form as HTMLFormElement);
  const obj = Object.fromEntries(dados.entries());
  console.log("Dados do formulário:", obj);

  // Você pode fazer um POST aqui se quiser salvar os dados
});
