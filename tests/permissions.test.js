import { describe, it, expect } from 'vitest';
import { canWritePath, blockedPaths, roleLabel, isMaster, isSportAdmin } from '../src/permissions.js';

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

  it('admin NÃO altera config de modalidade diferente, mas pode gravar resultados como user', () => {
    const footAdminOnPadel = { sport: 'padel', userAdmin: { football: true } };
    expect(canWritePath('admin', 'config', footAdminOnPadel)).toBe(false);
    expect(canWritePath('admin', 'schedule', footAdminOnPadel)).toBe(false);
    expect(canWritePath('admin', 'meta/name', footAdminOnPadel)).toBe(false);
    // Pode gravar resultados e playoff winners
    expect(canWritePath('admin', 'results/0', footAdminOnPadel)).toBe(true);
    expect(canWritePath('admin', 'schedule/1/home', footAdminOnPadel)).toBe(true);
  });

  it('admin sem contexto de modalidade mantém compatibilidade', () => {
    expect(canWritePath('admin', 'config')).toBe(true);
    expect(canWritePath('admin', 'players')).toBe(true);
    expect(canWritePath('admin', 'meta/sport')).toBe(false);
  });

  it('utilizador grava resultados, calendário e jogos singulares', () => {
    expect(canWritePath('user', 'results/3')).toBe(true);
    expect(canWritePath('user', 'schedule/4/home')).toBe(true);
    expect(canWritePath('user', 'schedule/4/away')).toBe(true);
    expect(canWritePath('user', 'jogosSingulares')).toBe(true);
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
    expect(blockedPaths('user', updates)).toEqual(['config']);
    expect(blockedPaths('master', updates)).toEqual([]);
    expect(blockedPaths('admin', updates)).toEqual([]);
    expect(blockedPaths('admin', updates, { sport: 'padel', userAdmin: { football: true } })).toEqual(['config']);
    expect(blockedPaths('master', { 'meta/sport': 'padel' })).toEqual(['meta/sport']);
  });
});

describe('roleLabel, isMaster e isSportAdmin', () => {
  it('mostra etiquetas corretas', () => {
    expect(roleLabel('master')).toBe('Master Admin');
    expect(roleLabel('admin')).toBe('Admin');
    expect(roleLabel('admin', { football: true })).toBe('Admin (Football)');
    expect(roleLabel('admin', { football: true, padel: true })).toBe('Admin (Football, Padel)');
    expect(roleLabel('user')).toBe('Utilizador');
    expect(roleLabel(null)).toBe('Pendente');
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
