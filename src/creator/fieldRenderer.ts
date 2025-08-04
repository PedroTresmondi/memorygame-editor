import { state, type Campo, type Container } from "./state";
import { isPreviewMode } from "./previewMode";
import { snapToGrid } from "./utils";
import { atualizarPreview } from "./previewRenderer";
import { atualizarPainelCampo } from "./campoEditor";

export function renderCampos(
  containerDiv: HTMLDivElement,
  container: Container
) {
  container.fields.forEach((campo) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("campo-wrapper");
    wrapper.style.position = "absolute";
    wrapper.style.top = campo.top + "px";
    wrapper.style.left = campo.left + "px";
    wrapper.style.width = (campo.width || 220) + "px";
    wrapper.style.height = "auto";
    wrapper.style.cursor = isPreviewMode() ? "default" : "move";
    wrapper.style.zIndex = "5";
    wrapper.style.border = isPreviewMode()
      ? "none"
      : campo.id === state.campoSelecionado
      ? "2px solid #007bff"
      : "1px dashed #ccc";
    wrapper.style.background = "#fff";
    wrapper.style.padding = "4px";
    wrapper.style.boxSizing = "border-box";

    const btnRemoveCampo = document.createElement("button");
    btnRemoveCampo.textContent = "❌";
    btnRemoveCampo.style.position = "absolute";
    btnRemoveCampo.style.top = "2px";
    btnRemoveCampo.style.left = "2px";
    btnRemoveCampo.style.zIndex = "20";
    btnRemoveCampo.style.display = isPreviewMode() ? "none" : "block";
    btnRemoveCampo.addEventListener("click", (e) => {
      e.stopPropagation();
      container.fields = container.fields.filter((f) => f.id !== campo.id);
      atualizarPreview();
    });
    wrapper.appendChild(btnRemoveCampo);

    if (!isPreviewMode()) {
      wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        state.campoSelecionado = campo.id;
        state.containerSelecionado = container.id;
        atualizarPreview();
        atualizarPainelCampo();
      });
    }

    const label = document.createElement("label");
    label.textContent = campo.label;
    label.style.fontSize = "14px";
    label.style.background = "none";
    label.style.padding = "0";
    label.style.margin = "0";
    label.style.lineHeight = "1";

    const input = document.createElement("input");
    input.type = campo.type;
    input.placeholder = campo.placeholder ?? "";
    input.required = campo.required || false;
    input.maxLength = campo.maxLength || 255;
    input.style.height = "40px";
    input.style.boxSizing = "border-box";

    // Posicionamento da label
    if (campo.labelPosition === "left") {
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "row";
      wrapper.style.alignItems = "center";
      wrapper.style.minHeight = "50px";

      label.style.marginRight = "8px";
      label.style.marginBottom = "0";
      label.style.flexShrink = "0";
      label.style.whiteSpace = "nowrap";
      input.style.flex = "1";
    } else {
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.minHeight = "70px";

      label.style.display = "block";
      label.style.marginBottom = "4px";
      label.style.flexShrink = "0";
      input.style.width = "100%";
    }

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    const resizeHandleInput = document.createElement("div");
    resizeHandleInput.classList.add("resize-handle");
    resizeHandleInput.style.position = "absolute";
    resizeHandleInput.style.right = "0";
    resizeHandleInput.style.bottom = "0";
    resizeHandleInput.style.width = "10px";
    resizeHandleInput.style.height = "10px";
    resizeHandleInput.style.background = "#000";
    resizeHandleInput.style.cursor = "ew-resize";
    if (!isPreviewMode()) wrapper.appendChild(resizeHandleInput);

    if (!isPreviewMode()) {
      let isDraggingField = false;
      let offsetX = 0;
      let offsetY = 0;

      wrapper.addEventListener("mousedown", (e) => {
        if ((e.target as HTMLElement).classList.contains("resize-handle"))
          return;
        isDraggingField = true;
        const wrapperRect = wrapper.getBoundingClientRect();
        offsetX = e.clientX - wrapperRect.left;
        offsetY = e.clientY - wrapperRect.top;
        e.stopPropagation();

        const onMove = (e: MouseEvent) => {
          if (!isDraggingField) return;
          const parent = containerDiv;
          const parentRect = parent.getBoundingClientRect();
          campo.left = snapToGrid(e.clientX - parentRect.left - offsetX);
          campo.top = snapToGrid(e.clientY - parentRect.top - offsetY);
          atualizarPreview();
        };

        const onStop = () => {
          isDraggingField = false;
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onStop);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onStop);
      });

      resizeHandleInput.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        let isResizing = true;
        let startX = e.clientX;

        const onResize = (e: MouseEvent) => {
          if (!isResizing) return;
          const dx = e.clientX - startX;
          campo.width = snapToGrid((campo.width || 220) + dx);
          startX = e.clientX;
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
  });
}
