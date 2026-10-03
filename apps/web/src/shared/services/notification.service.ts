import { Injectable, signal } from "@angular/core";
export interface Notice {
  id: number;
  message: string;
  action?: () => Promise<void>;
  busy: boolean;
  error: string;
}
@Injectable({ providedIn: "root" })
export class NotificationService {
  readonly notices = signal<Notice[]>([]);
  private next = 0;
  show(message: string, action?: () => Promise<void>) {
    const id = ++this.next;
    this.notices.update((all) => [
      ...all,
      { id, message, action, busy: false, error: "" },
    ]);
    if (!action) setTimeout(() => this.dismiss(id), 4000);
  }
  dismiss(id: number) {
    this.notices.update((all) => all.filter((n) => n.id !== id || n.busy));
  }
  async undo(id: number) {
    const n = this.notices().find((n) => n.id === id);
    if (!n?.action || n.busy) return;
    this.patch(id, { busy: true, error: "" });
    try {
      await n.action();
      this.patch(id, { busy: false });
      this.dismiss(id);
      this.show("بازگردانی انجام شد.");
    } catch (e) {
      this.patch(id, {
        busy: false,
        error: e instanceof Error ? e.message : "بازگردانی انجام نشد.",
      });
    }
  }
  private patch(id: number, patch: Partial<Notice>) {
    this.notices.update((all) =>
      all.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    );
  }
}
