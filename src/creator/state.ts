export type Campo = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  top: number;
  left: number;
  width?: number;
  labelPosition?: "top" | "left";
};

export type Container = {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  fields: Campo[];
};

export interface ElementoExtra {
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

export const state: {
  containers: Container[];
  containerSelecionado: string | null;
  campoSelecionado: string | null;
  background: {
    type: "color" | "image";
    value: string;
  };
  elements: ElementoExtra[];
} = {
  containers: [],
  containerSelecionado: null,
  campoSelecionado: null,
  background: {
    type: "color",
    value: "#f0f0f0",
  },
  elements: [],
};
