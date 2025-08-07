// Tipagens para configuração de dificuldade, faixas e regras
export interface ConfiguracaoDificuldade {
  dificuldade: string;
  cartas: number;
  tempo: number;
  tempoMemorizacao: number;
  tempoPopup: number;
}

export interface FaixaScore {
  min: number;
  max: number;
  brinde: string;
}

export interface RegrasJogo {
  hudTempo: boolean;
  hudTempoValor: number;
  hudPontos: boolean;
  hudParesEncontrados: boolean;
  hudTotalPares: boolean;
  bonusTempo: boolean;
  tempoBonus: number;
  popupAcerto: boolean;
  tempoPopup: number;
}

// Estado interno
let configuracaoDificuldade: ConfiguracaoDificuldade | null = null;
let faixasScore: FaixaScore[] = [];
let regrasJogo: RegrasJogo = {
  hudTempo: false,
  hudTempoValor: 120,
  hudPontos: false,
  hudParesEncontrados: false,
  hudTotalPares: false,
  bonusTempo: true,
  tempoBonus: 5,
  popupAcerto: true,
  tempoPopup: 3,
};

// Funções de acesso
export function setConfiguracaoDificuldade(config: ConfiguracaoDificuldade): void {
  configuracaoDificuldade = config;
}

export function getConfiguracaoDificuldade(): ConfiguracaoDificuldade | null {
  return configuracaoDificuldade;
}

export function setFaixasScore(faixas: FaixaScore[]): void {
  faixasScore = faixas;
}

export function getFaixasScore(): FaixaScore[] {
  return faixasScore;
}

export function setRegrasJogo(regras: RegrasJogo): void {
  regrasJogo = regras;
}

export function getRegrasJogo(): RegrasJogo {
  return regrasJogo;
}
