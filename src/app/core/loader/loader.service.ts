import { Injectable, computed, signal } from '@angular/core';

/**
 * Signal-driven replacement for the dual-library loader stack
 * (`ng4-loading-spinner` + `ngx-loading`). The single `<app-loader>` overlay
 * (added in Phase 3) reads {@link visible} via `toSignal()` / direct binding.
 */
@Injectable({ providedIn: 'root' })
export class LoaderService {
  /** Counter of in-flight blocking operations. */
  private readonly inFlight = signal<number>(0);
  private readonly message = signal<string | null>(null);

  readonly visible = computed(() => this.inFlight() > 0);
  readonly text = computed(() => this.message());

  show(message?: string): void {
    if (message !== undefined) this.message.set(message);
    this.inFlight.update((n) => n + 1);
  }

  hide(): void {
    this.inFlight.update((n) => Math.max(0, n - 1));
    if (this.inFlight() === 0) this.message.set(null);
  }

  reset(): void {
    this.inFlight.set(0);
    this.message.set(null);
  }

  /** Convenience: wraps a promise so the loader shows during its lifetime. */
  async wrap<T>(p: Promise<T>, message?: string): Promise<T> {
    this.show(message);
    try {
      return await p;
    } finally {
      this.hide();
    }
  }
}
