const express = require("express");

const app = express();
app.use(express.json({ limit: "100kb" }));

// server.js (Seu Backend)
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/frete', async (req, res) => {
  const { cepDestino } = req.body;

  try {
    const response = await fetch("https://sandbox.superfrete.com/api/v0/calculator", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "User-Agent": "amauripcfexdc@gmail.com",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODkzMzY0MTIsInN1YiI6Ikt5YUJUSW5oa3dadHdERkF1U21CbHVLVk5KSzIifQ.b4jaeX26r4_C_WWKlNZBe3B5GdrvxbwFwNHkdzOlR88"
      },
      body: JSON.stringify({
        from: { postal_code: "01153000" },
        to: { postal_code: cepDestino },
        services: "1,2,17",
        package: { weight: 0.3, height: 5, width: 15, length: 20 },
        options: { own_hand: false, receipt: false, insurance_value: 0, use_insurance_value: false }
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar frete" });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));