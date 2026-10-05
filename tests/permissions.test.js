import { describe, it, expect } from 'vitest';
import { canWritePath, canWriteGlobalPath, canSeeSingleMatches, blockedPaths, roleLabel, isMaster, isSportAdmin } from '../src/permissions.js';

describe('canWritePath', () => {
  it('master pode gravar tudo exceto campos imutáveis', () => {
    expect(canWritePath('master', 'config')).toBe(true);
    expect(canWritePath('master', 'players')).toBe(true);
    expect(canWritePath('master', 'meta')).toBe(true);
    expect(canWritePath('master', 'meta/name')).toBe(true);
    expect(canWritePath('master', 'meta/sport')).toBe(false);
  });

  it('admin com modalidade autorizada pode gravar config do seu desporto', () => {
    const footAdminOpts = { sport: 'football', userAdmin: { football: true } };
    expect(canWritePath('admin', 'config', footAdminOpts)).toBe(true);
    expect(canWritePath('admin', 'schedule', footAdminOpts)).toBe(true);
    expect(canWritePath('admin', 'meta/name', footAdminOpts)).toBe(true);
    expect(canWritePath('admin', 'meta/sport', footAdminOpts)).toBe(false);
  });

  it('admin NÃO altera config nem resultados de modalidade diferente', () => {
    const footAdminOnPadel = { sport: 'padel', userAdmin: { football: true } };
    expect(canWritePath('admin', 'config', footAdminOnPadel)).toBe(false);
    expect(canWritePath('admin', 'schedule', footAdminOnPadel)).toBe(false);
    expect(canWritePath('admin', 'meta/name', footAdminOnPadel)).toBe(false);
    expect(canWritePath('admin', 'results/0', footAdminOnPadel)).toBe(false);
    expect(canWritePath('admin', 'schedule/1/home', footAdminOnPadel)).toBe(false);
  });

  it('admin sem contexto de modalidade mantém compatibilidade', () => {
    expect(canWritePath('admin', 'config')).toBe(true);
    expect(canWritePath('admin', 'players')).toBe(true);
    expect(canWritePath('admin', 'meta/sport')).toBe(false);
  });

  it('utilizador não grava jogos singulares, resultados nem vencedores de playoff', () => {
    expect(canWritePath('user', 'results/3')).toBe(false);
    expect(canWritePath('user', 'schedule/4/home')).toBe(false);
    expect(canWritePath('user', 'schedule/4/away')).toBe(false);
    expect(canWritePath('user', 'jogosSingulares')).toBe(false);
    expect(canWritePath('user', 'exportedAt')).toBe(true);
  });

  it('utilizador não altera configuração, equipas, jogadores nem metadados', () => {
    expect(canWritePath('user', 'config')).toBe(false);
    expect(canWritePath('user', 'meta')).toBe(false);
    expect(canWritePath('user', 'meta/name')).toBe(false);
    expect(canWritePath('user', 'meta/sport')).toBe(false);
    expect(canWritePath('user', 'teams')).toBe(false);
    expect(canWritePath('user', 'squads')).toBe(false);
    expect(canWritePath('user', 'players')).toBe(false);
    expect(canWritePath('user', 'roundsMeta')).toBe(false);
  });

  it('utilizador não apaga nem reescreve o calendário', () => {
    expect(canWritePath('user', 'schedule')).toBe(false);
    expect(canWritePath('user', 'schedule/4')).toBe(false);
    expect(canWritePath('user', 'schedule/4/jornada')).toBe(false);
  });

  it('pendentes e visitantes não gravam nada', () => {
    expect(canWritePath(null, 'results/0')).toBe(false);
    expect(canWritePath(undefined, 'exportedAt')).toBe(false);
    expect(canWritePath('outro', 'results/0')).toBe(false);
  });
});

describe('blockedPaths', () => {
  it('devolve só os caminhos proibidos', () => {
    const updates = { 'results/1': {}, config: {}, exportedAt: 'x' };
    expect(blockedPaths('user', updates)).toEqual(['results/1', 'config']);
    expect(blockedPaths('master', updates)).toEqual([]);
    expect(blockedPaths('admin', updates)).toEqual([]);
    expect(blockedPaths('admin', updates, { sport: 'padel', userAdmin: { football: true } })).toEqual(['results/1', 'config']);
    expect(blockedPaths('master', { 'meta/sport': 'padel' })).toEqual(['meta/sport']);
  });
});

