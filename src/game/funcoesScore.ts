import { getFaixasScore, setFaixasScore } from "./estadoConfiguracao";
import { atualizarResumo } from "./funcoesResumo";

interface FaixaScore {
  min: number;
  max: number;
  brinde: string;
  imagem: string;
}

export function adicionarFaixa(): void {
  const minInput = document.getElementById("score-min") as HTMLInputElement;
  const maxInput = document.getElementById("score-max") as HTMLInputElement;
  const brindeSelect = document.getElementById("brinde-faixa") as HTMLSelectElement;

  const min = parseInt(minInput.value);
  const max = parseInt(maxInput.value);
  const brinde = brindeSelect.value;

  let valido = true;
  if (isNaN(min)) {
    minInput.style.borderColor = "red";
    valido = false;
  }
  if (isNaN(max) || max < min) {
    maxInput.style.borderColor = "red";
    valido = false;
  }
  if (!brinde) {
    brindeSelect.style.borderColor = "red";
    valido = false;
  }
  if (!valido) {
    alert("Preencha corretamente a faixa de score.");
    return;
  }

  const imagem = brindeSelect.selectedOptions[0]?.dataset.imagem || "sem-imagem.png";
  const novas: FaixaScore[] = [...getFaixasScore(), { min, max, brinde, imagem }];
  setFaixasScore(novas);
  atualizarFaixas();
  atualizarResumo();

  minInput.value = "";
  maxInput.value = "";
  brindeSelect.selectedIndex = 0;
}

export function removerFaixa(index: number): void {
  const faixas = [...getFaixasScore()];
  faixas.splice(index, 1);
  setFaixasScore(faixas);
  atualizarFaixas();
  atualizarResumo();
}

export function atualizarFaixas(): void {
  const container = document.getElementById("faixas-container") as HTMLDivElement;
  const faixas = getFaixasScore();

  container.innerHTML = "";

  faixas.forEach((faixa, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;margin-bottom:10px;border:1px solid #ccc;border-radius:8px;background:#f9f9f9">
        <div style="display:flex;align-items:center;">
          <img src="./assets/brindes/${faixa.imagem}" style="width:50px;height:50px;border-radius:50%;margin-right:15px">
          <div><strong>${faixa.brinde}</strong><br>Score de <strong>${faixa.min}</strong> até <strong>${faixa.max}</strong></div>
        </div>
        <button data-index="${index}" class="btn-remover-faixa">Remover</button>
      </div>`;
    container.appendChild(div);
  });

  container.querySelectorAll(".btn-remover-faixa").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = Number((e.currentTarget as HTMLElement).getAttribute("data-index"));
      removerFaixa(index);
    });
  });
}
