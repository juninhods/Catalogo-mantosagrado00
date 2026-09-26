const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

const SUPERFRETE_TOKEN = process.env.SUPERFRETE_TOKEN;

const SUPERFRETE_USER_AGENT = process.env.SUPERFRETE_USER_AGENT;

const SUPERFRETE_BASE_URL =
  process.env.SUPERFRETE_BASE_URL || "https://api.superfrete.com";

if (!SUPERFRETE_TOKEN) {
  console.warn("SUPERFRETE_TOKEN não configurado.");
}

app.use(express.json({ limit: "100kb" }));

/* =========================================================
   CORS
========================================================= */

app.use((req, res, next) => {
  const origin = req.get("origin");

  const allowedOrigins = [
    "https://www.mantosagrado00.com.br",
    "https://mantosagrado00.com.br",
    "https://juninhods.github.io",
    FRONTEND_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:5500",
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
/* =========================================================
   ARQUIVOS DO SITE
========================================================= */

/*
  O Render passa a servir:
  
  index.html
  style.css
  script.js
  imagens/
  etc.
  
  diretamente da pasta do projeto.
*/

app.use(express.static(path.join(__dirname)));

/* =========================================================
   PÁGINA PRINCIPAL
========================================================= */

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/* =========================================================
   API SUPERFRETE
========================================================= */

app.post("/api/frete", async (req, res) => {
  const cepDestino = String(req.body?.cepDestino || "").replace(/\D/g, "");

  if (!/^\d{8}$/.test(cepDestino)) {
    return res.status(400).json({
      error: "Informe um CEP válido com 8 números.",
    });
  }

  if (!SUPERFRETE_TOKEN || !SUPERFRETE_USER_AGENT) {
    return res.status(503).json({
      error: "A calculadora de frete ainda não está configurada.",
    });
  }

  try {
    const response = await fetch(
      `${SUPERFRETE_BASE_URL}/api/v0/calculator`,
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": SUPERFRETE_USER_AGENT,
          Authorization: `Bearer ${SUPERFRETE_TOKEN}`,
        },

        body: JSON.stringify({
          from: {
            postal_code: "11900000",
          },

          to: {
            postal_code: cepDestino,
          },

          services: "1,2,17,3,33,31",

          package: {
            weight: 0.3,
            height: 5,
            width: 15,
            length: 20,
          },

          options: {
            own_hand: false,
            receipt: false,
            insurance_value: 0,
            use_insurance_value: false,
          },
        }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("SuperFrete:", response.status, data);

      return res.status(response.status).json({
        error: "Não foi possível calcular o frete.",
        details: data,
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Falha ao consultar a SuperFrete:", error);

    res.status(502).json({
      error: "Não foi possível conectar à SuperFrete. Tente novamente.",
    });
  }
});

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

app.listen(PORT, () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});