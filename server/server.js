import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import formidable from "formidable";

import rotaCadastro from "./routes/cadastro.js";
import rotaConfiguracao from "./routes/configuracao.js";
import rotaEstoque from "./routes/estoque.js";
import rotaImagens from "./routes/imagens.js";
import rotaRegistro from "./routes/registro.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5500;

const pastaData = path.join(__dirname, "data");
const pastaAssets = path.join(__dirname, "../public/assets");
const pastaTemp = path.join(__dirname, "temp_uploads");

// Garante que as pastas necessárias existam
if (!fs.existsSync(pastaData)) fs.mkdirSync(pastaData);
if (!fs.existsSync(pastaAssets)) fs.mkdirSync(pastaAssets, { recursive: true });
if (!fs.existsSync(pastaTemp)) fs.mkdirSync(pastaTemp, { recursive: true });

// Arquivos iniciais
const arquivosIniciais = {
  "estoque.json": "[]",
  "registros.json": "[]",
  "cadastroJogadores.json": "[]",
  "cadastroCompleto.json": "[]",
  "configuracao.json": "{}",
  "configCadastro.json": "[]",
};

// Garante que os arquivos existam
for (const [arquivo, conteudo] of Object.entries(arquivosIniciais)) {
  const caminho = path.join(pastaData, arquivo);
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
    res.writeHead(204).end();
    return;
  }

  // Rota: salvar configCadastro
  if (req.method === "POST" && req.url === "/salvar-config-cadastro") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const caminho = path.join(pastaData, "configCadastro.json");
      try {
        fs.writeFileSync(caminho, body);
        res.writeHead(200).end("OK");
      } catch (err) {
        console.error("Erro ao salvar configCadastro:", err);
        res.writeHead(500).end("Erro ao salvar JSON");
      }
    });
    return;
  }

  // Rota: obter configCadastro.json
  if (req.method === "GET" && req.url === "/data/configCadastro.json") {
    const caminho = path.join(pastaData, "configCadastro.json");
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

  // Rota: upload de imagem
  if (req.method === "POST" && req.url === "/upload") {
    const form = formidable({
      multiples: false,
      uploadDir: pastaTemp,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Erro no parse do formulário:", err);
        res.writeHead(500).end("Erro ao processar upload");
        return;
      }

      const folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder;
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file || !file.filepath || !file.originalFilename) {
        console.error("Arquivo inválido:", file);
        res.writeHead(400).end("Arquivo inválido");
        return;
      }

      const destinoPasta = path.join(pastaAssets, folder || "logo");
      if (!fs.existsSync(destinoPasta)) fs.mkdirSync(destinoPasta, { recursive: true });

      const destinoFinal = path.join(destinoPasta, file.originalFilename);

      fs.rename(file.filepath, destinoFinal, (err) => {
        if (err) {
          console.error("Erro ao mover imagem:", err);
          res.writeHead(500).end("Erro ao mover imagem");
          return;
        }

        const caminhoRelativo = `/assets/${folder}/${file.originalFilename}`;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ filePath: caminhoRelativo }));
      });
    });

    return;
  }

  // Rotas delegadas para arquivos externos
  const handled =
    rotaCadastro(req, res) ||
    rotaConfiguracao(req, res) ||
    rotaEstoque(req, res) ||
    rotaImagens(req, res) ||
    rotaRegistro(req, res);

  // Arquivos estáticos
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
      ".ts": "application/javascript",
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
