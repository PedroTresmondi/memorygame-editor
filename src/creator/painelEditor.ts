import { state } from "./state";
import { atualizarPreview } from "./previewRenderer";

// Presets internos
const defaultPresets: Record<string, Record<string, string>> = {
  clean: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "16px",
  },
  classic: {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "14px",
  },
  dark: {
    backgroundColor: "#222",
    color: "#fff",
    border: "1px solid #444",
  },
};

const userPresetsKey = "userPresets";

// Valida valor de estilo
function validarEstilo(prop: string, valor: string): string | null {
  if (["width", "height", "borderRadius", "fontSize", "padding", "margin"].includes(prop)) {
    return /^\d+px$/.test(valor) ? null : "Use px (ex: 10px)";
  }
  if (["backgroundColor", "color", "borderColor"].includes(prop)) {
    const s = new Option().style;
    s.color = valor;
    return s.color !== "" ? null : "Cor inválida";
  }
  return null;
}

export function abrirPainelPropriedades(elemento: any) {
  const painel = document.getElementById("painelPropriedades")!;
  const conteudo = document.getElementById("conteudoPropriedades")!;
  painel.style.display = "block";
  conteudo.innerHTML = "";

  // Carrega presets do usuário
  let userPresets: Record<string, Record<string, string>> = {};
  try {
    userPresets = JSON.parse(localStorage.getItem(userPresetsKey) || "{}");
  } catch {}

  // Controles padronizados
  const propriedadesComuns = [
    { key: "width", label: "Largura", type: "range", min: 50, max: 1000 },
    { key: "height", label: "Altura", type: "range", min: 20, max: 500 },
    { key: "margin", label: "Margem", type: "text" },
    { key: "padding", label: "Padding", type: "text" },
    { key: "border", label: "Borda", type: "text" },
    { key: "borderRadius", label: "Arredondamento", type: "range", min: 0, max: 100 },
    { key: "backgroundColor", label: "Cor de Fundo", type: "color" },
    { key: "color", label: "Cor do Texto", type: "color" },
    { key: "fontSize", label: "Tamanho da Fonte", type: "text" },
    {
      key: "fontWeight",
      label: "Peso da Fonte",
      type: "select",
      options: [
        { label: "Normal", value: "normal" },
        { label: "Negrito", value: "bold" },
        { label: "Muito Negrito", value: "900" },
      ],
    },
    {
      key: "textAlign",
      label: "Alinhamento",
      type: "select",
      options: [
        { label: "Esquerda", value: "left" },
        { label: "Centro", value: "center" },
        { label: "Direita", value: "right" },
      ],
    },
  ];

  const específicas: Record<string, any[]> = {
    text: [{ key: "content", label: "Conteúdo", type: "textarea" }],
    button: [{ key: "label", label: "Texto do Botão", type: "text" }],
    image: [
      {
        key: "objectFit",
        label: "Ajuste da Imagem",
        type: "select",
        options: [
          { label: "Preencher", value: "fill" },
          { label: "Conter", value: "contain" },
          { label: "Cobrir", value: "cover" },
        ],
      },
    ],
  };

  const todasProps = [
    ...propriedadesComuns,
    ...(específicas[elemento.type] || []),
  ];

  // ---------- UI Presets ----------
  if (elemento.placeholder !== undefined) {
    // Seletor de presets
    const preWrapper = document.createElement("div");
    preWrapper.style.marginBottom = "12px";

    const lblPre = document.createElement("label");
    lblPre.textContent = "Preset de Estilo";
    lblPre.style.display = "block";
    preWrapper.appendChild(lblPre);

    const selPre = document.createElement("select");
    selPre.style.width = "100%";
    // opções padrões
    Object.keys(defaultPresets).forEach((k) => {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = k;
      selPre.appendChild(opt);
    });
    // opções do usuário
    Object.keys(userPresets).forEach((k) => {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = k + " (meu)";
      selPre.appendChild(opt);
    });
    selPre.addEventListener("change", () => {
      const key = selPre.value;
      const preset =
        defaultPresets[key] || userPresets[key] || {};
      Object.entries(preset).forEach(([p, v]) => {
        elemento[p] = v;
      });
      atualizarPreview();
      abrirPainelPropriedades(elemento);
    });
    preWrapper.appendChild(selPre);

    // Input + botão salvar novo preset
    const saveWrapper = document.createElement("div");
    saveWrapper.style.display = "flex";
    saveWrapper.style.marginTop = "8px";

    const inpName = document.createElement("input");
    inpName.type = "text";
    inpName.placeholder = "Nome do preset...";
    inpName.style.flex = "1";
    saveWrapper.appendChild(inpName);

    const btnSave = document.createElement("button");
    btnSave.textContent = "Salvar preset";
    btnSave.style.marginLeft = "4px";
    btnSave.addEventListener("click", () => {
      const name = inpName.value.trim();
      if (!name) { alert("Informe um nome."); return; }
      // coleta valores
      const novo: Record<string,string> = {};
      todasProps.forEach(p => {
        novo[p.key] = elemento[p.key] || "";
      });
      // salva
      userPresets[name] = novo;
      localStorage.setItem(userPresetsKey, JSON.stringify(userPresets));
      abrirPainelPropriedades(elemento);
    });
    saveWrapper.appendChild(btnSave);

    preWrapper.appendChild(saveWrapper);
    conteudo.appendChild(preWrapper);
  }

  // ---------- Controles individuais ----------
  todasProps.forEach((prop) => {
    const wrap = document.createElement("div");
    wrap.style.marginBottom = "10px";
    wrap.style.position = "relative";

    const lbl = document.createElement("label");
    lbl.textContent = prop.label;
    lbl.style.display = "block";
    wrap.appendChild(lbl);

    const atual = elemento[prop.key] || "";

    if (prop.type === "select") {
      const s = document.createElement("select");
      prop.options.forEach((opt:any)=> {
        const o = document.createElement("option");
        o.value=opt.value; o.textContent=opt.label;
        if(atual===opt.value) o.selected=true;
        s.appendChild(o);
      });
      s.addEventListener("change", ()=>{ elemento[prop.key]=s.value; atualizarPreview(); });
      wrap.appendChild(s);

    } else if (prop.type==="color") {
      const i = document.createElement("input");
      i.type="color";
      try{ i.value = atual.startsWith("#")? atual:"#000000"; }
      catch{ i.value="#000000"; }
      i.addEventListener("input",()=>{ elemento[prop.key]=i.value; atualizarPreview(); });
      wrap.appendChild(i);

    } else if (prop.type==="range") {
      const r = document.createElement("input");
      r.type="range"; r.min=String(prop.min||0); r.max=String(prop.max||500);
      r.value = parseInt(atual.toString())+""||"0";
      const out = document.createElement("span");
      out.textContent = r.value+"px";
      r.addEventListener("input",()=>{
        elemento[prop.key]=r.value+"px";
        out.textContent=r.value+"px";
        atualizarPreview();
      });
      wrap.appendChild(r); wrap.appendChild(out);

    } else if (prop.type==="textarea") {
      const ta=document.createElement("textarea");
      ta.value=atual; ta.rows=3; ta.style.width="100%";
      ta.addEventListener("input",()=>{ elemento[prop.key]=ta.value; atualizarPreview(); });
      wrap.appendChild(ta);

    } else {
      // text + validação
      const i = document.createElement("input");
      i.type="text"; i.value=atual; i.style.width="100%";
      const err=document.createElement("div");
      err.style.color="red"; err.style.fontSize="11px"; err.style.marginTop="2px"; err.style.display="none";
      const validate=()=>{
        const m=validarEstilo(prop.key, i.value);
        if(m){
          err.textContent="⚠️ "+m; err.style.display="block"; i.style.border="1px solid red";
        } else {
          err.style.display="none"; i.style.border="";
          elemento[prop.key]=i.value; atualizarPreview();
        }
      };
      i.addEventListener("input", validate);
      wrap.appendChild(i); wrap.appendChild(err);
    }

    conteudo.appendChild(wrap);
  });
}