import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import rotaCadastro from "./routes/cadastro.js";
import rotaConfiguracao from "./routes/configuracao.js";
import rotaEstoque from "./routes/estoque.js";
import rotaImagens from "./routes/imagens.js";
import rotaRegistro from "./routes/registro.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5500;

// Arquivos iniciais
const arquivosIniciais = {
  "estoque.json": "[]",
  "registros.json": "[]",
  "cadastroJogadores.json": "[]",
  "cadastroCompleto.json": "[]",
  "configuracao.json": "{}",
  "configCadastro.json": "[]",
};

// Garante que a pasta e arquivos existam
for (const [arquivo, conteudo] of Object.entries(arquivosIniciais)) {
  const caminho = path.join(__dirname, "data", arquivo);
  if (!fs.existsSync(caminho)) fs.writeFileSync(caminho, conteudo);
}

const server = http.createServer((req, res) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
  console.log(log);

  // Habilita CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Rota: salvar configCadastro
  if (req.method === "POST" && req.url === "/salvar-config-cadastro") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const caminho = path.join(__dirname, "data", "configCadastro.json");
      try {
        fs.writeFileSync(caminho, body);
        res.writeHead(200).end("OK");
      } catch (err) {
        res.writeHead(500).end("Erro ao salvar JSON");
      }
    });
    return;
  }

  // Rota: obter configCadastro.json
  if (req.method === "GET" && req.url === "/data/configCadastro.json") {
    const caminho = path.join(__dirname, "data", "configCadastro.json");
    fs.readFile(caminho, (err, content) => {
      if (err) {
        res.writeHead(404).end("Arquivo não encontrado");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(content);
      }
    });
    return;
  }

  // Rotas adicionais delegadas
  const handled =
    rotaCadastro(req, res) ||
    rotaConfiguracao(req, res) ||
    rotaEstoque(req, res) ||
    rotaImagens(req, res) ||
    rotaRegistro(req, res);

  // Arquivos estáticos (html, js, css, imagens)
  if (!handled) {
    const filePath = path.join(
      __dirname,
      "../public",
      decodeURIComponent(req.url === "/" ? "index.html" : req.url)
    );

    const ext = path.extname(filePath);
    const contentTypes = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
    };
    const contentType = contentTypes[ext] || "application/octet-stream";

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404).end("Arquivo não encontrado");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      }
    });
  }
});

server.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
