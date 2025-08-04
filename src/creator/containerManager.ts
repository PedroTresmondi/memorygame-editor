import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";
import { isPreviewMode } from "./previewMode";
import { snapToGrid } from "./utils";
import { mostrarGuiaDinamica } from "./snapAssist";

export function adicionarContainer() {
  const id = `container${state.containers.length + 1}`;
  const novoContainer = {
    id,
    top: 100,
    left: 100,
    width: 300,
    height: 400,
    fields: [],
  };
  state.containers.push(novoContainer);
  state.containerSelecionado = id;
  atualizarPreview();
}

export function removerContainer(id: string) {
  state.containers = state.containers.filter((c) => c.id !== id);
  if (state.containerSelecionado === id) state.containerSelecionado = null;
  atualizarPreview();
}

export function enableContainerDragAndResize(
  containerDiv: HTMLDivElement,
  container: (typeof state.containers)[number]
) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  containerDiv.addEventListener("mousedown", (e) => {
    if (isPreviewMode()) return;
    if ((e.target as HTMLElement).classList.contains("resize-handle")) return;
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    state.containerSelecionado = container.id;

    const moveContainer = (e: MouseEvent) => {
      if (!isDragging) return;
      const previewForm = document.getElementById("previewForm");
      if (!previewForm) return;

      const parentRect = previewForm.getBoundingClientRect();
      const newLeft = snapToGrid(e.clientX - parentRect.left - offsetX);
      const newTop = snapToGrid(e.clientY - parentRect.top - offsetY);

      container.left = newLeft;
      container.top = newTop;

      // 🔵 Snap assist com guias visuais
      const wrapper = document.getElementById("previewWrapper")!;
      const wrapperWidth = wrapper.clientWidth;
      const wrapperHeight = wrapper.clientHeight;

      const centerPreviewX = wrapperWidth / 2;
      const centerPreviewY = wrapperHeight / 2;
      const centerContainerX = container.left + container.width / 2;
      const centerContainerY = container.top + container.height / 2;
      const threshold = 15;

      if (Math.abs(centerContainerX - centerPreviewX) < threshold) {
        container.left = snapToGrid(centerPreviewX - container.width / 2);
        mostrarGuiaDinamica("x");
      }

      if (Math.abs(centerContainerY - centerPreviewY) < threshold) {
        container.top = snapToGrid(centerPreviewY - container.height / 2);
        mostrarGuiaDinamica("y");
      }

      atualizarPreview();
    };

    const stopContainer = () => {
      isDragging = false;
      document.removeEventListener("mousemove", moveContainer);
      document.removeEventListener("mouseup", stopContainer);
    };

    document.addEventListener("mousemove", moveContainer);
    document.addEventListener("mouseup", stopContainer);
  });

  const resizeHandle = containerDiv.querySelector(
    ".resize-handle"
  ) as HTMLDivElement | null;
  if (resizeHandle) {
    resizeHandle.addEventListener("mousedown", (e) => {
      if (isPreviewMode()) return;
      e.stopPropagation();
      let isResizing = true;
      let startX = e.clientX;
      let startY = e.clientY;

      const moveResize = (e: MouseEvent) => {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        container.width = Math.max(100, snapToGrid(container.width + dx));
        container.height = Math.max(100, snapToGrid(container.height + dy));
        startX = e.clientX;
        startY = e.clientY;
        atualizarPreview();
      };

      const stopResize = () => {
        isResizing = false;
        document.removeEventListener("mousemove", moveResize);
        document.removeEventListener("mouseup", stopResize);
      };

      document.addEventListener("mousemove", moveResize);
      document.addEventListener("mouseup", stopResize);
    });
  }
}
