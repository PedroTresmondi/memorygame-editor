const fs = require("fs");
const path = require("path");

function rotaConfiguracao(req, res) {
  if (req.url === "/salvar-configuracao" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const novosDados = JSON.parse(body);
        const caminho = path.join(__dirname, "../data/configuracao.json");

        fs.readFile(caminho, "utf8", (err, conteudoAtual) => {
          let atual = {};
          try {
            atual = JSON.parse(conteudoAtual || "{}");
          } catch {
            atual = {};
          }

          atual.visual = novosDados;

          fs.writeFile(caminho, JSON.stringify(atual, null, 2), (err) => {
            if (err) return res.writeHead(500).end("Erro ao salvar");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ sucesso: true }));
          });
        });
      } catch {
        res.writeHead(400).end("JSON inválido");
      }
    });
    return true;
  }

  if (req.url === "/configuracao" && req.method === "GET") {
    const caminho = path.join(__dirname, "../data/configuracao.json");
    fs.readFile(caminho, "utf8", (err, data) => {
      if (err) return res.writeHead(500).end("Erro ao ler configuração");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
    return true;
  }

  return false;
}

module.exports = rotaConfiguracao;
