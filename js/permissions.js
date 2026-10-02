// ---------------------------------------------------------------------------
// Permissões — o que cada perfil pode alterar no torneio
// ---------------------------------------------------------------------------
// Tem de corresponder a database.rules.json: as regras do Firebase são a
// proteção real, isto serve só para avisar antes de enviar e esconder botões.

export const ROLES = {
  admin: 'Admin',
  user: 'Utilizador',
};

/**
 * Secções de torneio_state que um utilizador (não admin) pode gravar. Do
 * calendário só pode gravar `schedule/<jogo>/home` e `away` (eliminatórias).
 */
const USER_SECTIONS = ['results', 'jogosSingulares', 'exportedAt', 'version'];

export function isKnownRole(role) {
  return Object.prototype.hasOwnProperty.call(ROLES, role);
}

/** Nome do perfil para mostrar ao utilizador. */
export function roleLabel(role) {
  return isKnownRole(role) ? ROLES[role] : 'Pendente';
}

/** Pode este perfil gravar o caminho (relativo a torneio_state)? */
export function canWritePath(role, path) {
  if (role === 'admin') return true;
  if (role !== 'user') return false;
  const parts = String(path).split('/');
  // No calendário, um utilizador só passa equipas aos jogos seguintes
  if (parts[0] === 'schedule') return parts.length === 3 && (parts[2] === 'home' || parts[2] === 'away');
  return USER_SECTIONS.includes(parts[0]);
}

/** Caminhos de um `update()` que este perfil não pode gravar. */
export function blockedPaths(role, updates) {
  return Object.keys(updates).filter((p) => !canWritePath(role, p));
}
