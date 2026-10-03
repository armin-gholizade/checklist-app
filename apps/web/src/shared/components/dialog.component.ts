import {
  Component,
  ElementRef,
  viewChild,
  input,
  output,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
let dialogId = 0;
@Component({
  selector: "app-dialog",
  template: `<dialog
    #dialog
    class="modal"
    [attr.aria-labelledby]="id"
    (cancel)="$event.preventDefault(); close()"
  >
    <div class="modal-top">
      <h2 [id]="id">{{ title() }}</h2>
      <button
        class="quiet close"
        aria-label="بستن پنجره"
        [disabled]="busy()"
        (click)="close()"
      >
        ×
      </button>
    </div>
    <ng-content />
  </dialog>`,
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  readonly title = input.required<string>();
  readonly busy = input(false);
  readonly closed = output<void>();
  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog");
  readonly id = "dialog-" + ++dialogId;
  private previous = document.activeElement as HTMLElement | null;
  ngAfterViewInit() {
    this.dialog().nativeElement.showModal();
  }
  close() {
    if (!this.busy()) this.closed.emit();
  }
  ngOnDestroy() {
    this.dialog().nativeElement.close();
    if (this.previous?.isConnected) this.previous.focus();
  }
}
