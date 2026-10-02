// ---------------------------------------------------------------------------
// Sincronização — diferenças entre snapshots para gravar no Firebase
// ---------------------------------------------------------------------------

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Calcula as alterações entre o último snapshot sincronizado e o atual, no
 * formato de `update()` do Firebase (caminho → valor, null apaga).
 *
 * Os resultados são gravados jogo a jogo, para que duas pessoas a introduzir
 * resultados de jogos diferentes ao mesmo tempo não apaguem o trabalho uma da
 * outra. As restantes secções só são enviadas quando mudam.
 *
 * @param {object|null} prev - Último snapshot sincronizado (null = nenhum)
 * @param {object}      next - Snapshot atual
 * @returns {object} Mapa de caminhos para `update()`
 */
export function diffSnapshot(prev, next) {
  const updates = {};

  if (!prev) {
    Object.keys(next).forEach((key) => { updates[key] = next[key] ?? null; });
    return updates;
  }

  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  keys.forEach((key) => {
    if (key === 'results') {
      const a = prev.results || {};
      const b = next.results || {};
      new Set([...Object.keys(a), ...Object.keys(b)]).forEach((gi) => {
        if (!same(a[gi], b[gi])) updates[`results/${gi}`] = b[gi] ?? null;
      });
    } else if (!same(prev[key], next[key])) {
      updates[key] = next[key] ?? null;
    }
  });

  return updates;
}

/**
 * O Firebase apaga listas vazias e converte objetos com chaves numéricas em
 * arrays (com buracos a null). Repõe a forma esperada dos resultados.
 */
export function normalizeResults(results) {
  const out = {};
  Object.keys(results || {}).forEach((gi) => {
    const r = results[gi];
    if (r === null || r === undefined) return;
    if (typeof r === 'object') {
      const scorers = r.scorers || {};
      out[gi] = { ...r, scorers: { home: scorers.home || [], away: scorers.away || [] } };
    } else {
      out[gi] = r;
    }
  });
  return out;
}

const SECTION_LABELS = {
  config: 'Configuração alterada',
  teams: 'Equipas alteradas',
  squads: 'Plantéis alterados',
  schedule: 'Calendário alterado',
  roundsMeta: null,
  scheduleTeamCount: null,
  scheduleVoltas: null,
  players: 'Base de dados de jogadores alterada',
  jogosSingulares: 'Jogos singulares alterados',
  results: 'Resultados alterados',
  exportedAt: null,
  version: null,
};

function teamLabel(snap, idx) {
  if (typeof idx === 'string') return idx;
  const t = snap.teams && snap.teams[idx];
  return t && t.name ? t.name : `Equipa ${Number(idx) + 1}`;
}

/**
 * Descreve em texto as alterações de um `update()`, para o registo de
 * alterações (quem mudou o quê).
 *
 * @param {object} updates - Mapa de caminhos devolvido por diffSnapshot
 * @param {object} snap    - Snapshot depois da alteração
 * @returns {string} Descrição, ou '' se só mudaram metadados
 */
export function describeUpdates(updates, snap) {
  const parts = [];
  Object.keys(updates).forEach((path) => {
    const [section, gi] = path.split('/');
    if (section === 'results' && gi !== undefined) {
      const game = (snap.schedule || [])[gi];
      const jogo = game
        ? `${teamLabel(snap, game.home)} vs ${teamLabel(snap, game.away)}`
        : `jogo ${Number(gi) + 1}`;
      const r = updates[path];
      if (r === null || r === undefined) {
        parts.push(`Resultado apagado: ${jogo}`);
      } else {
        const score = typeof r === 'object' ? r.score : r;
        const pen = r && r.penalties ? ` (g.p. ${r.penalties})` : '';
        const status = r && r.status ? `, ${r.status}` : '';
        parts.push(`Resultado ${jogo}: ${score}${pen}${status}`);
      }
      return;
    }
    const label = Object.prototype.hasOwnProperty.call(SECTION_LABELS, section)
      ? SECTION_LABELS[section]
      : `${section} alterado`;
    if (label && !parts.includes(label)) parts.push(label);
  });
  return parts.join('; ').slice(0, 500);
}
