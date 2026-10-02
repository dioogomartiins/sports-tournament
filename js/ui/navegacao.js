import { dom } from './dom.js';
import { replayStandings } from './classificacao.js';

// ---------------------------------------------------------------------------
// Navegação por tabs
// ---------------------------------------------------------------------------
export function switchTab(name) {
  const tabsContainer = document.getElementById('tabs');
  Array.from(document.querySelectorAll('.tab')).forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  dom.panels.forEach((p) => { p.classList.toggle('active', p.id === `tab-${name}`); });
  if (tabsContainer) tabsContainer.classList.remove('menu-open');
  if (name === 'standings') replayStandings();
}
