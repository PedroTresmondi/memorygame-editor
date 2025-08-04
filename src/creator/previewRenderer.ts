import { state } from "./state";
import {
  removerContainer,
  enableContainerDragAndResize,
} from "./containerManager";
import { isPreviewMode } from "./previewMode";
import { renderCampos } from "./fieldRenderer";
import { atualizarPainelCampo } from "./campoEditor";
import { abrirPainelElemento } from "./painelElemento";
import { abrirPainelPropriedades } from "./painelEditor";

export function atualizarPreview() {
  const previewForm = document.getElementById("previewForm")!;
  const previewWrapper = document.getElementById("previewWrapper")!;
  previewForm.innerHTML = "";

  // Containers
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

  // Fundo
  if (state.background.type === "color") {
    previewWrapper.style.background = state.background.value;
  } else {
    previewWrapper.style.background = `url('${state.background.value}') no-repeat center center`;
    previewWrapper.style.backgroundSize = "cover";
  }

  // Elementos extras
  state.elements.forEach((el) => {
    const elDiv = document.createElement("div");
    elDiv.style.position = "absolute";
    elDiv.style.top = el.top + "px";
    elDiv.style.left = el.left + "px";
    elDiv.style.width = el.width + "px";
    elDiv.style.height = (el.height ?? 40) + "px";
    elDiv.style.cursor = isPreviewMode() ? "default" : "move";
    elDiv.style.zIndex = "10";
    elDiv.dataset.id = el.id;

    elDiv.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isPreviewMode()) return;
      abrirPainelPropriedades(el);
    });

    const btnRemove = document.createElement("button");
    btnRemove.textContent = "🗑️";
    btnRemove.style.position = "absolute";
    btnRemove.style.top = "0";
    btnRemove.style.right = "0";
    btnRemove.style.zIndex = "99";
    btnRemove.addEventListener("click", (e) => {
      e.stopPropagation();
      state.elements = state.elements.filter((i) => i.id !== el.id);
      atualizarPreview();
    });

    if (el.type === "button") {
      const btn = document.createElement("button");
      btn.textContent = el.label || "Botão";
      btn.style.width = "100%";
      btn.style.height = "100%";

      // APLICA OS ESTILOS PERSONALIZADOS
      if (el.backgroundColor) btn.style.backgroundColor = el.backgroundColor;
      if (el.color) btn.style.color = el.color;
      if (el.borderRadius) btn.style.borderRadius = el.borderRadius;
      if (el.fontSize) btn.style.fontSize = el.fontSize;
      if (el.fontWeight) btn.style.fontWeight = el.fontWeight;
      if (el.textAlign) btn.style.textAlign = el.textAlign;
      if (el.padding) btn.style.padding = el.padding;
      if (el.boxShadow) btn.style.boxShadow = el.boxShadow;

      elDiv.appendChild(btn);
      elDiv.appendChild(btnRemove);
    }

    if (el.type === "image") {
      const img = document.createElement("img");
      img.src = el.src || "";
      img.alt = el.alt || "";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      if (el.borderRadius) img.style.borderRadius = el.borderRadius;
      if (el.boxShadow) img.style.boxShadow = el.boxShadow;

      const resizeHandle = document.createElement("div");
      resizeHandle.style.position = "absolute";
      resizeHandle.style.right = "0";
      resizeHandle.style.bottom = "0";
      resizeHandle.style.width = "16px";
      resizeHandle.style.height = "16px";
      resizeHandle.style.background = "#007bff";
      resizeHandle.style.cursor = "nwse-resize";
      resizeHandle.style.zIndex = "20";

      let resizing = false;
      resizeHandle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        resizing = true;
      });
      window.addEventListener("mousemove", (e) => {
        if (!resizing) return;
        el.width = e.clientX - elDiv.getBoundingClientRect().left;
        el.height = e.clientY - elDiv.getBoundingClientRect().top;
        atualizarPreview();
      });
      window.addEventListener("mouseup", () => {
        resizing = false;
      });

      elDiv.appendChild(img);
      elDiv.appendChild(btnRemove);
      elDiv.appendChild(resizeHandle);
    }

    if (el.type === "text") {
      const p = document.createElement("p");
      p.textContent = el.content || "Texto";
      p.style.margin = "0";
      p.style.padding = el.padding || "0";
      p.style.width = "100%";
      p.style.height = "100%";
      p.style.fontSize = el.fontSize || "16px";
      p.style.color = el.color || "#000";
      p.style.fontWeight = el.fontWeight || "normal";
      p.style.textAlign = el.textAlign || "left";
      p.style.backgroundColor = el.backgroundColor || "transparent";
      if (el.borderRadius) p.style.borderRadius = el.borderRadius;
      if (el.boxShadow) p.style.boxShadow = el.boxShadow;

      const resizeHandle = document.createElement("div");
      resizeHandle.style.position = "absolute";
      resizeHandle.style.right = "0";
      resizeHandle.style.bottom = "0";
      resizeHandle.style.width = "16px";
      resizeHandle.style.height = "16px";
      resizeHandle.style.background = "#007bff";
      resizeHandle.style.cursor = "nwse-resize";
      resizeHandle.style.zIndex = "20";

      let resizing = false;
      resizeHandle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        resizing = true;
      });

      window.addEventListener("mousemove", (e) => {
        if (!resizing) return;
        el.width = e.clientX - elDiv.getBoundingClientRect().left;
        el.height = e.clientY - elDiv.getBoundingClientRect().top;
        atualizarPreview();
      });

      window.addEventListener("mouseup", () => {
        resizing = false;
      });

      elDiv.appendChild(p);
      elDiv.appendChild(btnRemove);
      elDiv.appendChild(resizeHandle);
    }

    function getCurrentZoom(): number {
      const slider = document.getElementById("zoomSlider") as HTMLInputElement;
      return slider ? parseFloat(slider.value || "1") : 1;
    }

    if (!isPreviewMode()) {
      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;

      elDiv.addEventListener("mousedown", (e) => {
        const target = e.target as HTMLElement;

        // NÃO INICIA DRAG se clicou no botão de remover ou no resizer
        if (
          target.closest("button")?.textContent === "🗑️" ||
          target.classList.contains("resize-handle")
        )
          return;

        dragging = true;

        const bounds = previewWrapper.getBoundingClientRect();
        const scale = getCurrentZoom();

        offsetX = e.clientX - bounds.left - el.left * scale;
        offsetY = e.clientY - bounds.top - el.top * scale;
        e.stopPropagation();

        const onMove = (e: MouseEvent) => {
          if (!dragging) return;

          const bounds = previewWrapper.getBoundingClientRect();
          const scale = getCurrentZoom();

          el.left = (e.clientX - bounds.left - offsetX) / scale;
          el.top = (e.clientY - bounds.top - offsetY) / scale;

          atualizarPreview();
        };

        const onUp = () => {
          dragging = false;
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    }

    previewForm.appendChild(elDiv);
  });

  atualizarPainelCampo();
}
