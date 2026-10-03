import { ListType } from "../../checklists/models/list-type.models";
import {
  Component,
  input,
  output,
  signal,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  ChecklistItem,
  ItemUpdate,
  PRIORITY_LABELS,
} from "../models/item.models";
@Component({
  selector: "app-item-row",
  imports: [FormsModule],
  templateUrl: "./item-row.component.html",
})
export class ItemRowComponent implements OnChanges {
  readonly item = input.required<ChecklistItem>();
  readonly listType = input<ListType>("TASK");
  readonly busy = input(false);
  readonly readonly = input(false);
  readonly reorderEnabled = input(true);
  readonly first = input(false);
  readonly last = input(false);
  readonly updated = output<ItemUpdate>();
  readonly details = output<void>();
  readonly removed = output<void>();
  readonly moved = output<number>();
  readonly editing = signal(false);
  draft = "";
  readonly labels = PRIORITY_LABELS;
  start() {
    if (this.readonly() || this.busy()) return;
    this.draft = this.item().title;
    this.editing.set(true);
    setTimeout(() => {
      const e = document.getElementById(
        "quick-" + this.item().id,
      ) as HTMLInputElement;
      e?.focus();
      e?.select();
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    const c = changes["item"];
    if (c?.previousValue && c.previousValue.title !== c.currentValue.title)
      this.editing.set(false);
  }
  save() {
    if (this.draft.trim() === this.item().title) {
      this.editing.set(false);
      return;
    }
    if (this.draft.trim()) this.updated.emit({ title: this.draft.trim() });
  }
  number(value: string) {
    return Number(value).toLocaleString("fa-IR", { maximumFractionDigits: 3 });
  }
  dateLabel(value: string) {
    return new Date(value + "T12:00:00").toLocaleDateString("fa-IR");
  }
  overdue() {
    const i = this.item();
    if (!i.dueDate || i.completed) return false;
    const now = new Date();
    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
    return i.dueDate < today;
  }
}
