const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const SUPERFRETE_TOKEN = process.env.SUPERFRETE_TOKEN;
const SUPERFRETE_USER_AGENT = process.env.SUPERFRETE_USER_AGENT;
const SUPERFRETE_BASE_URL = process.env.SUPERFRETE_BASE_URL || "https://api.superfrete.com";

if (!SUPERFRETE_TOKEN) console.warn("SUPERFRETE_TOKEN não configurado.");

app.use(express.json({ limit: "100kb" }));

app.use((req, res, next) => {
  const origin = req.get("origin");
  const allowedOrigins = [FRONTEND_ORIGIN, "http://localhost:3000", "http://127.0.0.1:5500"].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (!FRONTEND_ORIGIN) {
    // Endpoint público de cotação; não usa cookies/credenciais.
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (_req, res) => res.json({ status: "ok", service: "Manto Sagrado - cálculo de frete" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/frete", async (req, res) => {
  const cepDestino = String(req.body?.cepDestino || "").replace(/\D/g, "");
  const quantidade = Math.max(1, Math.min(20, Number(req.body?.quantidade) || 1));

  if (!/^\d{8}$/.test(cepDestino)) {
    return res.status(400).json({ error: "Informe um CEP válido com 8 números." });
  }

  if (!SUPERFRETE_TOKEN || !SUPERFRETE_USER_AGENT) {
    return res.status(503).json({ error: "A calculadora de frete ainda não está configurada." });
  }

  try {
    const response = await fetch(`${SUPERFRETE_BASE_URL}/api/v0/calculator`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": SUPERFRETE_USER_AGENT,
        Authorization: `Bearer ${SUPERFRETE_TOKEN}`,
      },
      body: JSON.stringify({
        from: { postal_code: process.env.CEP_ORIGEM || "11900000" },
        to: { postal_code: cepDestino },
        services: process.env.SUPERFRETE_SERVICES || "1,2,17",
        package: {
          weight: Number((0.35 * quantidade).toFixed(3)),
          height: 5 * quantidade,
          width: 25,
          length: 35
        },
        options: { own_hand: false, receipt: false, insurance_value: 0, use_insurance_value: false },
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      console.error("SuperFrete:", response.status, data);
      return res.status(response.status).json({ error: "Não foi possível calcular o frete.", details: data });
    }

    res.json(data);
  } catch (error) {
    console.error("Falha ao consultar a SuperFrete:", error);
    res.status(502).json({ error: "Não foi possível conectar à SuperFrete. Tente novamente." });
  }
});

app.listen(PORT, () => console.log(`Servidor escutando na porta ${PORT}`));
