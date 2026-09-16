
// ============================================================
// Melhorias de interface: foto ampliada, tamanhos e frete.
document.addEventListener("DOMContentLoaded", () => {
  const zoom = document.createElement("div");
  zoom.className = "manto-zoom-camisa";
  zoom.setAttribute("role", "dialog");
  zoom.setAttribute("aria-modal", "true");
  zoom.setAttribute("aria-label", "Foto ampliada da camisa");
  zoom.innerHTML = '<button type="button" aria-label="Fechar foto">×</button><img alt="Foto ampliada da camisa">';
  document.body.appendChild(zoom);

  const estilo = document.createElement("style");
  estilo.textContent = ".manto-zoom-camisa{display:none;position:fixed;inset:0;z-index:10000;place-items:center;padding:24px;background:rgba(0,0,0,.88)}.manto-zoom-camisa.aberto{display:grid}.manto-zoom-camisa img{max-width:92vw;max-height:86vh;object-fit:contain;border-radius:10px;background:#fff}.manto-zoom-camisa button{position:absolute;top:18px;right:18px;width:42px;height:42px;border:0;border-radius:50%;font-size:26px;line-height:1;background:#fff;color:#111;cursor:pointer}.manto-foto-camisa{cursor:zoom-in}";
  document.head.appendChild(estilo);

  const fecharZoom = () => zoom.classList.remove("aberto");
  zoom.querySelector("button").addEventListener("click", fecharZoom);
  zoom.addEventListener("click", (event) => { if (event.target === zoom) fecharZoom(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") fecharZoom(); });

  document.addEventListener("click", (event) => {
    const imagem = event.target.closest("img");
    if (!imagem || imagem.closest(".manto-zoom-camisa")) return;
    const cardDaCamisa = imagem.closest(".product-card, .produto-card, .camisa-card, [data-product]");
    const ehFotoDaCamisa = imagem.matches("[data-zoom-camisa], .camisa-img, .camisa-imagem") || Boolean(cardDaCamisa);
    if (!ehFotoDaCamisa) return;

    event.preventDefault();
    imagem.classList.add("manto-foto-camisa");
    zoom.querySelector("img").src = imagem.currentSrc || imagem.src;
    zoom.querySelector("img").alt = imagem.alt || "Foto da camisa";
    zoom.classList.add("aberto");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const localizarModalPedido = () => [...document.querySelectorAll("div")].find((elemento) =>
    elemento.offsetParent && elemento.textContent.includes("Como você quer a camisa?") &&
    [...elemento.querySelectorAll("button")].some((botao) => /adicionar ao carrinho/i.test(botao.textContent))
  );

  const inserirTamanhos = () => {
    const modal = localizarModalPedido();
    if (!modal || modal.querySelector(".manto-tamanhos-pedido")) return;
    const botaoAdicionar = [...modal.querySelectorAll("button")].find((botao) => /adicionar ao carrinho/i.test(botao.textContent));
    if (!botaoAdicionar) return;

    const bloco = document.createElement("fieldset");
    bloco.className = "manto-tamanhos-pedido";
    bloco.innerHTML = `
      <legend>Escolha o tamanho</legend>
      <div class="manto-tamanhos-opcoes">
        ${["P", "M", "G", "GG", "G1"].map((tamanho) => `<label><input type="radio" name="manto-tamanho" value="${tamanho}"><span>${tamanho}</span></label>`).join("")}
      </div>
      <p class="manto-tamanho-erro" aria-live="polite"></p>`;
    botaoAdicionar.parentElement.insertBefore(bloco, botaoAdicionar);

    const estilo = document.createElement("style");
    estilo.textContent = ".manto-tamanhos-pedido{margin:16px 0;border:0;padding:0}.manto-tamanhos-pedido legend{font-size:16px;font-weight:700;margin-bottom:10px}.manto-tamanhos-opcoes{display:flex;flex-wrap:wrap;gap:8px}.manto-tamanhos-opcoes label{position:relative;cursor:pointer}.manto-tamanhos-opcoes input{position:absolute;opacity:0}.manto-tamanhos-opcoes span{display:grid;place-items:center;min-width:48px;height:40px;padding:0 10px;border:1px solid #46605f;border-radius:8px;font-weight:700}.manto-tamanhos-opcoes input:checked+span{background:#00e4c3;color:#061919;border-color:#00e4c3}.manto-tamanhos-opcoes input:focus-visible+span{outline:2px solid #fff;outline-offset:2px}.manto-tamanho-erro{min-height:18px;margin:8px 0 0;color:#ffb4aa;font-size:14px}";
    document.head.appendChild(estilo);
  };

  new MutationObserver(inserirTamanhos).observe(document.body, { childList: true, subtree: true });
  inserirTamanhos();

  document.addEventListener("click", (event) => {
    const botao = event.target.closest("button");
    if (!botao || !/adicionar ao carrinho/i.test(botao.textContent)) return;
    const modal = localizarModalPedido();
    if (!modal || !modal.contains(botao)) return;
    const tamanho = modal.querySelector("input[name='manto-tamanho']:checked");
    const erro = modal.querySelector(".manto-tamanho-erro");
    if (!tamanho) {
      event.preventDefault();
      event.stopImmediatePropagation();
      erro.textContent = "Escolha um tamanho antes de adicionar ao carrinho.";
      return;
    }
    modal.dataset.tamanhoSelecionado = tamanho.value;
    erro.textContent = "";
  }, true);
});

if (false) document.addEventListener("DOMContentLoaded", () => {
  const apiFrete = "https://catalogo-mantosagrado00.onrender.com/api/frete";
  const tamanhoOpcoes = ["P", "M", "G", "GG", "G1"];
  const style = document.createElement("style");
  style.textContent = ".manto-zoom{cursor:zoom-in}.manto-modal{position:fixed;inset:0;z-index:9999;display:none;place-items:center;background:#000c;padding:24px}.manto-modal.aberto{display:grid}.manto-modal img{max-width:92vw;max-height:86vh;border-radius:10px}.manto-modal button{position:absolute;top:18px;right:18px;border:0;border-radius:50%;width:42px;height:42px;font-size:26px;cursor:pointer}.manto-tamanho{width:100%;padding:10px;margin:10px 0;border:1px solid #aaa;border-radius:7px;font:inherit}.manto-frete-resultado{margin-top:10px;line-height:1.5}";
  document.head.appendChild(style);
  const modal = document.createElement("div");
  modal.className = "manto-modal";
  modal.innerHTML = '<button type="button" aria-label="Fechar">×</button><img alt="Imagem ampliada">';
  document.body.appendChild(modal);
  const fechar = () => modal.classList.remove("aberto");
  modal.querySelector("button").onclick = fechar;
  modal.onclick = (event) => { if (event.target === modal) fechar(); };
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") fechar(); });

  const aplicarProdutos = () => {
  const cards = [...document.querySelectorAll(".product-card, .produto-card, .produto, .camisa-card, [data-product], .card")].filter((card) => card.querySelector("img"));
  cards.forEach((card) => {
    const image = card.querySelector("img");
    if (image.dataset.mantoZoom) return;
    image.dataset.mantoZoom = "true";
    image.classList.add("manto-zoom");
    image.addEventListener("click", () => { modal.querySelector("img").src = image.currentSrc || image.src; modal.classList.add("aberto"); });
    if (!card.querySelector(".manto-tamanho")) {
      const select = document.createElement("select");
      select.className = "manto-tamanho";
      select.setAttribute("aria-label", "Selecione o tamanho");
      select.innerHTML = '<option value="" selected disabled>Selecione o tamanho</option>' + tamanhoOpcoes.map((item) => `<option value="${item}">${item}</option>`).join("");
      select.onchange = () => { card.dataset.tamanho = select.value; };
      const action = card.querySelector("button, a");
      (action?.parentElement || card).insertBefore(select, action || null);
    }
  });
  };
  aplicarProdutos();
  new MutationObserver(aplicarProdutos).observe(document.body, { childList: true, subtree: true });

  const cep = document.querySelector("#cep, #cepDestino, input[name='cep'], input[name='cepDestino']");
  const botaoFrete = document.querySelector("#calcularFrete, [data-calcular-frete], .calcular-frete");
  if (!cep) return;
  const resultado = document.createElement("div");
  resultado.className = "manto-frete-resultado";
  resultado.setAttribute("aria-live", "polite");
  cep.insertAdjacentElement("afterend", resultado);
  const calcular = async (event) => {
    event?.preventDefault();
    const cepDestino = cep.value.replace(/\D/g, "");
    if (cepDestino.length !== 8) return void (resultado.textContent = "Informe um CEP válido com 8 números.");
    resultado.textContent = "Calculando frete…";
    try {
      const response = await fetch(apiFrete, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cepDestino }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível calcular o frete.");
      const servicos = Array.isArray(data) ? data : (data.services || data.data || []);
      resultado.innerHTML = servicos.length ? servicos.map((item) => `${item.name || item.service_name || "Entrega"}: <strong>R$ ${Number(item.price || item.total || 0).toFixed(2).replace(".", ",")}</strong>`).join("<br>") : "Nenhuma opção encontrada para este CEP.";
    } catch (error) { resultado.textContent = error.message || "Não foi possível calcular o frete."; }
  };
  if (botaoFrete) botaoFrete.addEventListener("click", calcular);
  else cep.closest("form")?.addEventListener("submit", calcular);
});
// MANTO SAGRADO — CATÁLOGO
// Dados dos produtos + navegação + carrinho + checkout
// ============================================================

const data = {
   "Brasil": {
    img: "imagens/paises/brasil.png",
    ligas: {
      "Brasileirão": {
        img: "imagens/ligas/brasileirao.png",
        times: {
          "Flamengo": {
            img: "imagens/times/flamengo.png",
            camisas: [
               { nome: "Flamengo Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/fla-home26.jpg" },
               { nome: "Flamengo Home 2026 (Feminina)" , preco: "R$ 130", img: "imagens/camisas/fla-homef26.jpg" },
               { nome: "Flamengo Away 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/fla-away26.jpg" },
               { nome: "Flamengo Treino 2026 (Torcedor)" , preco: "R$ 140", img: "imagens/camisas/fla-treino261.jpg" },
              { nome: "Flamengo Third (Torcedor)", preco: "R$ 130", img: "imagens/camisas/fla-third26.jpg" },
              { nome: "Flamengo 2009 (Retrô)", preco: "R$ 150", img: "imagens/camisas/fla_2009.jpg" }
            ]
          },
          "Corinthians": {
            img: "imagens/times/corinthians.png",
            camisas: [
              { nome: "Corinthians Home 2026 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/cor-home26.jpg" },
              { nome: "Corinthians Away 2026 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/cor-away26.jpg" },
              { nome: "Corinthians Total 90 (Torcedor)", preco: "R$ 140", img: "imagens/camisas/cor-total90.jpg" },
              { nome: "Corinthians Treino", preco: "R$ 120", img: "imagens/camisas/cor-treino.jpg" },
              { nome: "Corinthians Treino 2026", preco: "R$ 120", img: "imagens/camisas/cor-treino261.jpg" },
              { nome: "Corinthians All Black (Torcedor)", preco: "R$ 120", img: "imagens/camisas/cor-allblack.jpg" },
              { nome: "Corinthians São Jorge (Retrô)", preco: "R$ 150", img: "imagens/camisas/cor-jorge.jpg" },
              { nome: "Corinthians 2012 (Retrô)", preco: "R$ 150", img: "imagens/camisas/cor-2012.jpg" },
              { nome: "Corinthians 2006 Total 90 (Retrô)", preco: "R$ 150", img: "imagens/camisas/cor-2006.jpg" },
            ]
          },
          "Palmeiras": {
            img: "imagens/times/palmeiras.png",
            camisas: [
              { nome: "Palmeiras Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/pal-home26.jpg" },
              { nome: "Palmeiras Home 2026 (Feminina)", preco: "R$ 130", img: "imagens/camisas/pal-homef26.jpg" },
              { nome: "Palmeiras Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/pal-away26.jpg" },
              { nome: "Palmeiras Away 2026 (Feminina)", preco: "R$ 130", img: "imagens/camisas/pal-awayf26.jpg" },
              { nome: "Palmeiras Avanti Palestra (Torcedor)", preco: "R$ 140", img: "imagens/camisas/pal-avanti2025.jpg" },
              { nome: "Palmeiras 1996 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/pal-rto96.jpg" }
            
            ]
          }, "Santos": {
            img: "imagens/times/santos.png",
            camisas: [
              { nome: "Santos  Home 2026 (Torcedor)", preco: "R$ 140", img: "imagens/camisas/san-home26.jpg" },
              { nome: "Santos  Away 2026 (Torcedor)", preco: "R$ 140", img: "imagens/camisas/san-away26.jpg" },
              { nome: "Santos  CBJR (Torcedor)", preco: "R$ 150", img: "imagens/camisas/san-cbjr.jpg" },
              { nome: "Santos  Home 2012 (Retrô)", preco: "R$ 150", img: "imagens/camisas/san-b2012.jpg" },
              { nome: "Santos  Away 2012 (Retrô)", preco: "R$ 150", img: "imagens/camisas/san-a2012.jpg" }
            ]
          },
          "São Paulo": {
            img: "imagens/times/sp.png",
            camisas: [
              { nome: "São Paulo  Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/sp-home26.jpg" },
              { nome: "São Paulo  Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/sp-away26.jpg" },
               { nome: "São Paulo Third 2026 (Torcedor)", preco: "R$ 140", img: "imagens/camisas/sp-third26.jpg" },
              { nome: "São Paulo  Home 1999(Retrô)", preco: "R$ 150", img: "imagens/camisas/sp-rto.jpg" },
             
            ]
          },
          
          "Fluminense": {
            img: "imagens/times/flu.png",
            camisas: [
              { nome: "Fluminense  Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/flu-home26.jpg" },
              { nome: "Fluminense  Away 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/flu-away26.jpg" },
            ]
          }, 
          "Grêmio": {
            img: "imagens/times/gremio.png",
            camisas: [
              { nome: "Grêmio Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/gremio-home26.jpg" },
              { nome: "Grêmio  Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/gremio-away26.jpg" }
            ]
          },
           "Vasco": {
            img: "imagens/times/vasco.png",
            camisas: [
              { nome: "Vasco Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/vasco-home26.jpg" },
              { nome: "Vasco Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/vasco-away26.jpg" }
            
            ]
          },
           "Botafogo": {
            img: "imagens/times/botafogo.png",
            camisas: [
              { nome: "Botafogo Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/bota-home26.jpg" },
              { nome: "Botafogo  Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/bota-away25.jpg" },
               { nome: "Botafogo  Third 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/bota-third25.jpg" }
            ]
          },
          "Cruzeiro": {
            img: "imagens/times/cruzeiro.png",
            camisas: [
              { nome: "Cruzeiro Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/cruzeiro-home26.jpg" },
              { nome: "Cruzeiro Home 2026 (Feminina)", preco: "R$ 120", img: "imagens/camisas/cruzeiro-homef26.jpg" },
            
            ]
          },
          "Atletico MG": {
            img: "imagens/times/galo.png",
            camisas: [
              { nome: "Atletico MG Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/galo-home26.jpg" },
               { nome: "Atletico MG Home 2026 (Feminina)", preco: "R$ 120", img: "imagens/camisas/galo-homef26.jpg" },
              { nome: "Atletico MG Away 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/galo-away26.jpg" }
              
            ]
          },
           "Bahia": {
            img: "imagens/times/bahia.png",
            camisas: [
              { nome: "Bahia Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/bahia-home26.jpg" },
              
              
            ]
          }

        }
      },

      "Seleção Brasileira": {
        img: "imagens/ligas/cbf.png",
        times: {
          "Seleção Brasileira": {
            img: "imagens/times/cbf.png",
            camisas: [
              { nome: "Brasil Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/brasil-home26.jpg" },
              { nome: "Brasil Home 2026 (Feminina)", preco: "R$ 130", img: "imagens/camisas/brasil-homef26.jpg" },
              { nome: "Brasil Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/brasil-away26.jpg" },
              { nome: "Brasil Away 2026 (Feminina)", preco: "R$ 130", img: "imagens/camisas/brasil-awayf26.jpg" },
              { nome: "Brasil Home 2025 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/brasil-home25.jpg" },
              { nome: "Brasil Retrô 2019 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/brasil-rto19.jpg" },
              { nome: "Brasil Total 90 Retrô 2004 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-rto04.jpg" },
              { nome: "Brasil  Home Retrô 2002 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-rto02.jpg" }, 
              { nome: "Brasil  Away Retrô 2002 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-rto022.jpg" }, 
              { nome: "Brasil  Home Retrô 1998 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-rto98.jpg" }, 
              { nome: "Brasil  Away Retrô 1998 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-rto982.jpg" },
              { nome: "Polo Brasil  (Torcedor)", preco: "R$ 130", img: "imagens/camisas/brasil-treino1.jpg" },
              { nome: "Brasil  Home 2022 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-home22.jpg" },
              { nome: "Brasil  Away 2022 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-away22.jpg" },
            ]
          }
        }
      }
    }
  },

  "Inglaterra": {
    img: "imagens/paises/inglaterra.png",
    ligas: {
      "Premier League": {
        img: "imagens/ligas/premier.png",
        times: {
          "Manchester City": {
            img: "imagens/times/mancity.png",
            camisas: [
              { nome: "Manchester City Home 2026/27 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/city-home26.jpg" },
              { nome: "Manchester City Away 2026/27 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/city-away26.jpg" },
              { nome: "Manchester City Third 2026/27 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/city-third26.jpg" },
              { nome: "Manchester City Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/city-away25.jpg" },
              { nome: "Manchester City Home 2013 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/city-rto13.jpg" }
            ]
          },
          "Manchester United": {
            img: "imagens/times/mu.png",
            camisas: [
              { nome: "Manchester United Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/united-home26.jpg" },
              { nome: "Manchester United Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/united-away26.jpg" },
              { nome: "Manchester United Home 2007/08 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/united-rto0708.jpg" },
              { nome: "Manchester United Away 2007/08 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/united-rto0708awy.jpg" }
            ]
          }
          ,
          "Arsenal": {
            img: "imagens/times/arsenal.png",
            camisas: [
               { nome: "Arsenal Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/arsenal-home26.jpg" },
               { nome: "Arsenal Away 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/arsenal-away26.jpg" },
              { nome: "Arsenal Home 05/06 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/arsenal-rto06.jpg" }
              
            ]
            
          },
          "Chelsea": {
            img: "imagens/times/chelsea.png",
            camisas: [
              { nome: "Chelsea Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/chelsea-home26.jpg" },
              { nome: "Chelsea Home 11/12 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/chelsea-2012.jpg" },
              
            ]
          },
           "Tottenham": {
            img: "imagens/times/spurs.png",
            camisas: [
              { nome: "Tottenham Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/spurs-home25.jpg" },
              { nome: "Tottenham Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/spurs-away25.jpg" },
              
            ]
          },
           "Liverpool": {
            img: "imagens/times/liverpool.png",
            camisas: [
              { nome: "Liverpool Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/liverpool-home26.jpg" },
              

              
            ]
          },
           "NewCastle United": {
            img: "imagens/times/new.png",
            camisas: [
               { nome: "NewCastle United Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/new-home26.jpg" },
             
               
            ]
          },
           "West Ham": {
            img: "imagens/times/westham.png",
            camisas: [
              { nome: "West Ham Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/westham-home25.jpg" },
              { nome: "West Ham Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/westham-away25.jpg" }
              ]
          },
           "Aston Villa": {
            img: "imagens/times/aston.png",
            camisas: [
              { nome: "Aston Villa Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/aston-home25.jpg" },
              { nome: "Aston Villa Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/aston-away25.jpg" },
              ]
          },

          "Wolverhampton": {
            img: "imagens/times/wolves.png",
            camisas: [
              { nome: "Wolverhampton Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/wolves-home25.jpg" },
              ]
          },
          
        }
      }
    }
  },

  "Espanha": {
    img: "imagens/paises/espanha.png",
    ligas: {
      "La Liga": {
        img: "imagens/ligas/laliga.png",
        times: {
          "Real Madrid": {
            img: "imagens/times/realmadrid.png",
            camisas: [
              { nome: "Real Madrid Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/real-home26.jpg" },
               { nome: "Real Madrid Away 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/real-away26.jpg" },
              { nome: "Real Madrid Home 05/06 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/real-rto06.jpg" },
              { nome: "Real Madrid Away 17/18 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/real-rto18.jpg" },
              { nome: "Real Madrid Third 15/16 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/real-rto16.jpg" },
              { nome: "Real Madrid Away 15/16 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/real-rto15.jpg" }
            ]
          },
          "Barcelona": {
            img: "imagens/times/barcelona.png",
            camisas: [
              { nome: "Barcelona Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/barca-home26.jpg" },
               { nome: "Barcelona x Kobe Bryant 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/barca-kobe26.jpg" },
              { nome: "Barcelona Home 15/16 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/barca-rto16.jpg" },
              { nome: "Barcelona Home 14/15 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/barca-rto15.jpg" },
              { nome: "Barcelona Away 07/08 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/barca-rto08.jpg" },
              { nome: "Barcelona Away 14/15 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/barca-rto14.jpg" },
              { nome: "Barcelona Home 05/06 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/barca-rto05.jpg" }
            ]
          },
          "Atlético De Madrid": {
            img: "imagens/times/madrid.png",
            camisas: [
               { nome: "Atlético De Madrid Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/madrid-home26.jpg" },
              { nome: "Atlético De Madrid Home 2017 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/madrid-rto17.jpg" }
            ]
          },
          "Real Betis": {
            img: "imagens/times/betis.png",
            camisas: [
              { nome: "Real Betis Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/betis-home25.jpg" },
              
            ]
          },
          
        }
      }
    }
  },

  "Itália": {
    img: "imagens/paises/italia.png",
    ligas: {
      "Serie A": {
        img: "imagens/ligas/seriea.png",
        times: {
          "Juventus": {
            img: "imagens/times/juventus.png",
            camisas: [
              { nome: "Juventus Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/juve-home25.jpg" },
               { nome: "Juventus Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/juve-away26.jpg" },
              { nome: "Juventus Third 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/juve-third25.jpg" }
            ]
          },
           "Milan": {
            img: "imagens/times/milan.png",
            camisas: [
              { nome: "Milan Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/milan-home26.jpg" },
              { nome: "Milan Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/milan-away25.jpg" },
              { nome: "Milan Home 2007 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/milan-rto0701.jpg" },
               { nome: "Milan Away 2007 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/milan-rto0702.jpg" }

            ]
          },
          "Inter De Milão": {
            img: "imagens/times/inter.png",
            camisas: [
              { nome: "Inter De Milão Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/inter-home26.jpg" },
              { nome: "Inter De Milão Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/inter-away26.jpg" },
               { nome: "Inter De Milão Total 90 04/05 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/inter-total90.jpg" }

            ]
          },
           "Roma": {
            img: "imagens/times/roma.png",
            camisas: [
              { nome: "Roma Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/roma-home25.jpg" },
              { nome: "Roma Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/roma-away25.jpg" },
             

            ]
          },
           "Napoli": {
            img: "imagens/times/napoli.png",
            camisas: [
              { nome: "Napoli Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/nap-home26.jpg" },
              { nome: "Napoli Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/nap-away26.jpg" },
              { nome: "Napoli Away  Special Edition 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/nap-edt251.jpg" },
              { nome: "Napoli Away  Special Edition 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/nap-edt252.jpg" },
             

            ]
          },
          "Lazio": {
            img: "imagens/times/lazio.png",
            camisas: [
              { nome: "Lazio Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/laz-home25.jpg" },
              { nome: "Lazio Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/laz-away25.jpg" },
              { nome: "Lazio Home  99/00 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/laz-rto00.jpg" },
              { nome: "Lazio Away  99/00 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/laz-rto99.jpg" },
             

            ]
          },
        }
      }
    }
  },

  "Alemanha": {
    img: "imagens/paises/alemanha.png",
    ligas: {
      "Bundesliga": {
        img: "imagens/ligas/bundesliga.png",
        times: {
          "Bayern München": {
            img: "imagens/times/bayern.png",
            camisas: [
              { nome: "Bayern München Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/bayern-home26.jpg" },
              { nome: "Bayern München Away 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/bayern-away26.jpg" },
              { nome: "Bayern München Aniversary 125 Years (Torcedor) ", preco: "R$ 120", img: "imagens/camisas/bayern-125.jpg" }
            
            ]
          },
          "Borussia Dortmund": {
            img: "imagens/times/bvb.png",
            camisas: [
              { nome: "Borussia Dortmund Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/bvb-home25.jpg" },
              { nome: "Borussia Dortmund Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/bvb-away25.jpg" },
             
            ]
          },
        }
      }
    }
  },

  "França": {
    img: "imagens/paises/franca.png",
    ligas: {
      "Ligue 1": {
        img: "imagens/ligas/ligue1.png",
        times: {
          "PSG": {
            img: "imagens/times/psg.png",
            camisas: [
              { nome: "PSG Home 2026/27 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/psg-home26.jpg" },
              { nome: "PSG Away 2026/27 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/psg-away26.jpg" },
              { nome: "PSG Away 2024 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/psg-24.jpg" },
              { nome: "PSG Home 17/18 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/psg-rto18.jpg" },

            ]
          },
          "Lyon": {
            img: "imagens/times/lyon.png",
            camisas: [
              { nome: "Lyon Home 2026/27 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/lyon-home26.jpg" },
              

            ]
          },
           "Olympique de Marseille": {
            img: "imagens/times/marselha.png",
            camisas: [
              { nome: "Olympique de Marseille Home 2025/26 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/marselha-home25.jpg" },
              { nome: "Olympique de Marseille Away 2025/26 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/marselha-away25.jpg" },

            ]
          }
        }
      }
    }
  },

  "Holanda": {
    img: "imagens/paises/holanda.png",
    ligas: {
      "Eredivisie": {
        img: "imagens/ligas/eredivisie.png",
        times: {
          "Ajax": {
            img: "imagens/times/ajax.png",
            camisas: [
              { nome: "Ajax Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/ajax-home25.jpg" },
              { nome: "Ajax Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/ajax-away25.jpg" },
              { nome: "Ajax Third 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/ajax-third25.jpg" },
            ]
          },
          "PSV": {
            img: "imagens/times/psv.png",
            camisas: [
              { nome: "PSV Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/psv-home25.jpg" },
            ]
          }
        }
      }
    }
  },
    "Portugal": {
    img: "imagens/paises/portugal.png",
    ligas: {
      "Liga Portugal": {
        img: "imagens/ligas/lgportugal.png",
        times: {
          "Benfica": {
            img: "imagens/times/benfica.png",
            camisas: [
              { nome: "Benfica Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/benfica-home26.jpg" },
              { nome: "Benfica Away 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/benfica-away26.jpg" },
              { nome: "Benfica Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/benfica-away25.jpg" }

            ]
          },
          "Porto": {
            img: "imagens/times/porto.png",
            camisas: [
              { nome: "Porto Home 2026 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/porto_home26.jpg" },
              { nome: "Porto Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/porto_home25.jpg" },
              { nome: "Porto Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/porto_away25.jpg" }

            ]
          },

           "Sporting": {
            img: "imagens/times/sporting.png",
            camisas: [
              { nome: "Sporting Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/sporting-home25.jpg" },
              { nome: "Sporting Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/sporting-away25.jpg" },
              { nome: "Sporting Home 03/04 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/sporting-rto03.jpg" },

            ]
          },

        }
      }
    }
  },

  "Arábia Saudita": {
    img: "imagens/paises/arabia.png",
    ligas: {
      "Saudi Pro League": {
        img: "imagens/ligas/saudi.png",
        times: {
          "Al Nassr": {
            img: "imagens/times/alnassr.png",
            camisas: [
              { nome: "Al Nassr Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/alnassr-home25.jpg" },
              { nome: "Al Nassr Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/alnassr-away25.jpg" }
            ]
          },
           "Al Hilal": {
            img: "imagens/times/alhilal.png",
            camisas: [
              { nome: "Al Hilal Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/alhilal-home25.jpg" },
              { nome: "Al Hilal Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/alhilal-away25.jpg" },
              { nome: "Al Hilal third 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/alhilal-third25.jpg" }
            ]
          },
           "Al Ahli": {
            img: "imagens/times/alahli.png",
            camisas: [
              { nome: "Al Ahli Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/alahli-home25.jpg" },
              { nome: "Al Ahli Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/alahli-away25.jpg" },
             
            ]
          },
        }
      }
    }
  },

  "Estados Unidos": {
    img: "imagens/paises/eua.png",
    ligas: {
      "MLS": {
        img: "imagens/ligas/mls.png",
        times: {
          "Inter Miami": {
            img: "imagens/times/intermiami.png",
            camisas: [
              { nome: "Inter Miami Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/intermiami-home25.jpg" },
              { nome: "Inter Miami Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/intermiami-away25.jpg" }
            ]
          }
        }
      }
    }
  },
  
   "Argentina": {
    img: "imagens/paises/argentina.png",
    ligas: {
      "Liga Argentina": {
        img: "imagens/ligas/ligaargentina.png",
        times: {
          "River Plate": {
            img: "imagens/times/riverplate.png",
            camisas: [
              { nome: "River Plate Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/riverplate-home25.jpg" },
              { nome: "River Plate Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/riverplate-away25.jpg" },
              { nome: "River Plate Home 00/01 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/riverplate-rto00.jpg" }
            ]
          },
          "Boca Juniors": {
            img: "imagens/times/boca.png",
            camisas: [
              { nome: "Boca Jrs Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/boca-home26.jpg" },
              { nome: "Boca Jrs Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/boca-away25.jpg" },
              { nome: "Boca Jrs Home 07/08 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/boca-rto08.jpg" }
            ]
          },
           "Racing": {
            img: "imagens/times/racing.png",
            camisas: [
              { nome: "Racing Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/racing-away25.jpg" }
              
            ]
          },
        }
      }
    }
  },

    "Mexico": {
    img: "imagens/paises/mexico.png",
    ligas: {
      "Liga MX": {
        img: "imagens/ligas/ligamx.png",
        times: {
          "América": {
            img: "imagens/times/america.png",
            camisas: [
              { nome: "America Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/america-home26.jpg" },
              { nome: "America Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/america-away26.jpg" },
             
            ]
          },
          "Tigres": {
            img: "imagens/times/tigres.png",
            camisas: [
              { nome: "Tigres Home 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/tigres-home25.jpg" },
              { nome: "Tigres Away 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/tigres-away25.jpg" },
              { nome: "Tigres Third 2025 (Torcedor)", preco: "R$ 120", img: "imagens/camisas/tigres-third25.jpg" }
            ]
          },
        
        }
      }
    }
  },
   "Japão": {
    img: "imagens/paises/japao.png",
    ligas: {
      "J League": {
        img: "imagens/ligas/Jleague.png",
        times: {
          "Yokohama Marinos": {
            img: "imagens/times/yoko.png",
            camisas: [
              { nome: "Yokohama Marinos Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/yoko-home26.jpg" },
              { nome: "Yokohama Marinos Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/yoko-away26.jpg" },
             
            ]
          },
          "Kashiwa Reysol": {
            img: "imagens/times/kashiwa.png",
            camisas: [
              { nome: "Kashiwa Reysol Home 2025 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/kashi-home26.jpg" },
              { nome: "Kashiwa Reysol Away 2025 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/kashi-away26.jpg" },
            
            ]
          },
          
          "Urawa Red Diamonds": {
            img: "imagens/times/urawa.png",
            camisas: [
              { nome: "Urawa Reds Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/urawa-home26.jpg" },
            
            ]
          },
         "Kawasaki Frontale": {
            img: "imagens/times/kawasaki.png",
            camisas: [
              { nome: "Kawasaki Frontale Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/kawa-home26.jpg" },
              { nome: "Kawasaki Frontale Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/kawa-away26.jpg" },
            
            ]
          },
           "Cerezo Osaka": {
            img: "imagens/times/osaka.png",
            camisas: [
              { nome: "Cerezo Osaka Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/osaka-home26.jpg" },
              { nome: "Cerezo Osaka Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/osaka-away26.jpg" },
            
            ]
          },
        }
      }
    }
  },
    "Turquia": {
    img: "imagens/paises/turquia.png",
    ligas: {
      "Super Lig": {
        img: "imagens/ligas/superlig.png",
        times: {
          "Galatasaray": {
            img: "imagens/times/gala.png",
            camisas: [
              { nome: "Galatasaray Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/gala-home26.jpg" },
              { nome: "Galatasaray Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/gala-away26.jpg" },
             
            ]
          },
        
        }
      }
    }
  },
  
   "Copa Do Mundo": {
    img: "imagens/paises/fifa.png",
    ligas: {
      "Seleções": {
        img: "imagens/ligas/copa26.png",
        times: {
          "Argentina": {
            img: "imagens/times/afa.png",
            camisas: [
              { nome: "Argentina Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/afa-home25.jpg" },
              { nome: "Argentina Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/afa-away25.jpg" },
              { nome: "Argentina Home 2006 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/afa-rto06.jpg" },
              { nome: "Argentina Home Special Edition (Torcedor)", preco: "R$ 130", img: "imagens/camisas/afa-special25.jpg" }
            ]
          },
           "Brasil": {
            img: "imagens/times/cbf.png",
            camisas: [
             { nome: "Brasil Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/brasil-home26.jpg" },
              { nome: "Brasil Home 2026 (Feminina)", preco: "R$ 130", img: "imagens/camisas/brasil-homef26.jpg" },
              { nome: "Brasil Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/brasil-away26.jpg" },
              { nome: "Brasil Away 2026 (Feminina)", preco: "R$ 130", img: "imagens/camisas/brasil-awayf26.jpg" },
              { nome: "Brasil Home 2025 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/brasil-home25.jpg" },
              { nome: "Brasil Retrô 2019 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/brasil-rto19.jpg" },
              { nome: "Brasil Total 90 Retrô 2004 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-rto04.jpg" },
              { nome: "Brasil  Home Retrô 2002 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-rto02.jpg" }, 
              { nome: "Brasil  Away Retrô 2002 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-rto022.jpg" }, 
              { nome: "Brasil  Home Retrô 1998 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-rto98.jpg" }, 
              { nome: "Brasil  Away Retrô 1998 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-rto982.jpg" },
              { nome: "Polo Brasil  (Torcedor)", preco: "R$ 130", img: "imagens/camisas/brasil-treino1.jpg" },
              { nome: "Brasil  Home 2022 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-home22.jpg" },
              { nome: "Brasil  Away 2022 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/brasil-away22.jpg" },
            ]
          },
            "Colômbia": {
            img: "imagens/times/colombia.png",
            camisas: [
              { nome: "Colômbia Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/colombia-home25.jpg" },
              { nome: "Colômbia Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/colombia-away25.jpg" },
              { nome: "Colômbia Special Edition 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/colombia-special25.jpg" },
              
            ]
          },

           "Portugal": {
            img: "imagens/times/portugal.png",
            camisas: [
              { nome: "Portugal Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/portugal-home25.jpg" },
              { nome: "Portugal Away 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/portugal-away25.jpg" },
              { nome: "Portugal Special Edition 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/portugal-special25.jpg" },
              { nome: "Portugal 2016 Retrô (Torcedor)", preco: "R$ 150", img: "imagens/camisas/portugal-rto16.jpg" },
              
            ]
          },
           "Inglaterra": {
            img: "imagens/times/inglaterra.png",
            camisas: [
              { nome: "Inglaterra Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/inglaterra-home25.jpg" },
              { nome: "Inglaterra Away 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/inglaterra-away25.jpg" },
              { nome: "Inglaterra 1996 Retrô (Torcedor) ", preco: "R$ 150", img: "imagens/camisas/inglaterra-rto96.jpg" },
              
            ]
          },
           "França": {
            img: "imagens/times/franca.png",
            camisas: [
              { nome: "França Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/franca-home25.jpg" },
              { nome: "França Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/franca-away25.jpg" },
              { nome: "França Home 1998 Retrô (Torcedor) ", preco: "R$ 150", img: "imagens/camisas/franca-rto98.jpg" },
               { nome: "França Away 1998 Retrô (Torcedor) ", preco: "R$ 150", img: "imagens/camisas/franca-rto982.jpg" },
              
            ]
          },
           "Noruega": {
            img: "imagens/times/noruega.png",
            camisas: [
              { nome: "Noruega Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/noruega-home25.jpg" },
              { nome: "Noruega Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/noruega-away25.jpg" },
              
            ]
          },
          "Holanda": {
            img: "imagens/times/holanda.png",
            camisas: [
              { nome: "Holanda Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/holanda-home25.jpg" },
              { nome: "Holanda Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/holanda-away25.jpg" },
              { nome: "Holanda Home Total 90 Retrô (Torcedor) ", preco: "R$ 150", img: "imagens/camisas/holanda-total1.jpg" },
               { nome: "Holanda Away Total 90  Retrô (Torcedor) ", preco: "R$ 150", img: "imagens/camisas/holanda-total2.jpg" },
              
            ]
          },
          "Uruguai": {
            img: "imagens/times/uruguai.png",
            camisas: [
              { nome: "Uruguai Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/uruguai-home25.jpg" },
              { nome: "Uruguai Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/uruguai-away25.jpg" },
              
            ]
          },
            "Estados Unidos": {
            img: "imagens/times/eua.png",
            camisas: [
              { nome: "Estados Unidos Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/usa-home25.jpg" },
               { nome: "Estados Unidos Away 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/usa-away25.jpg" },
              
            ]
          },
            "Canadá": {
            img: "imagens/times/canada.png",
            camisas: [
              { nome: "Canadá Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/canada-home26.jpg" },
               { nome: "Canadá Away 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/canada-away26.jpg" },
              
            ]
          },
           "Mexico": {
            img: "imagens/times/mexico.png",
            camisas: [
              { nome: "Mexico Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/mexico-home25.jpg" },
              { nome: "Mexico Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/mexico-away25.jpg" },
              
            ]
          },
          "Espanha": {
            img: "imagens/times/espanha.png",
            camisas: [
              { nome: "Espanha Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/espanha-home25.jpg" },
              { nome: "Espanha Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/espanha-away25.jpg" },
              { nome: "Espanha Home 2010 Retrô (Torcedor) ", preco: "R$ 150", img: "imagens/camisas/espanha-20101.jpg" },
               { nome: "Espanha Away 2010 Retrô (Torcedor) ", preco: "R$ 150", img: "imagens/camisas/espanha-20102.jpg" },
              
            ]
          },
           "Coreia do Sul": {
            img: "imagens/times/coreia.png",
            camisas: [
              { nome: "Coreia do Sul Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/coreia-home25.jpg" },
               { nome: "Coreia do Sul Away 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/coreia-away25.jpg" },
            ]
          },
            "Japão": {
            img: "imagens/times/japao.png",
            camisas: [
              { nome: "Japão Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/jp-home25.jpg" },
              { nome: "Japão Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/jp-away25.jpg" },
              { nome: "Japão Away 2006 Retrô (Torcedor) ", preco: "R$ 150", img: "imagens/camisas/jp-2006.jpg" },
              
            ]
          },
           "Belgica": {
            img: "imagens/times/belgica.png",
            camisas: [
              { nome: "Bélgica Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/belgica-home25.jpg" },
              { nome: "Bélgica Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/belgica-away25.jpg" },
              
            ]
          },
           "Senegal": {
            img: "imagens/times/senegal.png",
            camisas: [
              { nome: "Senegal Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/senegal-home25.jpg" },
              { nome: "Senegal Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/senegal-away25.jpg" },
              
            ]
          },
          "Arábia Saudita": {
            img: "imagens/times/saudita.png",
            camisas: [
              { nome: "Arábia Saudita Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/saudita-home25.jpg" },
            ]
          },
           "Alemanha": {
            img: "imagens/times/alemanha.png",
            camisas: [
              { nome: "Alemanha Home 2026 (Torcedor)" , preco: "R$ 130", img: "imagens/camisas/ale-home25.jpg" },
              { nome: "Alemanha Away 2026 (Torcedor) ", preco: "R$ 130", img: "imagens/camisas/ale-away25.jpg" },
              { nome: "Alemanha Home 2014 Retrô (Torcedor) ", preco: "R$ 150", img: "imagens/camisas/ale-20141.jpg" },
              { nome: "Alemanha Away 2014 Retrô (Torcedor) ", preco: "R$ 150", img: "imagens/camisas/ale-20142.jpg" },
              
            ]
          },
          
        }
      }
    }
  }
};

const WHATSAPP_LOJA = "5513997970308";

// =========================
// CONFIGURAÇÕES
// =========================
const CONFIG = {
  // 1. CEP de Origem Válido (digite um CEP real onde os produtos são postados)
  CEP_ORIGEM: "11900-000",

  // 2. URL do seu backend hospedado (ex: Render, Railway, etc.)
  // ATENÇÃO: Se estiver testando localmente, use "http://localhost:3000".
  // Em produção, insira a URL pública completa do seu backend.
  API_BASE_URL: "https://catalogo-mantosagrado00.onrender.com", 

  PRODUTO_FRETE: {
    pesoKg: 0.35,
    alturaCm: 5,
    larguraCm: 25,
    comprimentoCm: 35
  },

  // 3. IDs dos Serviços aceitos pela SuperFrete passados como array/string
  SERVICOS: "1,2,17,3,33,31",

  LOCAIS_ENTREGA: [
    "Registro-SP — local a combinar",
    "Pariquera-Açu — local a combinar",
    "Eldorado — local a combinar",
    "Jacupiranga — local a combinar"
  ]
};
const camisasMaisVendidas = [
  { nome: "Corinthians Home 2026 (Torcedor)", preco: "R$ 150", img: "imagens/camisas/cor-home26.jpg" },
  { nome: "Flamengo Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/fla-home26.jpg" },
  { nome: "Palmeiras Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/pal-home26.jpg" },
  { nome: "Santos  CBJR (Torcedor)", preco: "R$ 150", img: "imagens/camisas/san-cbjr.jpg" },
  { nome: "Brasil Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/brasil-home26.jpg" },
  { nome: "São Paulo  Home 2026 (Torcedor)", preco: "R$ 130", img: "imagens/camisas/sp-home26.jpg" },
];

const content = document.getElementById("content");
const title = document.getElementById("title");

let carrinho = carregarCarrinho();
let produtoPendente = null;
let freteSelecionado = null;
let tipoEntrega = "frete";

function carregarCarrinho() {
  try {
    const salvo = JSON.parse(localStorage.getItem("mantoSagradoCarrinho")) || [];
    return salvo
      .map(item => ({
        ...item,
        preco: numero(item.preco),
        quantidade: Math.max(1, Number(item.quantidade) || 1),
        personalizada: Boolean(item.personalizada),
        detalhesPersonalizacao: item.detalhesPersonalizacao || ""
      }))
      .filter(item => Number.isFinite(item.preco));
  } catch {
    return [];
  }
}

function numero(valor) {
  if (typeof valor === "number") return valor;
  return Number(String(valor)
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim());
}

function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function totalProdutos() {
  return carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

function totalPedido() {
  return totalProdutos() + (freteSelecionado?.price || 0);
}

function salvarCarrinho() {
  localStorage.setItem("mantoSagradoCarrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

function invalidarFrete() {
  freteSelecionado = null;
  document.getElementById("freteOptions").innerHTML = "";
  document.getElementById("freteStatus").innerText = "";
  atualizarTotais();
}

function atualizarTotais() {
  const subtotal = totalProdutos();
  const frete = freteSelecionado?.price || 0;

  document.getElementById("cartSubtotal").innerText = moeda(subtotal);
  document.getElementById("cartShipping").innerText =
    tipoEntrega === "combinar" ? "A combinar" :
    freteSelecionado ? moeda(frete) : "A calcular";
  document.getElementById("cartTotal").innerText =
    tipoEntrega === "combinar" || freteSelecionado ? moeda(subtotal + frete) : moeda(subtotal);

  document.getElementById("checkoutSubtotal").innerText = moeda(subtotal);
  document.getElementById("checkoutShipping").innerText =
    tipoEntrega === "combinar" ? "A combinar" :
    freteSelecionado ? moeda(frete) : "A calcular";
  document.getElementById("checkoutTotal").innerText =
    tipoEntrega === "combinar" || freteSelecionado ? moeda(subtotal + frete) : moeda(subtotal);
}

function atualizarCarrinho() {
  const quantidade = carrinho.reduce((total, item) => total + item.quantidade, 0);
  document.getElementById("cartCount").innerText = quantidade;

  const cartItems = document.getElementById("cartItems");

  if (!carrinho.length) {
    cartItems.innerHTML = '<div class="empty-cart">Seu carrinho está vazio.</div>';
    atualizarTotais();
    return;
  }

  cartItems.innerHTML = carrinho.map((item, index) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${escapeHtml(item.nome)}">
      <div class="cart-item-info">
        <h4>${escapeHtml(item.nome)}</h4>
        <p>${moeda(item.preco)} cada</p>
        ${item.personalizada
          ? `<span class="custom-badge">Personalizada + R$ 60,00</span>
             <p class="help">${escapeHtml(item.detalhesPersonalizacao)}</p>`
          : `<span class="custom-badge">Camisa lisa</span>`}
        <div class="quantity">
          <button onclick="alterarQuantidade(${index}, -1)">−</button>
          <strong>${item.quantidade}</strong>
          <button onclick="alterarQuantidade(${index}, 1)">+</button>
        </div>
      </div>
      <strong>${moeda(item.preco * item.quantidade)}</strong>
      <button class="remove-item" onclick="removerDoCarrinho(${index})">🗑</button>
    </div>
  `).join("");

  atualizarTotais();
}

function escapeHtml(valor) {
  return String(valor).replace(/[&<>"']/g, caractere => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[caractere]);
}

// =========================
// PERSONALIZAÇÃO
// =========================
function adicionarAoCarrinho(nome, preco, img) {
  produtoPendente = {
    nome,
    preco: numero(preco),
    img
  };

  document.querySelector('input[name="customType"][value="lisa"]').checked = true;
  document.getElementById("customDetails").value = "";
  toggleCustomFields();

  document.getElementById("customModal").style.display = "flex";
}

function toggleCustomFields() {
  const personalizada = document.querySelector('input[name="customType"]:checked')?.value === "personalizada";
  document.getElementById("customFields").classList.toggle("hidden", !personalizada);
}

function confirmarPersonalizacao() {
  if (!produtoPendente) return;

  const personalizada =
    document.querySelector('input[name="customType"]:checked').value === "personalizada";

  const detalhes = document.getElementById("customDetails").value.trim();

  if (personalizada && !detalhes) {
    alert("Informe o que deseja personalizar na camisa.");
    return;
  }

  const precoFinal = produtoPendente.preco + (personalizada ? 60 : 0);

  const existente = carrinho.find(item =>
    item.nome === produtoPendente.nome &&
    item.personalizada === personalizada &&
    item.detalhesPersonalizacao === detalhes
  );

  if (existente) {
    existente.quantidade++;
  } else {
    carrinho.push({
      nome: produtoPendente.nome,
      preco: precoFinal,
      precoOriginal: produtoPendente.preco,
      img: produtoPendente.img,
      quantidade: 1,
      personalizada,
      detalhesPersonalizacao: detalhes
    });
  }

  fecharPersonalizacao();
  invalidarFrete();
  salvarCarrinho();
  alert(personalizada
    ? "Camisa personalizada adicionada! +R$ 60,00."
    : "Camisa lisa adicionada ao carrinho!");
}

function fecharPersonalizacao() {
  document.getElementById("customModal").style.display = "none";
  produtoPendente = null;
}

function closeCustomOutside(event) {
  if (event.target.id === "customModal") fecharPersonalizacao();
}

// =========================
// CARRINHO
// =========================
function alterarQuantidade(index, valor) {
  if (!carrinho[index]) return;
  carrinho[index].quantidade += valor;

  if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);

  invalidarFrete();
  salvarCarrinho();
}

function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  invalidarFrete();
  salvarCarrinho();
}

function openCart() {
  atualizarCarrinho();
  document.getElementById("cartModal").style.display = "flex";
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function closeCartOutside(event) {
  if (event.target.id === "cartModal") closeCart();
}

// =========================
// CHECKOUT / ENTREGA
// =========================
function abrirCheckout() {
  if (!carrinho.length) {
    alert("Adicione pelo menos uma camisa ao carrinho.");
    return;
  }

  tipoEntrega = "frete";
  freteSelecionado = null;

  document.querySelector('input[name="deliveryType"][value="frete"]').checked = true;
  document.getElementById("cepDestino").value = "";
  document.getElementById("localEntrega").value = "";
  document.getElementById("freteOptions").innerHTML = "";
  document.getElementById("freteStatus").innerText = "";

  alterarTipoEntrega();
  atualizarTotais();

  document.getElementById("checkoutModal").style.display = "flex";
}

function fecharCheckout() {
  document.getElementById("checkoutModal").style.display = "none";
}

function closeCheckoutOutside(event) {
  if (event.target.id === "checkoutModal") fecharCheckout();
}

function alterarTipoEntrega() {
  tipoEntrega = document.querySelector('input[name="deliveryType"]:checked')?.value || "frete";

  document.getElementById("freteFields").classList.toggle("hidden", tipoEntrega !== "frete");
  document.getElementById("combinarFields").classList.toggle("hidden", tipoEntrega !== "combinar");

  if (tipoEntrega === "combinar") {
    freteSelecionado = { price: 0, carrier: "Entrega em mãos", service: "A combinar" };
  } else {
    freteSelecionado = null;
  }

  atualizarTotais();
}

function mascararCEP(input) {
  let valor = input.value.replace(/\D/g, "").slice(0, 8);
  if (valor.length > 5) valor = valor.slice(0,5) + "-" + valor.slice(5);
  input.value = valor;
}

async function calcularFreteSuperFrete(cepDestino) {
  const elementoResultado = document.getElementById("resultado-frete");
  
  // Limpa o CEP digitado deixando apenas números
  const cepLimpo = String(cepDestino).replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    if (elementoResultado) elementoResultado.innerText = "Digite um CEP válido com 8 dígitos.";
    return;
  }

  // Objeto exatamente com a estrutura que a SuperFrete exige
  const dadosRequisicao = {
    from: {
      postal_code: "11900000" // CEP de origem da sua loja
    },
    to: {
      postal_code: cepLimpo  // CEP de destino digitado pelo cliente
    },
    services: "1,2,17",     // 1: PAC, 2: SEDEX, 17: Mini Envios
    package: {
      weight: 0.3,          // 300 gramas (peso médio de uma camisa)
      height: 5,            // 5 cm
      width: 15,            // 15 cm
      length: 20            // 20 cm
    },
    options: {
      own_hand: false,
      receipt: false,
      insurance_value: 0,
      use_insurance_value: false
    }
  };

  try {
    if (elementoResultado) elementoResultado.innerText = "Calculando frete...";

    const response = await fetch("https://sandbox.superfrete.com/api/v0/calculator", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "User-Agent": "Manto-Sagrado/00 (amauripcfexdc@gmail.com)",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODkzMzY0MTIsInN1YiI6Ikt5YUJUSW5oa3dadHdERkF1U21CbHVLVk5KSzIifQ.b4jaeX26r4_C_WWKlNZBe3B5GdrvxbwFwNHkdzOlR88"
      },
      body: JSON.stringify(dadosRequisicao)
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();

    // Renderiza o resultado na tela
    if (elementoResultado) {
      elementoResultado.innerHTML = "";
      data.forEach(opcao => {
        if (!opcao.error) {
          elementoResultado.innerHTML += `
            <div class="frete-item">
              <strong>${escapeHtml(opcao.name)}:</strong> R$ ${opcao.price} (${opcao.delivery_time} dias úteis)
            </div>
          `;
        }
      });
    }

  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    if (elementoResultado) {
      elementoResultado.innerText = "Erro ao calcular o frete. Verifique o CEP digitado.";
    }
  }
}

// =========================
// WHATSAPP
// =========================
function finalizarPedido() {
  if (!carrinho.length) {
    alert("Adicione pelo menos uma camisa ao carrinho.");
    return;
  }

  if (tipoEntrega === "frete" && !freteSelecionado) {
    alert("Calcule e selecione uma opção de frete antes de finalizar.");
    return;
  }

  if (tipoEntrega === "combinar") {
    const local = document.getElementById("localEntrega").value.trim();
    if (!local) {
      alert("Informe o local próximo onde deseja combinar a entrega.");
      return;
    }
  }

  const subtotal = totalProdutos();
  const frete = freteSelecionado?.price || 0;
  const total = subtotal + frete;

  let mensagem = "Olá! Quero fazer um pedido pelo catálogo da *Manto Sagrado*.\n\n";

  carrinho.forEach((item, index) => {
    mensagem += `*${index + 1}. ${item.nome}*\n`;
    mensagem += `Quantidade: ${item.quantidade}\n`;
    mensagem += `Preço por camisa: ${moeda(item.preco)}\n`;

    if (item.personalizada) {
      mensagem += `Personalização: *SIM (+R$ 60,00)*\n`;
      mensagem += `Detalhes: ${item.detalhesPersonalizacao}\n`;
    } else {
      mensagem += "Personalização: Não — camisa lisa\n";
    }

    mensagem += `Subtotal do item: ${moeda(item.preco * item.quantidade)}\n\n`;
  });

  mensagem += `*Subtotal dos produtos:* ${moeda(subtotal)}\n`;

  if (tipoEntrega === "combinar") {
    mensagem += "*Entrega:* Combinar entrega em mãos\n";
    mensagem += `*Local sugerido:* ${document.getElementById("localEntrega").value.trim()}\n`;
    mensagem += "*Frete:* R$ 0,00\n";
  } else {
    mensagem += `*Transportadora:* ${freteSelecionado.carrier}\n`;
    mensagem += `*Serviço:* ${freteSelecionado.service}\n`;
    mensagem += `*Frete:* ${moeda(frete)}\n`;

    if (freteSelecionado.deliveryTime) {
      mensagem += `*Prazo estimado:* ${freteSelecionado.deliveryTime}\n`;
    }

    mensagem += `*CEP de destino:* ${document.getElementById("cepDestino").value}\n`;
  }

  mensagem += `\n*TOTAL DO PEDIDO:* ${moeda(total)}\n\n`;
  mensagem += "Gostaria de confirmar o pedido e combinar o pagamento.";

  const url = `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

// =========================
// NAVEGAÇÃO DO CATÁLOGO
// =========================
// =========================
// NAVEGAÇÃO DO CATÁLOGO (CORRIGIDA)
// =========================
function showPaises() {
  title.innerText = "Escolha o País";
  content.innerHTML = "";

  Object.keys(data).forEach(pais => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${data[pais].img}" alt="${escapeHtml(pais)}"><h3>${escapeHtml(pais)}</h3>`;
    div.onclick = () => showLigas(pais);
    content.appendChild(div);
  });

  const tituloDestaques = document.createElement("div");
  tituloDestaques.className = "section-title";
  tituloDestaques.innerText = "Camisas + Vendidas";
  content.appendChild(tituloDestaques);

  const destaques = document.createElement("div");
  destaques.className = "best-sellers";

  camisasMaisVendidas.forEach(camisa => {
    const div = document.createElement("div");
    div.className = "shirt best-card";
    const precoNumerico = numero(camisa.preco);

    div.innerHTML = `
      <div class="zoom-container" onclick="event.stopPropagation(); openModal(${JSON.stringify(camisa.img)})">
        <img src="${camisa.img}" alt="${escapeHtml(camisa.nome)}">
      </div>
      <h3>${escapeHtml(camisa.nome)}</h3>
      <p>${moeda(precoNumerico)}</p>
      <button onclick='event.stopPropagation(); adicionarAoCarrinho(${JSON.stringify(camisa.nome)}, ${precoNumerico}, ${JSON.stringify(camisa.img)})'>
        Adicionar ao carrinho
      </button>
    `;

    destaques.appendChild(div);
  });

  content.appendChild(destaques);
}

function showLigas(pais) {
  title.innerText = pais + " – Ligas";
  content.innerHTML = "";

  const backBtn = document.createElement("div");
  backBtn.className = "back";
  backBtn.innerText = "⬅ Voltar";
  backBtn.onclick = () => showPaises();
  content.appendChild(backBtn);

  Object.keys(data[pais].ligas).forEach(liga => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${data[pais].ligas[liga].img}" alt="${escapeHtml(liga)}"><h3>${escapeHtml(liga)}</h3>`;
    div.onclick = () => showTimes(pais, liga);
    content.appendChild(div);
  });
}

function showTimes(pais, liga) {
  title.innerText = liga + " – Times";
  content.innerHTML = "";

  const backBtn = document.createElement("div");
  backBtn.className = "back";
  backBtn.innerText = "⬅ Voltar";
  backBtn.onclick = () => showLigas(pais);
  content.appendChild(backBtn);

  Object.keys(data[pais].ligas[liga].times).forEach(time => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${data[pais].ligas[liga].times[time].img}" alt="${escapeHtml(time)}"><h3>${escapeHtml(time)}</h3>`;
    div.onclick = () => showCamisas(pais, liga, time);
    content.appendChild(div);
  });
}

function showCamisas(pais, liga, time) {
  title.innerText = time + " – Camisas";
  content.innerHTML = "";

  const backBtn = document.createElement("div");
  backBtn.className = "back";
  backBtn.innerText = "⬅ Voltar";
  backBtn.onclick = () => showTimes(pais, liga);
  content.appendChild(backBtn);

  data[pais].ligas[liga].times[time].camisas.forEach(camisa => {
    const precoNumerico = numero(camisa.preco);
    const div = document.createElement("div");
    div.className = "shirt";

    div.innerHTML = `
      <div class="zoom-container" onclick="openModal(${JSON.stringify(camisa.img)})">
        <img src="${camisa.img}" alt="${escapeHtml(camisa.nome)}">
      </div>
      <h3>${escapeHtml(camisa.nome)}</h3>
      <p>${moeda(precoNumerico)}</p>
      <button onclick='adicionarAoCarrinho(${JSON.stringify(camisa.nome)}, ${precoNumerico}, ${JSON.stringify(camisa.img)})'>
        Adicionar ao carrinho
      </button>
    `;

    content.appendChild(div);
  });
}

// =========================
// MODAL DE IMAGEM / COOKIES
// =========================
function openModal(img) {
  document.getElementById("imageModal").style.display = "flex";
  document.getElementById("modalImg").src = img;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

function aceitarCookies() {
  localStorage.setItem("mantoSagradoCookies", "aceitos");
  document.getElementById("cookieBanner").style.display = "none";
}

if (localStorage.getItem("mantoSagradoCookies") === "aceitos") {
  document.getElementById("cookieBanner").style.display = "none";
}

// Preenche sugestões de locais de entrega em mãos.
const listaLocais = document.getElementById("locaisEntrega");
if (listaLocais) {
  listaLocais.innerHTML = CONFIG.LOCAIS_ENTREGA
    .map(local => `<option value="${escapeHtml(local)}"></option>`)
    .join("");
}

showPaises();
atualizarCarrinho();
