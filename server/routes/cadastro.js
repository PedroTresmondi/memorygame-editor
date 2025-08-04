const fs = require("fs");
const path = require("path");

function rotaCadastro(req, res) {
  if (req.url === "/salvar-config-cadastro" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const json = JSON.parse(body);
        const caminho = path.join(__dirname, "../data", "configCadastro.json");
        fs.writeFile(caminho, JSON.stringify(json, null, 2), (err) => {
          if (err) return res.writeHead(500).end("Erro ao salvar");
          res.writeHead(200).end("Cadastro salvo com sucesso");
        });
      } catch {
        res.writeHead(400).end("JSON inválido");
      }
    });
    return true;
  }

  if (req.url === "/config-cadastro" && req.method === "GET") {
    const caminho = path.join(__dirname, "../data", "configCadastro.json");
    fs.readFile(caminho, "utf8", (err, data) => {
      if (err) return res.writeHead(500).end("Erro ao ler cadastro");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
    return true;
  }

  return false;
}

module.exports = rotaCadastro;
