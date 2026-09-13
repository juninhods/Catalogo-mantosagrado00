const express = require("express");

const app = express();
app.use(express.json({ limit: "100kb" }));

const PORT = process.env.PORT || 3000;
const SUPERFRETE_TOKEN = process.env.SUPERFRETE_TOKEN;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
const USER_AGENT = process.env.SUPERFRETE_USER_AGENT || "Manto Sagrado Catalogo/1.0 (contato@mantosagrado.com)";

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_ORIGIN);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "Manto Sagrado - Frete" });
});

app.post("/api/frete", async (req, res) => {
  try {
    if (!SUPERFRETE_TOKEN) {
      return res.status(500).json({ error: "SUPERFRETE_TOKEN não configurado no servidor." });
    }

    const { origem, destino, services = [1, 2, 17, 3, 33, 31], items = [], valorDeclarado = 0 } = req.body || {};

    const limparCep = (cep) => String(cep || "").replace(/\D/g, "");
    const from = limparCep(origem);
    const to = limparCep(destino);

    if (!/^\d{8}$/.test(from) || !/^\d{8}$/.test(to)) {
      return res.status(400).json({ error: "CEP de origem ou destino inválido." });
    }

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "O carrinho não possui produtos." });
    }

    // Processa os produtos para o formato aceito pela API SuperFrete
    const products = items.map(item => ({
      quantity: Math.max(1, Number(item.quantidade) || 1),
      weight: Number(item.pesoKg) || 0.35,
      height: Number(item.alturaCm) || 5,
      width: Number(item.larguraCm) || 25,
      length: Number(item.comprimentoCm) || 35
    }));

    // Converte os serviços enviados para um array de inteiros (ex: [1, 2, 17])
    const servicesArray = Array.isArray(services)
      ? services.map(Number)
      : String(services).split(",").map(s => parseInt(s.trim(), 10)).filter(Boolean);

    const payload = {
      from: { postal_code: from },
      to: { postal_code: to },
      services: servicesArray,
      options: {
        own_hand: false,
        receipt: false,
        insurance_value: Number(valorDeclarado) || 0,
        use_insurance_value: false
      },
      products
    };

    const response = await fetch("https://api.superfrete.com/api/v0/calculator", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPERFRETE_TOKEN}`,
        "User-Agent": USER_AGENT,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || data?.error || "A SuperFrete recusou a cotação.",
        details: data
      });
    }

    return res.json(data);
  } catch (error) {
    console.error("Erro no proxy de frete:", error);
    return res.status(500).json({ error: "Erro interno ao consultar a SuperFrete." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de frete ativo na porta ${PORT}`);
});