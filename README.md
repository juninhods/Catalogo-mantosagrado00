# Manto Sagrado — catálogo refatorado

## O que foi implementado

- `index.html`: somente estrutura da página.
- `style.css`: estilos separados.
- `script.js`: catálogo, navegação, carrinho, personalização, checkout e WhatsApp.
- `server.js`: proxy seguro para a API da SuperFrete.
- `package.json`: dependência do servidor.
- `.env.example`: variáveis de ambiente.
- `LICENSE`: licença original fornecida.

## 1. Configurar o catálogo

Abra `script.js` e altere:

```js
CEP_ORIGEM: "00000-000",
API_BASE_URL: ""
```

Coloque o CEP real de onde os pedidos são enviados.

Se o backend estiver hospedado em outro domínio, informe a URL dele em `API_BASE_URL`.

Também ajuste, se necessário, as dimensões/peso padrão:

```js
PRODUTO_FRETE: {
  pesoKg: 0.35,
  alturaCm: 5,
  larguraCm: 25,
  comprimentoCm: 35
}
```

Essas medidas são uma configuração estimada e devem ser substituídas pelas medidas reais da embalagem.

## 2. SuperFrete

A chave/token da SuperFrete NÃO deve ficar no `script.js`.

No servidor:

```bash
npm install
```

Crie um arquivo `.env` baseado em `.env.example`:

```env
SUPERFRETE_TOKEN=SEU_TOKEN
FRONTEND_ORIGIN=https://SEU-USUARIO.github.io
SUPERFRETE_USER_AGENT=Manto Sagrado Catalogo/1.0 (seu-email@dominio.com)
```

Depois:

```bash
npm start
```

O servidor ficará em:

```text
http://localhost:3000
```

Para publicar o site no GitHub Pages, publique apenas os arquivos estáticos (`index.html`, `style.css`, `script.js` e pasta `imagens`).

O `server.js` precisa ficar hospedado em um serviço que rode Node.js, como Render, Railway, VPS ou outro serviço compatível.

Depois coloque a URL desse backend em `API_BASE_URL`.

## 3. Fluxo do cliente

1. Cliente escolhe a camisa.
2. O site pergunta:
   - Camisa lisa
   - Personalizada + R$ 60
3. Se personalizada, o cliente informa o que deseja.
4. A camisa entra no carrinho já com o adicional.
5. Cliente escolhe:
   - Calcular frete
   - Combinar entrega em mãos
6. No frete, informa o CEP.
7. O site consulta a SuperFrete.
8. O cliente escolhe transportadora/serviço.
9. O total é atualizado com o frete.
10. O WhatsApp recebe todos os itens, personalizações, transportadora, frete e total.

## Importante

A SuperFrete exige autenticação Bearer e `User-Agent` na API. O token fica somente no servidor para não expô-lo no código público do GitHub Pages.

O cálculo utiliza CEP de origem/destino e peso/dimensões da embalagem. Confirme as medidas reais da sua embalagem para evitar diferença entre cotação e postagem.
