import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";
import { marcarComoModificado } from "./state";



interface StateSnapshot {
  containers: typeof state.containers;
  elements: typeof state.elements;
  background: typeof state.background;
}

let undoStack: StateSnapshot[] = [];
let redoStack: StateSnapshot[] = [];

export function salvarEstado() {
  // Salva um clone profundo para evitar mutações
  const snapshot: StateSnapshot = {
    containers: JSON.parse(JSON.stringify(state.containers)),
    elements: JSON.parse(JSON.stringify(state.elements)),
    background: JSON.parse(JSON.stringify(state.background)),
  };
  undoStack.push(snapshot);
  // Sempre que salvar, limpamos o redo
  redoStack = [];
    marcarComoModificado();

}

export function desfazer() {
  if (undoStack.length === 0) return;
  const last = undoStack.pop()!;
  const currentSnapshot: StateSnapshot = {
    containers: JSON.parse(JSON.stringify(state.containers)),
    elements: JSON.parse(JSON.stringify(state.elements)),
    background: JSON.parse(JSON.stringify(state.background)),
  };
  redoStack.push(currentSnapshot);
  state.containers = last.containers;
  state.elements = last.elements;
  state.background = last.background;
  atualizarPreview();
}

export function refazer() {
  if (redoStack.length === 0) return;
  const next = redoStack.pop()!;
  salvarEstado(); // empurra o estado atual para o undo
  state.containers = next.containers;
  state.elements = next.elements;
  state.background = next.background;
  atualizarPreview();
}
