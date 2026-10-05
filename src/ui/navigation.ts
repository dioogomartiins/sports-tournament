import { panels } from './dom.js';
import { replayStandings } from './standings.js';

// ---------------------------------------------------------------------------
// Tab navigation
// ---------------------------------------------------------------------------
export function switchTab(name: string): void {
  const tabsContainer = document.getElementById('tabs');
  document.querySelectorAll<HTMLElement>('.tab').forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  panels.forEach((p) => { p.classList.toggle('active', p.id === `tab-${name}`); });
  if (tabsContainer) tabsContainer.classList.remove('menu-open');
  if (name === 'standings') replayStandings();
}
