let app;
let homeHTML;
let paginaAtual = null;

function inicializarSPA() {
  app = document.getElementById("app");
  if (!app) {
    console.error("❌ ERRO: Elemento #app não encontrado no HTML!");
    return;
  }

  homeHTML = app.innerHTML;
  console.log("✅ SPA Inicializado. Conteúdo da Home salvo.");

  const params = new URLSearchParams(window.location.search);
  const rotaInicial = params.get("pagina");

  if (rotaInicial) {
    console.log("🚀 Carregando rota inicial:", rotaInicial);
    carregarPagina(rotaInicial);
  }
}

async function carregarPagina(pagina) {
  if (!pagina) return;

  // Caminho absoluto para evitar erro de diretório
  const url = `/partials/pages/${pagina}/index.html`;
  console.log("📂 Buscando arquivo em:", url);

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Servidor respondeu com erro ${res.status} ao buscar ${url}`);
    }

    const html = await res.text();
    console.log("📄 HTML recebido com sucesso!");

    // A MÁGICA ACONTECE AQUI
    app.innerHTML = html;
    paginaAtual = pagina;

    window.scrollTo(0, 0);
    document.title = `JS Docs — ${pagina.split('/').pop().toUpperCase()}`;

    gerenciarAssets(pagina);
    console.log("✨ Conteúdo injetado no #app!");

  } catch (err) {
    console.error("❌ Erro ao carregar página:", err);
    app.innerHTML = `
            <section style="padding: 2rem; text-align: center;">
                <h2>Erro 404</h2>
                <p>Não foi possível encontrar a página: <b>${pagina}</b></p>
                <p><small>${err.message}</small></p>
            </section>`;
  }
}

function gerenciarAssets(pagina) {
  document.getElementById("script-pagina")?.remove();
  document.getElementById("css-pagina")?.remove();

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `/partials/pages/${pagina}/index.css`;
  link.id = "css-pagina";
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.src = `/partials/pages/${pagina}/index.js`;
  script.id = "script-pagina";
  script.defer = true;
  document.body.appendChild(script);
}

// O INTERCEPTOR (Escutando no document para pegar links dinâmicos do nav-bar)
document.addEventListener("click", e => {
  const link = e.target.closest("a[data-spa]");
  if (!link) return;

  e.preventDefault();

  const rota = link.dataset.spa;

  if (rota && rota !== paginaAtual) {
    console.log("🔗 Navegando para:", rota);
    history.pushState({ pagina: rota }, "", `?pagina = ${ rota }`);
    carregarPagina(rota);
  }
  else if (href === "/" || href === "index.html") {
    e.preventDefault();
    window.history.pushState(null, "", "/");
    app.innerHTML = homeHTML;
    paginaAtual = null;
    document.getElementById("script-pagina")?.remove();
    document.getElementById("css-pagina")?.remove();
    console.log("🏠 Voltando para a Home.");
  }
});

window.addEventListener("popstate", () => {
  const params = new URLSearchParams(window.location.search);
  const rota = params.get("pagina");
  rota ? carregarPagina(rota) : (app.innerHTML = homeHTML);
});

// Inicializa
window.addEventListener("load", inicializarSPA);