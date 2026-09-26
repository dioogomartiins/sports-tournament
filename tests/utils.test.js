import { describe, it, expect, vi } from 'vitest';

vi.mock('../js/state.js', () => ({ state: { teams: [] } }));

const { escapeHtml, safeColor } = await import('../js/utils.js');

describe('escapeHtml', () => {
  it('escapa os caracteres especiais de HTML', () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">&`)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;'
    );
  });

  it('converte valores que não são texto', () => {
    expect(escapeHtml(7)).toBe('7');
  });
});

describe('safeColor', () => {
  it('aceita cores hex', () => {
    expect(safeColor('#2f7a4f')).toBe('#2f7a4f');
    expect(safeColor('#FFF')).toBe('#FFF');
  });

  it('substitui qualquer outro valor pela cor por defeito', () => {
    expect(safeColor('red; background:url(https://x)')).toBe('#2F7A4F');
    expect(safeColor(undefined)).toBe('#2F7A4F');
  });
});
