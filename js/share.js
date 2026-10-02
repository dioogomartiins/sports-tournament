// ---------------------------------------------------------------------------
// Partilha — gera uma imagem (PNG) da classificação ou de um resultado para
// enviar no WhatsApp. Usa a partilha nativa do telemóvel quando existe;
// noutros casos descarrega a imagem.
// ---------------------------------------------------------------------------
import { state } from './state.js';
import { computeStandings } from './algorithms.js';
import { getTeamName, safeColor, playerName } from './utils.js';
import { showToast } from './ui.js';

const W = 1080;
const PAD = 64;
const C = {
  bg: '#0F2A1C',
  band: '#153826',
  row: '#1C4A32',
  rowAlt: '#245E3F',
  text: '#FFFFFF',
  soft: '#B9CDBE',
  gold: '#CBA135',
};
const DISPLAY = "'Oswald', 'Arial Narrow', Impact, sans-serif";
const BODY = "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif";

async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load(`700 48px ${DISPLAY}`),
      document.fonts.load(`600 32px ${BODY}`),
    ]);
  } catch { /* usa as fontes de recurso */ }
}

function makeCanvas(height) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, height);
  ctx.textBaseline = 'middle';
  return { canvas, ctx };
}

/** Corta o texto com reticências para caber em maxW. */
function fit(ctx, text, maxW) {
  let t = String(text);
  if (ctx.measureText(t).width <= maxW) return t;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t}…`;
}

function text(ctx, str, x, y, { font, color = C.text, align = 'left', maxW = W } = {}) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(fit(ctx, str, maxW), x, y);
}

function dot(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = safeColor(color);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,.5)';
  ctx.stroke();
}

function header(ctx, title, subtitle) {
  ctx.fillStyle = C.band;
  ctx.fillRect(0, 0, W, 210);
  ctx.fillStyle = C.gold;
  ctx.fillRect(0, 206, W, 4);
  text(ctx, title.toUpperCase(), PAD, 90, { font: `700 64px ${DISPLAY}`, maxW: W - 2 * PAD });
  text(ctx, subtitle.toUpperCase(), PAD, 160, { font: `600 30px ${BODY}`, color: C.gold, maxW: W - 2 * PAD });
}

function footer(ctx, height) {
  const d = new Date().toLocaleDateString('pt-PT');
  text(ctx, `⚽ Gestor de Torneio · ${d}`, W / 2, height - 44, { font: `500 24px ${BODY}`, color: C.soft, align: 'center', maxW: W - 2 * PAD });
}

function toBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

async function deliver(canvas, filename, title) {
  const blob = await toBlob(canvas);
  if (!blob) { showToast('Não foi possível criar a imagem.', 'error'); return; }
  const file = new File([blob], filename, { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return;
    } catch (e) {
      if (e && e.name === 'AbortError') return;
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Imagem descarregada.', 'ok');
}

// ---------------------------------------------------------------------------
// Classificação
// ---------------------------------------------------------------------------
export async function shareStandings() {
  const teamsArray = state.teams.slice(0, state.scheduleTeamCount || state.config.numEquipas);
  const groups = computeStandings(teamsArray, state.schedule, state.results, state.config)
    .filter((g) => g.standings.length);
  if (!groups.length) { showToast('Ainda não há classificação.', 'error'); return; }

  await fontsReady();

  const ROW = 72;
  const GROUP_HEAD = groups.length > 1 ? 70 : 0;
  const COLS_HEAD = 56;
  const height = 210 + 40 + groups.reduce((h, g) => h + GROUP_HEAD + COLS_HEAD + g.standings.length * ROW + 30, 0) + 90;
  const { canvas, ctx } = makeCanvas(height);

  const played = Object.values(state.results).filter((r) => r && typeof r === 'object' && r.status === 'terminado').length;
  header(ctx, state.config.nome, `Classificação · ${played} jogos terminados`);

  // Colunas: posição, equipa, J, V, E, D, DG, Pts
  const cols = [
    { key: 'J', x: 610 }, { key: 'V', x: 680 }, { key: 'E', x: 750 }, { key: 'D', x: 820 },
    { key: 'DG', x: 905 }, { key: 'Pts', x: W - PAD - 20 },
  ];

  let y = 250;
  groups.forEach((g) => {
    if (groups.length > 1) {
      text(ctx, g.name.toUpperCase(), PAD, y + 30, { font: `700 36px ${DISPLAY}`, color: C.gold });
      y += GROUP_HEAD;
    }
    cols.forEach((c) => text(ctx, c.key, c.x, y + 26, { font: `700 24px ${BODY}`, color: C.soft, align: 'center' }));
    y += COLS_HEAD;

    g.standings.forEach((s, i) => {
      ctx.fillStyle = i % 2 ? C.rowAlt : C.row;
      ctx.fillRect(PAD - 16, y, W - 2 * PAD + 32, ROW - 6);
      const cy = y + (ROW - 6) / 2;
      text(ctx, String(i + 1), PAD + 14, cy, { font: `700 32px ${DISPLAY}`, color: i === 0 ? C.gold : C.text, align: 'center' });
      const team = state.teams[s.idx] || {};
      dot(ctx, PAD + 62, cy, 13, team.color);
      text(ctx, s.name, PAD + 90, cy, { font: `600 32px ${BODY}`, maxW: 440 });
      cols.forEach((c) => {
        let v = s[c.key];
        if (c.key === 'DG' && v > 0) v = `+${v}`;
        text(ctx, String(v), c.x, cy, {
          font: c.key === 'Pts' ? `700 36px ${DISPLAY}` : `500 30px ${BODY}`,
          color: c.key === 'Pts' ? C.gold : C.text,
          align: 'center',
        });
      });
      y += ROW;
    });
    y += 30;
  });

  footer(ctx, height);
  await deliver(canvas, 'classificacao.png', `${state.config.nome} — Classificação`);
}

// ---------------------------------------------------------------------------
// Resultado de um jogo
// ---------------------------------------------------------------------------
function goalLines(res, side) {
  const scorers = (res.scorers && res.scorers[side]) || [];
  const assists = (res.assists && res.assists[side]) || [];
  return scorers.map((pid, i) => {
    if (pid === 'auto') return 'Autogolo';
    const a = assists[i] && assists[i] !== 'auto' ? ` (assist. ${playerName(assists[i])})` : '';
    return `${playerName(pid)}${a}`;
  });
}

export async function shareResult(gi) {
  const game = state.schedule[gi];
  const res = state.results[gi];
  if (!game || !res || typeof res !== 'object') return;

  await fontsReady();

  const home = goalLines(res, 'home');
  const away = goalLines(res, 'away');
  const lines = Math.max(home.length, away.length);
  const height = 210 + 420 + lines * 48 + (res.mvp ? 90 : 0) + 110;
  const { canvas, ctx } = makeCanvas(height);

  const ronda = typeof game.jornada === 'number' ? `Jornada ${game.jornada}` : String(game.jornada || '');
  header(ctx, state.config.nome, ronda ? `${ronda} · Resultado final` : 'Resultado final');

  const [h, a] = String(res.score || '0-0').split('-');
  const colHome = W / 4;
  const colAway = (3 * W) / 4;
  const teamColor = (idx) => (typeof idx === 'number' && state.teams[idx] ? state.teams[idx].color : '#888888');

  dot(ctx, colHome, 300, 34, teamColor(game.home));
  dot(ctx, colAway, 300, 34, teamColor(game.away));
  text(ctx, getTeamName(game.home), colHome, 380, { font: `700 40px ${DISPLAY}`, align: 'center', maxW: W / 2 - 80 });
  text(ctx, getTeamName(game.away), colAway, 380, { font: `700 40px ${DISPLAY}`, align: 'center', maxW: W / 2 - 80 });

  text(ctx, `${h}  -  ${a}`, W / 2, 500, { font: `700 140px ${DISPLAY}`, color: C.gold, align: 'center' });
  let y = 600;
  if (res.penalties) {
    text(ctx, `Penáltis ${res.penalties}`, W / 2, y, { font: `600 30px ${BODY}`, color: C.soft, align: 'center' });
  }
  y += 50;

  for (let i = 0; i < lines; i++) {
    if (home[i]) text(ctx, `⚽ ${home[i]}`, colHome, y, { font: `500 28px ${BODY}`, align: 'center', maxW: W / 2 - 60 });
    if (away[i]) text(ctx, `⚽ ${away[i]}`, colAway, y, { font: `500 28px ${BODY}`, align: 'center', maxW: W / 2 - 60 });
    y += 48;
  }

  if (res.mvp) {
    y += 30;
    text(ctx, `⭐ MVP: ${playerName(res.mvp)}`, W / 2, y, { font: `700 36px ${DISPLAY}`, color: C.gold, align: 'center', maxW: W - 2 * PAD });
  }

  footer(ctx, height);
  await deliver(canvas, 'resultado.png', `${getTeamName(game.home)} ${res.score} ${getTeamName(game.away)}`);
}
