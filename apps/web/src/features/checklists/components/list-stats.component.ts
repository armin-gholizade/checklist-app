import { Component, input, computed } from "@angular/core";
import { ChecklistSummary } from "../models/checklist.models";
import { PersianNumberPipe } from "../../../shared/pipes/persian-number.pipe";
@Component({
  selector: "app-list-stats",
  imports: [PersianNumberPipe],
  template: `<div class="stats">
    <div>
      <span class="stat-icon blue">☷</span
      ><span
        >لیست‌ها<strong>{{ lists().length | fa }}</strong></span
      >
    </div>
    <div>
      <span class="stat-icon green">✓</span
      ><span
        >انجام‌شده<strong>{{ done() | fa }}</strong></span
      >
    </div>
    <div>
      <span class="stat-icon amber">◷</span
      ><span
        >باقی‌مانده<strong>{{ total() - done() | fa }}</strong></span
      >
    </div>
  </div>`,
})
export class ListStatsComponent {
  readonly lists = input.required<ChecklistSummary[]>();
  readonly total = computed(() =>
    this.lists().reduce((n, l) => n + l.items.length, 0),
  );
  readonly done = computed(() =>
    this.lists().reduce(
      (n, l) => n + l.items.filter((i) => i.completed).length,
      0,
    ),
  );
}
