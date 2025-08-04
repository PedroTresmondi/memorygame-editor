import { state, type Campo } from "./state";
import { snapToGrid } from "./utils";
import { isPreviewMode } from "./previewMode";
import { atualizarPreview } from "./previewRenderer";

export function renderCampo(campo: Campo, containerDiv: HTMLDivElement, containerFields: Campo[]) {
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.top = campo.top + "px";
  wrapper.style.left = campo.left + "px";
  wrapper.style.width = (campo.width || 220) + "px";
  wrapper.style.cursor = isPreviewMode() ? "default" : "move";

  const btnRemoveCampo = document.createElement("button");
  btnRemoveCampo.textContent = "❌";
  btnRemoveCampo.style.position = "absolute";
  btnRemoveCampo.style.top = "2px";
  btnRemoveCampo.style.left = "2px";
  btnRemoveCampo.style.zIndex = "20";
  btnRemoveCampo.style.display = isPreviewMode() ? "none" : "block";
  btnRemoveCampo.addEventListener("click", (e) => {
    e.stopPropagation();
    const index = containerFields.findIndex(f => f.id === campo.id);
    if (index !== -1) containerFields.splice(index, 1);
    atualizarPreview();
  });
  wrapper.appendChild(btnRemoveCampo);

  const label = document.createElement("label");
  label.textContent = campo.label;
  label.style.display = "block";
  label.style.marginBottom = "4px";
  if (!isPreviewMode()) {
    label.addEventListener("dblclick", () => {
      const novoTexto = prompt("Novo texto para o label:", campo.label);
      if (novoTexto) {
        campo.label = novoTexto;
        atualizarPreview();
      }
    });
  }

  const input = document.createElement("input");
  input.type = campo.type;
  input.placeholder = campo.placeholder || campo.label;
  input.required = campo.required || false;
  input.maxLength = campo.maxLength || 255;
  input.style.width = "100%";
  input.style.height = "40px";
  input.style.boxSizing = "border-box";
  input.disabled = isPreviewMode();

  const resizeHandle = document.createElement("div");
  resizeHandle.classList.add("resize-handle");
  resizeHandle.style.position = "absolute";
  resizeHandle.style.right = "0";
  resizeHandle.style.bottom = "0";
  resizeHandle.style.width = "10px";
  resizeHandle.style.height = "10px";
  resizeHandle.style.background = "#000";
  resizeHandle.style.cursor = "ew-resize";
  resizeHandle.style.display = isPreviewMode() ? "none" : "block";

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(resizeHandle);

  // Drag
  if (!isPreviewMode()) {
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    wrapper.addEventListener("mousedown", (e) => {
      if ((e.target as HTMLElement).classList.contains("resize-handle")) return;
      isDragging = true;
      dragOffsetX = e.offsetX;
      dragOffsetY = e.offsetY;
      e.stopPropagation();

      const onMoveField = (e: MouseEvent) => {
        if (!isDragging) return;
        campo.left = snapToGrid(campo.left + e.movementX);
        campo.top = snapToGrid(campo.top + e.movementY);
        atualizarPreview();
      };

      const onStopField = () => {
        isDragging = false;
        document.removeEventListener("mousemove", onMoveField);
        document.removeEventListener("mouseup", onStopField);
      };

      document.addEventListener("mousemove", onMoveField);
      document.addEventListener("mouseup", onStopField);
    });
  }

  // Resize
  if (!isPreviewMode()) {
    let isResizing = false;
    let startResizeX = 0;

    resizeHandle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      isResizing = true;
      startResizeX = e.clientX;

      const onResize = (e: MouseEvent) => {
        if (!isResizing) return;
        const dx = e.clientX - startResizeX;
        campo.width = snapToGrid((campo.width || 220) + dx);
        startResizeX = e.clientX;
        atualizarPreview();
      };

      const onStopResize = () => {
        isResizing = false;
        document.removeEventListener("mousemove", onResize);
        document.removeEventListener("mouseup", onStopResize);
      };

      document.addEventListener("mousemove", onResize);
      document.addEventListener("mouseup", onStopResize);
    });
  }

  containerDiv.appendChild(wrapper);
}

export function adicionarCampo(containerId: string, campo: Campo) {
  const container = state.containers.find(c => c.id === containerId);
  if (!container) return;
  container.fields.push(campo);
  atualizarPreview();
}
