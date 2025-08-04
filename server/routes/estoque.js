const { lerJSON, salvarJSON } = require("../utils/fileUtils");

function rotaEstoque(req, res) {
  const caminho = "./server/data/estoque.json";

  if (req.url === "/estoque" && req.method === "GET") {
    lerJSON(caminho, (err, dados) => {
      if (err) return res.writeHead(500).end("Erro ao ler estoque");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(dados));
    });
    return true;
  }

  if (req.url === "/estoque" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const json = JSON.parse(body);
        salvarJSON(caminho, json, (err) => {
          if (err) return res.writeHead(500).end("Erro ao salvar estoque");
          res.writeHead(200).end("Estoque salvo com sucesso");
        });
      } catch {
        res.writeHead(400).end("JSON inválido");
      }
    });
    return true;
  }

  if (req.url === "/estoque/editar" && req.method === "PUT") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { nomeAntigo, nomeNovo } = JSON.parse(body);
      lerJSON(caminho, (err, estoque) => {
        const item = estoque.find((b) => b.nome === nomeAntigo);
        if (!item) return res.writeHead(404).end("Brinde não encontrado");
        item.nome = nomeNovo;
        salvarJSON(caminho, estoque, (err) => {
          if (err) return res.writeHead(500).end("Erro ao salvar");
          res.writeHead(200).end("Nome atualizado");
        });
      });
    });
    return true;
  }

  if (req.url === "/estoque/remover" && req.method === "DELETE") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { nome } = JSON.parse(body);
      lerJSON(caminho, (err, estoque) => {
        const novo = estoque.filter((b) => b.nome !== nome);
        salvarJSON(caminho, novo, (err) => {
          if (err) return res.writeHead(500).end("Erro ao salvar");
          res.writeHead(200).end("Removido com sucesso");
        });
      });
    });
    return true;
  }

  return false;
}

module.exports = rotaEstoque;
