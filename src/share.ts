// ---------------------------------------------------------------------------
// Share — draws a PNG of the standings or a match result to send on WhatsApp
// or other apps. Uses the Web Share API when supported; otherwise downloads it.
// ---------------------------------------------------------------------------
import { state } from './state.js';
import { getSport } from './sports/registry.js';
import { RacketSport } from './sports/RacketSport.js';
import { getTeamName, safeColor, playerName } from './utils.js';
import { showToast } from './ui/toasts.js';
import type { Score } from './types.js';
import { en } from './i18n/en.js';

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

interface TextStyle {
  font: string;
  color?: string;
  align?: CanvasTextAlign;
  maxW?: number;
}

/** A share image being drawn: a canvas of the app's width and a few drawing helpers. */
class ShareImage {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;

  constructor(readonly height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = W;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.fillStyle = C.bg;
    this.ctx.fillRect(0, 0, W, height);
    this.ctx.textBaseline = 'middle';
  }

  /** Waits for the app fonts (falls back to system fonts on failure). */
  static async fontsReady(): Promise<void> {
    try {
      await Promise.all([
        document.fonts.load(`700 48px ${DISPLAY}`),
        document.fonts.load(`600 32px ${BODY}`),
      ]);
    } catch { /* use system fallback fonts */ }
  }

  /** Truncates text with an ellipsis to fit within maxW. */
  private fit(value: string, maxW: number): string {
    let t = value;
    if (this.ctx.measureText(t).width <= maxW) return t;
    while (t.length > 1 && this.ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
    return `${t}…`;
  }

  text(str: string, x: number, y: number, { font, color = C.text, align = 'left', maxW = W }: TextStyle): void {
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.fillText(this.fit(String(str), maxW), x, y);
  }

  rect(x: number, y: number, w: number, h: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  /** A team colour dot with a light outline. */
  dot(x: number, y: number, r: number, color: string | undefined): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = safeColor(color);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,.5)';
    ctx.stroke();
  }

  header(title: string, subtitle: string): void {
    this.rect(0, 0, W, 210, C.band);
    this.rect(0, 206, W, 4, C.gold);
    this.text(title.toUpperCase(), PAD, 90, { font: `700 64px ${DISPLAY}`, maxW: W - 2 * PAD });
    this.text(subtitle.toUpperCase(), PAD, 160, { font: `600 30px ${BODY}`, color: C.gold, maxW: W - 2 * PAD });
  }

  footer(): void {
    const d = new Date().toLocaleDateString('en-GB');
    this.text(`${getSport(state.meta?.sport).icon} ${en.share.brand} · ${d}`, W / 2, this.height - 44,
      { font: `500 24px ${BODY}`, color: C.soft, align: 'center', maxW: W - 2 * PAD });
  }

  /** Shares the PNG, or downloads it where sharing files is not supported. */
  async deliver(filename: string, title: string): Promise<void> {
    const blob = await new Promise<Blob | null>((resolve) => this.canvas.toBlob(resolve, 'image/png'));
    if (!blob) { showToast(en.share.errorCreatingImage, 'error'); return; }
    const file = new File([blob], filename, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title });
        return;
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
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
    showToast(en.share.imageDownloaded, 'ok');
  }
}

function tournamentName(): string {
  return state.config?.nome || en.common.tournament;
}

// ---------------------------------------------------------------------------
// Standings
// ---------------------------------------------------------------------------
export async function shareStandings(): Promise<void> {
  const config = state.config;
  if (!config) return;
  const teamsArray = (state.teams || []).slice(0, state.scheduleTeamCount || config.numEquipas);
  const sport = getSport(state.meta?.sport);
  const groups = sport.computeStandings(teamsArray, state.schedule, state.results, config)
    .filter((g) => g.standings.length);
  if (!groups.length) { showToast(en.share.noStandingsYet, 'error'); return; }

  await ShareImage.fontsReady();

  const ROW = 72;
  const GROUP_HEAD = groups.length > 1 ? 70 : 0;
  const COLS_HEAD = 56;
  const height = 210 + 40 + groups.reduce((h, g) => h + GROUP_HEAD + COLS_HEAD + g.standings.length * ROW + 30, 0) + 90;
  const img = new ShareImage(height);

  const played = Object.values(state.results).filter((r) => r && typeof r === 'object' && r.status === 'terminado').length;
  img.header(tournamentName(), en.share.standingsSubtitle(played));

  // Columns of the sport, the highlighted one (Pts, GW) last, right-aligned in the row
  const sportCols = sport.standingsColumns();
  const ordered = [...sportCols.filter((c) => !c.className), ...sportCols.filter((c) => c.className)];
  const COL_W = 64;
  const lastX = W - PAD - 20;
  const cols = ordered.map((c, i) => ({ ...c, x: lastX - (ordered.length - 1 - i) * COL_W }));
  const teamMaxW = cols[0].x - COL_W / 2 - (PAD + 90) - 10;

  let y = 250;
  groups.forEach((g) => {
    if (groups.length > 1) {
      img.text(g.name.toUpperCase(), PAD, y + 30, { font: `700 36px ${DISPLAY}`, color: C.gold });
      y += GROUP_HEAD;
    }
    cols.forEach((c) => img.text(c.label, c.x, y + 26, { font: `700 24px ${BODY}`, color: C.soft, align: 'center' }));
    y += COLS_HEAD;

    g.standings.forEach((s, i) => {
      img.rect(PAD - 16, y, W - 2 * PAD + 32, ROW - 6, i % 2 ? C.rowAlt : C.row);
      const cy = y + (ROW - 6) / 2;
      img.text(String(i + 1), PAD + 14, cy, { font: `700 32px ${DISPLAY}`, color: i === 0 ? C.gold : C.text, align: 'center' });
      img.dot(PAD + 62, cy, 13, state.teams?.[s.idx]?.color);
      img.text(s.name, PAD + 90, cy, { font: `600 32px ${BODY}`, maxW: teamMaxW });
      cols.forEach((c) => {
        img.text(String(c.value(s)), c.x, cy, {
          font: c.className ? `700 36px ${DISPLAY}` : `500 30px ${BODY}`,
          color: c.className ? C.gold : C.text,
          align: 'center',
        });
      });
      y += ROW;
    });
    y += 30;
  });

  img.footer();
  await img.deliver(en.share.standingsFilename, en.share.standingsShareTitle(tournamentName()));
}

