// ---------------------------------------------------------------------------
// Animações dos jogos — começou, golo, golo anulado, terminou.
// ---------------------------------------------------------------------------
// As animações nascem da comparação entre o último estado dos resultados e o
// atual, por isso aparecem em todos os telemóveis: em quem carregou no botão e
// em quem recebeu a alteração do Firebase.
import { state } from './state.js';
import { resultEvents } from './algorithms.js';
import { getTeamName, escapeHtml, safeColor } from './utils.js';
import { playerName, prefersReducedMotion } from './ui.js';

const DURATION = 2600; // ms que cada animação ocupa o cartão do jogo

let baseline = null;

const WHISTLE =
  '<svg class="anim-whistle" viewBox="0 0 64 40" aria-hidden="true">' +
  '<path d="M6 14h22l4-6h10v6h4a14 14 0 1 1-14 14H6z" fill="currentColor"/>' +
  '<circle cx="46" cy="28" r="6" fill="rgba(0,0,0,.25)"/>' +
  '<path d="M44 4l3-4M50 6l4-3M38 4l-2-4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
  '</svg>';

/**
 * Compara os resultados com os da última chamada e anima o que mudou.
 * `silent` só regista o estado (primeira leitura do Firebase, gravação recusada).
 */
export function animateResultChanges({ silent = false } = {}) {
  const prev = baseline;
  baseline = JSON.parse(JSON.stringify(state.results || {}));
  if (silent || !prev || prefersReducedMotion()) return;

  const events = resultEvents(prev, state.results);
  if (!events.length) return;

  // Espera pelo redesenho do ecrã; vários eventos no mesmo jogo tocam em fila
  const queue = {};
  requestAnimationFrame(() => {
    events.forEach((ev) => {
      const n = queue[ev.gi] || 0;
      queue[ev.gi] = n + 1;
      setTimeout(() => play(ev), n * (DURATION - 400));
    });
  });
}

/** Cor do texto (claro ou escuro) que se lê sobre a cor da equipa. */
function textOn(hex) {
  const c = safeColor(hex).slice(1);
  const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.6 ? '#10231a' : '#ffffff';
}

function teamColor(gi, side) {
  const game = state.schedule[gi];
  const idx = game ? game[side] : null;
  return typeof idx === 'number' && state.teams[idx] ? safeColor(state.teams[idx].color) : '#2F7A4F';
}

function scorerName(ev) {
  if (ev.pid === 'auto') return 'Autogolo';
  if (ev.pid) return playerName(ev.pid);
  const game = state.schedule[ev.gi];
  return game ? getTeamName(game[ev.side]) : '';
}

function overlayHtml(ev) {
  const game = state.schedule[ev.gi];
  if (ev.type === 'golo') {
    const assist = ev.aid && ev.aid !== 'auto'
      ? `<div class="anim-sub2">Assistência: ${escapeHtml(playerName(ev.aid))}</div>` : '';
    return `<div class="anim-title">GOLO!</div><div class="anim-sub">⚽ ${escapeHtml(scorerName(ev))}</div>${assist}`;
  }
  if (ev.type === 'anulado') {
    return `<div class="anim-title">GOLO ANULADO</div><div class="anim-sub"><s>${escapeHtml(scorerName(ev))}</s></div>`;
  }
  if (ev.type === 'inicio') {
    return `${WHISTLE}<div class="anim-title">COMEÇOU</div>` +
      (game ? `<div class="anim-sub">${escapeHtml(getTeamName(game.home))} vs ${escapeHtml(getTeamName(game.away))}</div>` : '');
  }
  const res = state.results[ev.gi];
  const score = res && typeof res === 'object' ? res.score : res;
  return `${WHISTLE}<div class="anim-title">TERMINOU</div>` +
    (game && score ? `<div class="anim-sub">${escapeHtml(getTeamName(game.home))} ${escapeHtml(score)} ${escapeHtml(getTeamName(game.away))}</div>` : '');
}

function play(ev) {
  const targets = document.querySelectorAll(`[data-game="${CSS.escape(String(ev.gi))}"]`);
  if (!targets.length) return;
  const html = overlayHtml(ev);

  targets.forEach((target) => {
    // Só anima o que está à vista (separador ativo ou janela do jogo aberta)
    if (!target.offsetParent) return;
    const layer = document.createElement('div');
    layer.className = `game-anim anim-${ev.type}`;
    if (ev.type === 'golo') {
      const color = teamColor(ev.gi, ev.side);
      layer.style.setProperty('--anim-bg', color);
      layer.style.setProperty('--anim-ink', textOn(color));
    }
    layer.innerHTML = html;
    target.classList.add('has-anim');
    target.appendChild(layer);
    setTimeout(() => {
      layer.remove();
      if (!target.querySelector('.game-anim')) target.classList.remove('has-anim');
    }, DURATION);

    if (ev.type === 'golo' || ev.type === 'anulado') {
      target.querySelectorAll(`[data-side="${ev.side}"]:not(button)`).forEach((el) => {
        el.classList.remove('score-bump');
        void el.offsetWidth; // reinicia a animação
        el.classList.add('score-bump');
      });
    }
  });
}
