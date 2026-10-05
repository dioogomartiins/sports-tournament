import { describe, it, expect } from 'vitest';
import { canWritePath, blockedPaths, roleLabel } from '../src/permissions.js';

describe('canWritePath', () => {
  it('admin pode gravar tudo exceto campos imutáveis', () => {
    expect(canWritePath('admin', 'config')).toBe(true);
    expect(canWritePath('admin', 'players')).toBe(true);
    expect(canWritePath('admin', 'meta')).toBe(true);
    expect(canWritePath('admin', 'meta/name')).toBe(true);
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
    expect(blockedPaths('admin', updates)).toEqual([]);
    expect(blockedPaths('admin', { 'meta/sport': 'padel' })).toEqual(['meta/sport']);
  });
});

describe('roleLabel', () => {
  it('mostra Pendente sem perfil', () => {
    expect(roleLabel('admin')).toBe('Admin');
    expect(roleLabel('user')).toBe('Utilizador');
    expect(roleLabel(null)).toBe('Pendente');
  });
});
