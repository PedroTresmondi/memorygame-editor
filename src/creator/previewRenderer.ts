import { state } from "./state";
import {
  removerContainer,
  enableContainerDragAndResize,
} from "./containerManager";
import { isPreviewMode } from "./previewMode";
import { renderCampos } from "./fieldRenderer";
import { atualizarPainelCampo } from "./campoEditor";

export function atualizarPreview() {
  const previewForm = document.getElementById("previewForm")!;
  const previewWrapper = document.getElementById("previewWrapper")!;
  previewForm.innerHTML = "";

  state.containers.forEach((container) => {
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("container-box");
    containerDiv.style.position = "relative";
    containerDiv.style.top = container.top + "px";
    containerDiv.style.left = container.left + "px";
    containerDiv.style.width = container.width + "px";
    containerDiv.style.height = container.height + "px";
    containerDiv.style.border =
      container.id === state.containerSelecionado
        ? "2px solid #007bff"
        : "2px dashed #999";
    containerDiv.style.background = "#ffffffcc";
    containerDiv.style.overflow = "hidden";
    containerDiv.dataset.id = container.id;

    containerDiv.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isPreviewMode()) return;
      state.containerSelecionado = container.id;
      state.campoSelecionado = null;
      atualizarPreview();
    });

    const btnRemoveContainer = document.createElement("button");
    btnRemoveContainer.textContent = "🗑️";
    btnRemoveContainer.style.position = "absolute";
    btnRemoveContainer.style.top = "4px";
    btnRemoveContainer.style.right = "4px";
    btnRemoveContainer.style.zIndex = "20";
    btnRemoveContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isPreviewMode()) return;
      removerContainer(container.id);
    });
    containerDiv.appendChild(btnRemoveContainer);

    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");
    resizeHandle.style.position = "absolute";
    resizeHandle.style.right = "0";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.width = "20px";
    resizeHandle.style.height = "20px";
    resizeHandle.style.background = "#007bff";
    resizeHandle.style.cursor = "nwse-resize";
    resizeHandle.style.zIndex = "30";
    containerDiv.appendChild(resizeHandle);

    enableContainerDragAndResize(containerDiv, container);
    renderCampos(containerDiv, container);
    previewForm.appendChild(containerDiv);
  });

  if (state.background.type === "color") {
    previewWrapper.style.background = state.background.value;
  } else {
    previewWrapper.style.background = `url('${state.background.value}') no-repeat center center`;
    previewWrapper.style.backgroundSize = "cover";
  }

  // Só atualiza o painel se houver campo selecionado
  atualizarPainelCampo();
}