describe('roleLabel, isMaster e isSportAdmin', () => {
  it('mostra etiquetas corretas', () => {
    expect(roleLabel('master')).toBe('Master Admin');
    expect(roleLabel('admin')).toBe('Admin');
    expect(roleLabel('admin', { football: true })).toBe('Admin (Football)');
    expect(roleLabel('admin', { football: true, padel: true })).toBe('Admin (Football, Padel)');
    expect(roleLabel('user')).toBe('User');
    expect(roleLabel(null)).toBe('Pending');
  });

  it('isMaster valida corretamente', () => {
    expect(isMaster('master')).toBe(true);
    expect(isMaster('admin')).toBe(false);
    expect(isMaster('user')).toBe(false);
  });

  it('isSportAdmin valida modalidade', () => {
    expect(isSportAdmin('master', 'football')).toBe(true);
    expect(isSportAdmin('master', 'padel')).toBe(true);
    expect(isSportAdmin('admin', 'football', { football: true })).toBe(true);
    expect(isSportAdmin('admin', 'padel', { football: true })).toBe(false);
    expect(isSportAdmin('user', 'football', { football: true })).toBe(false);
  });
});

describe('canWriteGlobalPath', () => {
  const foot = { userAdmin: { football: true } };
  const padel = { userAdmin: { padel: true } };

  it('single matches are for football admins and the master only', () => {
    expect(canSeeSingleMatches('admin', { football: true })).toBe(true);
    expect(canSeeSingleMatches('admin', { padel: true })).toBe(false);
    expect(canSeeSingleMatches('user', null)).toBe(false);
    expect(canWriteGlobalPath('admin', 'singleMatches/m1', {}, foot)).toBe(true);
    expect(canWriteGlobalPath('admin', 'singleMatches/m1', {}, padel)).toBe(false);
    expect(canWriteGlobalPath('user', 'singleMatches/m1', {})).toBe(false);
  });

  it('an admin edits only the ratings of their own sport', () => {
    expect(canWriteGlobalPath('admin', 'players/p1/ratings/padel', {}, padel)).toBe(true);
    expect(canWriteGlobalPath('admin', 'players/p1/ratings/football', {}, padel)).toBe(false);
    expect(canWriteGlobalPath('admin', 'players/p1/atributos', {}, padel)).toBe(false);
    expect(canWriteGlobalPath('admin', 'players/p1/atributos', {}, foot)).toBe(true);
    expect(canWriteGlobalPath('admin', 'players/p1/nome', 'X', padel)).toBe(true);
    expect(canWriteGlobalPath('user', 'players/p1/nome', 'X')).toBe(false);
  });

  it('any admin adds a player, only the master deletes one', () => {
    expect(canWriteGlobalPath('admin', 'players/p9', { id: 'p9' }, padel)).toBe(true);
    expect(canWriteGlobalPath('admin', 'players/p9', null, padel)).toBe(false);
    expect(canWriteGlobalPath('master', 'players/p9', null)).toBe(true);
  });

  it('an admin changes only history entries of their own sport', () => {
    expect(canWriteGlobalPath('admin', 'arquivo/a1', { sport: 'padel' }, padel)).toBe(true);
    expect(canWriteGlobalPath('admin', 'arquivo/a1', { sport: 'padel' }, { ...padel, prevSport: 'football' })).toBe(false);
    expect(canWriteGlobalPath('admin', 'arquivo/a1', null, { ...padel, prevSport: 'football' })).toBe(false);
    expect(canWriteGlobalPath('admin', 'arquivo/a1', null, { ...foot, prevSport: 'football' })).toBe(true);
  });

  it('blockedPaths uses the sport of the entry being replaced', () => {
    const updates = { 'arquivo/a1': null, 'players/p1/ratings/padel': {} };
    expect(blockedPaths('admin', updates, { userAdmin: { padel: true }, archiveSports: { a1: 'football' } })).toEqual(['arquivo/a1']);
  });
});
