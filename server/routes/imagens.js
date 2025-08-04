const fs = require("fs");
const path = require("path");

function rotaImagens(req, res) {
  if (req.url === "/listar-cartas" && req.method === "GET") {
    const pasta = path.join(__dirname, "../public/assets/cartas");
    fs.readdir(pasta, (err, arquivos) => {
      if (err) return res.writeHead(500).end("Erro ao listar cartas");
      const imagens = arquivos.filter((a) => a.match(/\.(png|jpe?g)$/i));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(imagens));
    });
    return true;
  }

  if (req.url === "/listar-brindes" && req.method === "GET") {
    const pasta = path.join(__dirname, "../public/assets/brindes");
    fs.readdir(pasta, (err, arquivos) => {
      if (err) return res.writeHead(500).end("Erro ao listar brindes");
      const imagens = arquivos.filter((a) => a.match(/\.(png|jpe?g)$/i));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(imagens));
    });
    return true;
  }

  if (req.url === "/upload-carta" && req.method === "POST") {
    const boundary = req.headers["content-type"].split("boundary=")[1];
    if (!boundary) return res.writeHead(400).end("Boundary ausente");

    let data = Buffer.alloc(0);
    req.on("data", (chunk) => (data = Buffer.concat([data, chunk])));
    req.on("end", () => {
      const dataStr = data.toString();
      const nomeMatch = dataStr.match(/name="nomeOriginal"\r\n\r\n(.+?)\r\n/);
      if (!nomeMatch) return res.writeHead(400).end("nomeOriginal ausente");
      const nomeOriginal = nomeMatch[1].trim();

      const filePart = dataStr
        .split(`--${boundary}`)
        .find((part) => part.includes("filename="));
      if (!filePart)
        return res
          .writeHead(400)
          .end("Arquivo não encontrado no corpo da requisição");

      const fileStart = filePart.indexOf("\r\n\r\n") + 4;
      const fileEnd = filePart.lastIndexOf("\r\n");
      const fileContent = filePart.slice(fileStart, fileEnd);

      const buffer = Buffer.from(fileContent, "binary");
      const savePath = path.join(
        __dirname,
        "../public/assets/cartas",
        nomeOriginal
      );

      fs.writeFile(savePath, buffer, (err) => {
        if (err) return res.writeHead(500).end("Erro ao salvar imagem");
        res.writeHead(200).end("Upload concluído com sucesso");
      });
    });
    return true;
  }

  return false;
}

module.exports = rotaImagens;
