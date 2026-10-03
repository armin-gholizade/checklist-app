import { Component, input, computed } from "@angular/core";
import { ChecklistItem } from "../../items/models/item.models";
import { PersianNumberPipe } from "../../../shared/pipes/persian-number.pipe";
@Component({
  selector: "app-list-progress",
  imports: [PersianNumberPipe],
  template: `<div class="progress-card">
    <div>
      <strong
        >{{ done() | fa }} از {{ items().length | fa }} آیتم انجام شده</strong
      ><span class="muted">{{
        items().length && done() === items().length
          ? "همه‌چیز انجام شد. عالی بود!"
          : "هر تیک، یک قدم جلوتر."
      }}</span>
    </div>
    <span class="progress-percent">{{ percent() | fa }}<small>٪</small></span
    ><progress
      [value]="done()"
      [max]="items().length || 1"
      aria-label="پیشرفت کل لیست"
    ></progress>
  </div>`,
})
export class ListProgressComponent {
  readonly items = input.required<ChecklistItem[]>();
  readonly done = computed(
    () => this.items().filter((i) => i.completed).length,
  );
  readonly percent = computed(() =>
    this.items().length
      ? Math.round((this.done() / this.items().length) * 100)
      : 0,
  );
}
