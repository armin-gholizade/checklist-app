import { Component, input, output } from "@angular/core";
import { DialogComponent } from "./dialog.component";
import { FeedbackComponent } from "./feedback.component";
@Component({
  selector: "app-confirm-dialog",
  imports: [DialogComponent, FeedbackComponent],
  template: `<app-dialog
    [title]="title()"
    [busy]="busy()"
    (closed)="cancelled.emit()"
    ><p>{{ message() }}</p>
    <app-feedback [error]="error()" />
    <div class="modal-actions">
      <button
        class="destructive"
        [disabled]="busy()"
        (click)="confirmed.emit()"
      >
        {{ busy() ? "در حال انجام…" : "حذف" }}</button
      ><button class="secondary" [disabled]="busy()" (click)="cancelled.emit()">
        انصراف
      </button>
    </div></app-dialog
  >`,
})
export class ConfirmDialogComponent {
  readonly title = input("حذف شود؟");
  readonly message = input.required<string>();
  readonly error = input("");
  readonly busy = input(false);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
