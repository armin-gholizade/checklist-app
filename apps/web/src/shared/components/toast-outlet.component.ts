import { Component, inject } from "@angular/core";
import { NotificationService } from "../services/notification.service";
@Component({
  selector: "app-toast-outlet",
  template: `<div class="toast-stack" aria-live="polite">
    @for (n of notifications.notices(); track n.id) {
      <div class="notice">
        <span>{{ n.message }}</span>
        @if (n.action) {
          <button
            class="undo-button"
            [disabled]="n.busy"
            (click)="notifications.undo(n.id)"
          >
            {{ n.busy ? "در حال بازگردانی…" : "بازگردانی" }}
          </button>
        }
        <button
          class="dismiss-notice"
          aria-label="بستن اعلان"
          [disabled]="n.busy"
          (click)="notifications.dismiss(n.id)"
        >
          ×
        </button>
        @if (n.error) {
          <p role="alert">{{ n.error }}</p>
        }
      </div>
    }
  </div>`,
})
export class ToastOutletComponent {
  readonly notifications = inject(NotificationService);
}
