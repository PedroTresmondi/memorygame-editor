const fs = require("fs");

function lerJSON(caminho, callback) {
  fs.readFile(caminho, "utf8", (err, data) => {
    if (err) return callback(err);
    try {
      const json = JSON.parse(data || "[]");
      callback(null, json);
    } catch (parseErr) {
      callback(parseErr);
    }
  });
}

function salvarJSON(caminho, dados, callback) {
  fs.writeFile(caminho, JSON.stringify(dados, null, 2), (err) => {
    if (err) return callback(err);
    callback(null);
  });
}

module.exports = { lerJSON, salvarJSON };
