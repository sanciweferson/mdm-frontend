// Apenas o essencial para o funcionamento estrutural
const Icons = {
  hamburger: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  moon: `<svg class="icon-moon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`,
  sun: `<svg class="icon-sun hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
};

function createToggleMenu() {
  return `
    <li class="nav__item">
      <button id="js-menu-toggle" type="button" class="nav__btn-toggle" aria-label="Abrir menu" aria-expanded="false">
        <span class="nav__icon--open">${Icons.hamburger}</span>
        <span class="nav__icon--close hidden">${Icons.close}</span>
      </button>
    </li>
  `;
}

// function createNavItem(item) {
//   const subPages = item.pages.map(page => {
//     // ESTA PARTE É VITAL: 
//     // Limpa o caminho do JSON para virar uma rota amigável
//     // De: /partials/pages/fundamentos/introducao/index.html
//     // Para: fundamentos/introducao
//     const route = page.href
//       .replace("/partials/pages/", "")
//       .replace("/index.html", "");

//     return `
//       <li>
//         <a href="?pagina=${route}" data-link>
//           ${page.text}
//         </a>
//       </li>
//     `;
//   }).join("");


function createNavItem(item) {
  const subPages = item.pages.map(page => {

    const route = page.href
      .replace("/partials/pages/", "")
      .replace("/index.html", "");

    return `<li><a href="?pagina=${route}">${page.text}</a></li>`;
  }).join("");

  return `
    <li class="nav__dropdown">
      <div class="nav__label"><span>${item.title}</span></div>
      <ul class="nav__submenu">${subPages}</ul>
    </li>
  `;
}

 
function createThemeToggle() {
  return `
    <li>
      <button class="nav__btn-theme" type="button" aria-label="Alternar tema">
        <span class="icon icon--moon">${Icons.moon}</span>
        <span class="icon icon--sun">${Icons.sun}</span>
      </button>
    </li>
  `;
}

class NavBar extends HTMLElement {
  async connectedCallback() {
    try {
      const res = await fetch("/partials/data/menu.json");
      const navMenu = await res.json();

      const linksHTML = navMenu.map(createNavItem).join("");
      const menuToggleHTML = createToggleMenu();
      const themeDesktopHTML = createThemeToggle();
      const themeMobileHTML = createThemeToggle();

      this.innerHTML = `
        <nav class="nav">
          <div class="nav__container container">
            <ul class="nav__list--logo">
              <li><a href="/" class="logo-text">JS Docs</a></li>
            </ul>

            <ul class="nav__list--toggle-btn">${menuToggleHTML}</ul>

            <div class="none">
              <ul class="nav__list--desktop">
                ${linksHTML}
              </ul>
              <ul>${themeDesktopHTML}</ul>
            </div>
          </div>

          <aside class="nav__aside" id="js-nav-aside">
            <ul class="nav__list--mobile">
              ${linksHTML}
            </ul>
            <ul>${themeMobileHTML}</ul>
          </aside>
        </nav>
      `;
    } catch (err) {
      console.error("Erro ao carregar menu:", err);
    }
  }
}

customElements.define("nav-bar", NavBar);

// ===== Footer =====

function createFooterItem(item) {
  const subPages = item.pages.map(page => {
    const route = page.href
      .replace("/partials/pages/", "")
      .replace("/index.html", "");

    return `<li><a href="?pagina=${route}">${page.text}</a></li>`;
  }).join("");

  return `
    <div class="footer__column">
      <h4 class="footer__title">${item.title}</h4>
      <ul class="footer__sublist">${subPages}</ul>
    </div>
  `;
}

class FooterBar extends HTMLElement {
  async connectedCallback() {
    try {
      const res = await fetch("/partials/data/menu.json");
      const navMenu = await res.json();

      const footerContent = navMenu.map(createFooterItem).join("");

      this.innerHTML = `
        <footer class="footer">
          <div class="footer__container container">
            <div class="footer__grid">
              ${footerContent}
            </div>
            <div class="footer__bottom">
              <p>© 2026 JS Docs - Documentação Progressiva</p>
            </div>
          </div>
        </footer>
      `;
    } catch (err) {
      console.error("Erro ao carregar footer:", err);
    }
  }
}

customElements.define("footer-bar", FooterBar);