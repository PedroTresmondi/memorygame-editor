import { Campo, Container, ElementoExtra } from "./state";

export function criarCampo(parcial: Partial<Campo>): Campo {
  return {
    id: `campo${Date.now()}`,
    label: parcial.label || "Campo",
    type: parcial.type || "text",
    placeholder: parcial.placeholder ?? "",
    required: parcial.required ?? false,
    top: parcial.top ?? 0,
    left: parcial.left ?? 0,
    width: parcial.width ?? 220,
    maxLength: parcial.maxLength ?? 255,
    labelPosition: parcial.labelPosition ?? "top",
  };
}

export function criarContainer(parcial: Partial<Container> = {}): Container {
  return {
    id: `container${Date.now()}`,
    top: parcial.top ?? 100,
    left: parcial.left ?? 100,
    width: parcial.width ?? 300,
    height: parcial.height ?? 200,
    fields: [],
  };
}

export function criarElementoTexto(content = "Texto de exemplo"): ElementoExtra {
  return {
    id: `texto_${Date.now()}`,
    type: "text",
    content,
    top: 100,
    left: 100,
    width: 250,
    height: 50,
    fontSize: "18px",
    fontWeight: "normal",
    color: "#000000",
    textAlign: "left",
    backgroundColor: "transparent",
    padding: "4px",
    borderRadius: "0px",
    boxShadow: "none",
  } as ElementoExtra & { type: "text"; content: string };
}

export function criarElementoImagem(src = "", alt = ""): ElementoExtra {
  return {
    id: `imagem_${Date.now()}`,
    type: "image",
    src,
    alt,
    top: 150,
    left: 150,
    width: 120,
    height: 120,
  };
}

export function criarElementoBotao(label = "Enviar"): ElementoExtra {
  return {
    id: `botao${Date.now()}`,
    type: "button",
    label,
    action: "submit",
    top: 300,
    left: 300,
    width: 140,
    height: 40,
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "4px",
  };
}
