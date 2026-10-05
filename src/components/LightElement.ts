// ---------------------------------------------------------------------------
// LightElement — base class of the app's Lit components
// ---------------------------------------------------------------------------
// Renders in the light DOM, so the components keep the app's CSS (css/*.css
// and the mobile tweaks) instead of copying it into each one. Like a Blazor
// component without CSS isolation: properties in, events out.
import { LitElement } from 'lit';

export abstract class LightElement extends LitElement {
  /**
   * CSS `display` of the host element. `contents` makes the children direct
   * items of the parent's grid or flex layout (e.g. cards in `.stats-grid`);
   * `block` is only applied when the page's CSS leaves the tag inline.
   */
  protected hostDisplay: 'block' | 'contents' = 'block';

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // A class on the tag (e.g. `.torneios-grid`) may already set its display
    if (this.hostDisplay === 'contents' || getComputedStyle(this).display === 'inline') {
      this.style.display = this.hostDisplay;
    }
  }

  /** Sends a bubbling event to the controller in src/ui/ (like a Blazor EventCallback). */
  protected emit<T>(name: string, detail?: T): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }
}
