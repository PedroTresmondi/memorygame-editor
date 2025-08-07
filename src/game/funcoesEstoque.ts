interface Brinde {
  nome: string;
  imagem: string;
  quantidade: number;
}

// Carrega o estoque do servidor e renderiza no painel e no <select>
export async function carregarEstoque(): Promise<void> {
  try {
    const res = await fetch("/estoque");
    const estoque: Brinde[] = await res.json();

    const lista = document.getElementById("lista-estoque")!;
    const select = document.getElementById("brinde-faixa") as HTMLSelectElement;

    lista.innerHTML = "";
    select.innerHTML = "";

    estoque.forEach((brinde, index) => {
      const imagemTag = brinde.imagem
        ? `<img src="./assets/brindes/${brinde.imagem}" alt="${brinde.nome}" style="width: 40px; height: 40px; vertical-align: middle; margin-right: 10px; border-radius: 50%; object-fit: cover;">`
        : `<span style="color: red;">[sem imagem]</span>`;

      const div = document.createElement("div");
      div.style.marginBottom = "10px";
      div.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
            ${imagemTag}
            <strong id="nome-brinde-${index}">${brinde.nome}</strong>
          </div>
          <div style="display: flex; flex-direction: column;">
            <div>
              Quantidade:
              <input type="number" id="quant-${index}" value="${brinde.quantidade}" style="width: 60px; margin-right: 10px;">
              <button onclick="atualizarQuantidade(${index}, '${brinde.nome}')">Atualizar Qtd</button>
            </div>
            <div class="btn-editar-remover">
              <button onclick="editarNomeBrinde('${brinde.nome}')">✏️ Editar Nome</button>
              <button onclick="removerBrinde('${brinde.nome}')">🗑️ Remover</button>
            </div>
          </div>
        </div>`;

      lista.appendChild(div);

      const option = document.createElement("option");
      option.value = brinde.nome;
      option.innerText = brinde.nome;
      option.dataset.imagem = brinde.imagem;
      select.appendChild(option);
    });
  } catch {
    const lista = document.getElementById("lista-estoque");
    if (lista) lista.innerHTML = "Erro ao carregar estoque.";
  }
}

export async function atualizarQuantidade(index: number, nome: string): Promise<void> {
  const input = document.getElementById(`quant-${index}`) as HTMLInputElement;
  const novaQtd = parseInt(input.value);

  if (isNaN(novaQtd) || novaQtd < 0) return alert("Quantidade inválida.");

  try {
    const estoque: Brinde[] = await (await fetch("/estoque")).json();
    const item = estoque.find((b) => b.nome === nome);
    if (item) item.quantidade = novaQtd;

    await fetch("/estoque", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estoque),
    });

    alert("Estoque atualizado.");
    carregarEstoque();
  } catch {
    alert("Erro ao atualizar estoque.");
  }
}

export async function editarNomeBrinde(nomeAntigo: string): Promise<void> {
  const novoNome = prompt(`Novo nome para "${nomeAntigo}":`);
  if (!novoNome || novoNome.trim() === "") return alert("Nome inválido.");

  try {
    const res = await fetch("/estoque/editar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomeAntigo, nomeNovo: novoNome.trim() }),
    });

    const msg = await res.text();
    alert(msg);
    carregarEstoque();
  } catch {
    alert("Erro ao editar nome.");
  }
}

export async function removerBrinde(nome: string): Promise<void> {
  if (!confirm(`Remover brinde "${nome}"?`)) return;

  try {
    const res = await fetch("/estoque/remover", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });

    const msg = await res.text();
    alert(msg);
    carregarEstoque();
  } catch {
    alert("Erro ao remover brinde.");
  }
}

export async function abrirSeletorImagem(): Promise<void> {
  const container = document.getElementById("lista-imagens")!;
  container.innerHTML = "";
  container.style.display = "flex";

  try {
    const imagens: string[] = await (await fetch("/listar-brindes")).json();
    imagens.forEach((nome) => {
      const img = document.createElement("img");
      img.src = `./assets/brindes/${nome}`;
      img.alt = nome;
      img.title = nome;
      img.onclick = () => selecionarImagemBrinde(nome);
      container.appendChild(img);
    });
  } catch {
    container.innerHTML = "Erro ao carregar imagens.";
  }
}

export function selecionarImagemBrinde(nome: string): void {
  (document.getElementById("imagem-brinde") as HTMLInputElement).value = nome;
  (document.getElementById("imagem-selecionada-texto") as HTMLElement).textContent = `Imagem selecionada: ${nome}`;
  (document.getElementById("lista-imagens") as HTMLElement).style.display = "none";
}

export async function adicionarBrinde(): Promise<void> {
  const nome = (document.getElementById("nome-brinde") as HTMLInputElement).value.trim();
  const quantidade = parseInt((document.getElementById("quantidade-brinde") as HTMLInputElement).value);
  const imagem = (document.getElementById("imagem-brinde") as HTMLInputElement).value.trim();

  if (!nome || isNaN(quantidade) || quantidade <= 0 || !imagem) {
    alert("Preencha nome, imagem e quantidade.");
    return;
  }

  try {
    const estoque: Brinde[] = await (await fetch("/estoque")).json();
    estoque.push({ nome, quantidade, imagem });

    await fetch("/estoque", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estoque),
    });

    (document.getElementById("nome-brinde") as HTMLInputElement).value = "";
    (document.getElementById("quantidade-brinde") as HTMLInputElement).value = "";
    (document.getElementById("imagem-brinde") as HTMLInputElement).value = "";
    carregarEstoque();
  } catch {
    alert("Erro ao adicionar brinde.");
  }
}
