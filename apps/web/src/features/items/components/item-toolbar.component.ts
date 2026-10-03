import { Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ItemFilter } from "../models/item.models";
@Component({
  selector: "app-item-toolbar",
  imports: [FormsModule],
  template: `<div class="toolbar">
    <input
      type="search"
      aria-label="جست‌وجوی آیتم‌ها"
      placeholder="جست‌وجو در عنوان و یادداشت…"
      [ngModel]="query()"
      (ngModelChange)="queryChange.emit($event)"
    />
    <div class="filter-tabs" role="group" aria-label="فیلتر وضعیت">
      @for (f of filters; track f.value) {
        <button
          class="quiet"
          [class.active]="filter() === f.value"
          [attr.aria-pressed]="filter() === f.value"
          (click)="filterChange.emit(f.value)"
        >
          {{ f.label }}
        </button>
      }
    </div>
  </div>`,
})
export class ItemToolbarComponent {
  readonly query = input("");
  readonly filter = input<ItemFilter>("all");
  readonly queryChange = output<string>();
  readonly filterChange = output<ItemFilter>();
  readonly filters: { value: ItemFilter; label: string }[] = [
    { value: "all", label: "همه" },
    { value: "pending", label: "انجام‌نشده" },
    { value: "completed", label: "انجام‌شده" },
  ];
}
