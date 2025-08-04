const { lerJSON, salvarJSON } = require("../utils/fileUtils");

function rotaRegistro(req, res) {
  const caminho = "./server/data/registros.json";

  if (req.url === "/registros" && req.method === "GET") {
    lerJSON(caminho, (err, dados) => {
      if (err) return res.writeHead(500).end("Erro ao ler registros");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(dados));
    });
    return true;
  }

  if (req.url === "/registrar" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const novo = JSON.parse(body);
        lerJSON(caminho, (err, registros) => {
          registros.push(novo);
          salvarJSON(caminho, registros, (err) => {
            if (err) return res.writeHead(500).end("Erro ao salvar");
            res.writeHead(200).end("Registro adicionado");
          });
        });
      } catch {
        res.writeHead(400).end("JSON inválido");
      }
    });
    return true;
  }

  return false;
}

module.exports = rotaRegistro;