// ---------------------------------------------------------------------------
// Match result
// ---------------------------------------------------------------------------
function goalLines(res: Score, side: 'home' | 'away'): string[] {
  const scorers = res.scorers?.[side] || [];
  const assists = res.assists?.[side] || [];
  return scorers.map((pid, i) => {
    if (pid === 'auto') return en.share.ownGoal;
    const a = assists[i] && assists[i] !== 'auto' ? en.share.assist(playerName(assists[i])) : '';
    return `${playerName(pid)}${a}`;
  });
}

export async function shareResult(gi: string | number): Promise<void> {
  const game = state.schedule[Number(gi)];
  const res = state.results[gi];
  if (!game || !res || typeof res !== 'object') return;

  await ShareImage.fontsReady();

  const home = goalLines(res, 'home');
  const away = goalLines(res, 'away');
  const lines = Math.max(home.length, away.length);
  const height = 210 + 420 + lines * 48 + (res.mvp ? 90 : 0) + 110;
  const img = new ShareImage(height);

  const round = typeof game.jornada === 'number' ? en.gameModal.roundLabel(game.jornada) : String(game.jornada || '');
  img.header(tournamentName(), round ? en.share.roundResult(round) : en.share.finalResult);

  // Football: goals. Racket sports: sets won, with the games of each set underneath
  const sport = getSport(state.meta?.sport);
  const racket = sport instanceof RacketSport ? sport : null;
  const sets = racket ? racket.setsOf(res) : [];
  const [h, a] = racket
    ? Object.values(racket.setsWon(sets, racket.format(state.config)))
    : String(res.score || '0-0').split('-');
  const colHome = W / 4;
  const colAway = (3 * W) / 4;
  const teamColor = (idx: number | string) => (typeof idx === 'number' && state.teams?.[idx] ? state.teams[idx].color : '#888888');

  img.dot(colHome, 300, 34, teamColor(game.home));
  img.dot(colAway, 300, 34, teamColor(game.away));
  img.text(getTeamName(game.home), colHome, 380, { font: `700 40px ${DISPLAY}`, align: 'center', maxW: W / 2 - 80 });
  img.text(getTeamName(game.away), colAway, 380, { font: `700 40px ${DISPLAY}`, align: 'center', maxW: W / 2 - 80 });

  img.text(`${h}  -  ${a}`, W / 2, 500, { font: `700 140px ${DISPLAY}`, color: C.gold, align: 'center' });
  let y = 600;
  if (racket && sets.length) {
    img.text(racket.formatSets(sets), W / 2, y, { font: `600 34px ${BODY}`, color: C.soft, align: 'center' });
  } else if (res.penalties) {
    img.text(en.share.penalties(res.penalties), W / 2, y, { font: `600 30px ${BODY}`, color: C.soft, align: 'center' });
  }
  y += 50;

  for (let i = 0; i < lines; i++) {
    if (home[i]) img.text(`⚽ ${home[i]}`, colHome, y, { font: `500 28px ${BODY}`, align: 'center', maxW: W / 2 - 60 });
    if (away[i]) img.text(`⚽ ${away[i]}`, colAway, y, { font: `500 28px ${BODY}`, align: 'center', maxW: W / 2 - 60 });
    y += 48;
  }

  if (res.mvp) {
    y += 30;
    img.text(`⭐ ${en.share.mvp(playerName(res.mvp))}`, W / 2, y, { font: `700 36px ${DISPLAY}`, color: C.gold, align: 'center', maxW: W - 2 * PAD });
  }

  img.footer();
  await img.deliver(en.share.resultFilename, `${getTeamName(game.home)} ${res.score} ${getTeamName(game.away)}`);
}
