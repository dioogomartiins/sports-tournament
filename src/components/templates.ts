// ---------------------------------------------------------------------------
// Small Lit templates shared by several components
// ---------------------------------------------------------------------------
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type { Team } from '../types.js';
import { safeColor } from '../utils.js';

/** A coloured dot, like a team crest in the tables. */
export function colorDot(color: string, size = 10): TemplateResult {
  return html`<span style=${styleMap({
    display: 'inline-block', width: `${size}px`, height: `${size}px`, borderRadius: '50%',
    backgroundColor: safeColor(color), marginRight: '6px', boxShadow: '0 0 2px rgba(0,0,0,0.3)',
  })}></span>`;
}

/**
 * Team name with its colour dot. A string instead of an index is a placeholder
 * (e.g. "Winner QF1", a playoff slot not decided yet) and is shown in italics.
 */
export function teamLabel(teams: (Team | undefined)[] | null | undefined, idx: number | string): TemplateResult {
  if (typeof idx === 'string') {
    return html`<span style="color:var(--ink-faint); font-style:italic; font-size:12px;">${idx}</span>`;
  }
  const team = teams?.[idx];
  const name = (team && team.name) || `Team ${idx + 1}`;
  return html`<span style="display:inline-flex; align-items:center; white-space:nowrap;">${colorDot(team ? team.color : '#2F7A4F')}${name}</span>`;
}
