// ---------------------------------------------------------------------------
// Permissões — o que cada perfil pode alterar no torneio
// ---------------------------------------------------------------------------
// Tem de corresponder a database.rules.json: as regras do Firebase são a
// proteção real, isto serve só para avisar antes de enviar e esconder botões.

export const ROLES = {
  admin: 'Admin',
  user: 'Utilizador',
};

/** Secções de torneio_state que um utilizador (não admin) pode gravar. */
const USER_SECTIONS = ['results', 'schedule', 'jogosSingulares', 'exportedAt', 'version'];

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
  const section = String(path).split('/')[0];
  return USER_SECTIONS.includes(section);
}

/** Caminhos de um `update()` que este perfil não pode gravar. */
export function blockedPaths(role, updates) {
  return Object.keys(updates).filter((p) => !canWritePath(role, p));
}
