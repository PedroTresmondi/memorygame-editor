import {
  getConfiguracaoDificuldade,
  getFaixasScore,
  getRegrasJogo,
} from "./estadoConfiguracao";

export function atualizarResumo(): void {
  const d = getConfiguracaoDificuldade();
  const faixas = getFaixasScore();
  const regras = getRegrasJogo();
  const resumoDiv = document.getElementById("resumo-config") as HTMLDivElement;

  if (!resumoDiv) return;

  if (!d || Object.keys(d).length === 0) {
    resumoDiv.innerHTML = "Nenhuma configuração definida ainda.";
    return;
  }

  let html = `
    <strong>Dificuldade:</strong> ${d.dificuldade}<br>
    <strong>Cartas (pares):</strong> ${d.cartas} | Total ${d.cartas * 2} cartas<br>
    <strong>Tempo total:</strong> ${d.tempo} segundos<br>
    <strong>Tempo memorização:</strong> ${d.tempoMemorizacao} segundos<br>
    <strong>Tempo popup:</strong> ${d.tempoPopup} segundos<br>
    <br>
    <strong>HUD:</strong><br>
    - Cronômetro: ${regras.hudTempo ? "Sim" : "Não"}<br>
    - Pontuação: ${regras.hudPontos ? "Sim" : "Não"}<br>
    - Pares encontrados: ${regras.hudParesEncontrados ? "Sim" : "Não"}<br>
    - Total de pares: ${regras.hudTotalPares ? "Sim" : "Não"}<br>
    <br>
    <strong>Extras:</strong><br>
    - Bônus tempo: ${regras.bonusTempo ? "Sim" : "Não"} (+${regras.tempoBonus}s)<br>
    - Pop-up acerto: ${regras.popupAcerto ? "Sim" : "Não"} (${regras.tempoPopup}s)<br>
    <br>
    <strong>Faixas de Score:</strong><br>
  `;

  if (faixas.length === 0) {
    html += "- Nenhuma faixa configurada.";
  } else {
    html += faixas
      .map(
        (faixa, i) =>
          `${i + 1}. ${faixa.min} a ${faixa.max} → ${faixa.brinde}`
      )
      .join("<br>");
  }

  resumoDiv.innerHTML = html;
}
