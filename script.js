const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const views = [...document.querySelectorAll('[data-view]')];
const pageLinks = [...document.querySelectorAll('[data-page]')];
const hashToPage = {
  '#inicio': 'home',
  '#boas-vindas': 'home',
  '#servicos': 'services',
  '#duvidas': 'questions',
  '#quem-somos': 'about',
};

function showPage(page, { updateHistory = false, scrollToTop = true } = {}) {
  const availablePages = new Set(views.map((view) => view.dataset.view));
  const nextPage = availablePages.has(page) ? page : 'home';

  views.forEach((view) => {
    view.hidden = view.dataset.view !== nextPage;
  });
  pageLinks.forEach((link) => {
    if (link.dataset.page === nextPage && link.matches('.main-nav a')) {
      link.setAttribute('aria-current', 'page');
    } else if (link.matches('.main-nav a')) {
      link.removeAttribute('aria-current');
    }
  });

  if (updateHistory) {
    const hash = Object.keys(hashToPage).find((key) => hashToPage[key] === nextPage);
    history.pushState({ page: nextPage }, '', hash);
  }
  if (scrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
  updateHeader();
}

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 36);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
});

pageLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const page = link.dataset.page;
    if (!page) return;
    event.preventDefault();
    showPage(page, { updateHistory: true });
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('popstate', () => {
  showPage(hashToPage[window.location.hash] || 'home', { scrollToTop: false });
});

showPage(hashToPage[window.location.hash] || 'home', { scrollToTop: false });
window.scrollTo(0, 0);
updateHeader();

navigation.querySelectorAll('a:not([data-page])').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});
