export const debugMode = true;
export let estadoModificado = false;

export function marcarComoModificado() {
  estadoModificado = true;
}

export function limparModificacao() {
  estadoModificado = false;
}

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

export type ElementoExtra = {
  id: string;
  type: "button" | "image" | "text";
  top: number;
  left: number;
  width: number;
  height?: number;
  label?: string;
  content?: string;
  action?: "submit" | "reset" | "custom";
  src?: string;
  alt?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: string;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  boxShadow?: string;
};

export type AppState = {
  containers: Container[];
  containerSelecionado: string | null;
  campoSelecionado: string | null;
  background: {
    type: "color" | "image";
    value: string;
  };
  elements: ElementoExtra[];
};

// Estado base (antes do proxy)
const _state: AppState = {
  containers: [],
  containerSelecionado: null,
  campoSelecionado: null,
  background: {
    type: "color",
    value: "#f0f0f0",
  },
  elements: [],
};

// Para evitar loop em objetos aninhados, usamos um conjunto de handlers recursivos
import { salvarEstado } from "./historyManager";

function createDeepProxy<T extends object>(target: T): T {
  const handler: ProxyHandler<any> = {
    set(obj, prop, value) {
      const result = Reflect.set(obj, prop, value);
      if (debugMode) console.log(`[STATE]: set ${String(prop)} =`, value);
      salvarEstado(); // Salva snapshot sempre que houver alteração
      return result;
    },
    deleteProperty(obj, prop) {
      const result = Reflect.deleteProperty(obj, prop);
      if (debugMode) console.log(`[STATE]: delete ${String(prop)}`);
      salvarEstado();
      return result;
    },
    get(obj, prop) {
      const value = Reflect.get(obj, prop);
      // Aplica Proxy também nos objetos internos
      if (typeof value === "object" && value !== null && !value.__isProxy) {
        const proxied = createDeepProxy(value);
        proxied.__isProxy = true;
        Reflect.set(obj, prop, proxied);
        return proxied;
      }
      return value;
    },
  };
  return new Proxy(target, handler);
}

export const state = createDeepProxy(_state);
