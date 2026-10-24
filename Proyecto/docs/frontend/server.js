
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 5020;
const API_HOST = "127.0.0.1";
const API_PORT = 3000;
const FRONTEND_DIR = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Reenvía las solicitudes /api/... a la API de Node.js.
  // Esto evita que el navegador bloquee las solicitudes por CORS.
  if (url.pathname.startsWith("/api/")) {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: url.pathname + url.search,
      method: req.method,
      headers: {
        ...req.headers,
        host: `${API_HOST}:${API_PORT}`
      }
    };

    const proxy = http.request(options, (apiRes) => {
      res.writeHead(apiRes.statusCode || 502, apiRes.headers);
      apiRes.pipe(res);
    });

    proxy.on("error", () => {
      if (!res.headersSent) {
        res.writeHead(502, {
          "Content-Type": "application/json; charset=utf-8"
        });
      }

      res.end(JSON.stringify({
        success: false,
        error: "No se pudo conectar con la API del puerto 3000."
      }));
    });

    req.pipe(proxy);
    return;
  }

  const requestedPath =
    url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);

  const filePath = path.resolve(
    FRONTEND_DIR,
    "." + requestedPath
  );

  if (
    filePath !== FRONTEND_DIR &&
    !filePath.startsWith(FRONTEND_DIR + path.sep)
  ) {
    res.writeHead(403);
    res.end("Acceso denegado");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
      });
      res.end("Archivo no encontrado");
      return;
    }

    const contentType =
      MIME_TYPES[path.extname(filePath).toLowerCase()] ||
      "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType
    });

    res.end(content);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Interfaz de Farmacia Galeno: http://localhost:${PORT}`);
  console.log(`API configurada en: http://localhost:${API_PORT}`);
});

server.on("error", (error) => {
  console.error("No se pudo iniciar la interfaz:", error.message);
});
