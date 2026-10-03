import { signal } from "@angular/core";
/** Per-page asynchronous state; API and domain logic stay in feature services. */
export class PageTask {
  readonly busy = signal(false);
  readonly error = signal("");
  async run(work: () => Promise<void>): Promise<boolean> {
    if (this.busy()) return false;
    this.busy.set(true);
    this.error.set("");
    try {
      await work();
      return true;
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : "عملیات انجام نشد.");
      return false;
    } finally {
      this.busy.set(false);
    }
  }
}
