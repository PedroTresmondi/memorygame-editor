interface Registro {
  data: string;
  configuracao: string;
}

let registros: Registro[] = [];

export function adicionarRegistro(texto: string): void {
  const data = new Date().toLocaleString("pt-BR");
  const novoRegistro: Registro = {
    data,
    configuracao: texto,
  };

  registros.unshift(novoRegistro);
  atualizarListaRegistros();
}

export function atualizarListaRegistros(): void {
  const lista = document.getElementById("lista-registros") as HTMLDivElement;
  const contador = document.getElementById("contador-registros") as HTMLSpanElement;

  if (!lista || !contador) return;

  lista.innerHTML = "";

  registros.forEach((reg) => {
    const div = document.createElement("div");
    div.style.marginBottom = "10px";

    const dataSpan = document.createElement("span");
    dataSpan.style.fontWeight = "bold";
    dataSpan.textContent = reg.data;

    const pre = document.createElement("pre");
    pre.textContent = reg.configuracao;

    div.appendChild(dataSpan);
    div.appendChild(document.createElement("br"));
    div.appendChild(pre);

    lista.appendChild(div);
  });

  contador.innerText = registros.length.toString();
}

export function resetarRegistros(): void {
  registros = [];
  atualizarListaRegistros();
}

export function getRegistros(): Registro[] {
  return registros;
}

export function setRegistros(novosRegistros: Registro[]): void {
  registros = novosRegistros;
  atualizarListaRegistros();
}
