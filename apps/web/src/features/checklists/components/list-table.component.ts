import { LIST_TYPE_LABELS } from "../models/list-type.models";
import { Component, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ChecklistSummary } from "../models/checklist.models";
import { PersianNumberPipe } from "../../../shared/pipes/persian-number.pipe";
@Component({
  selector: "app-list-table",
  imports: [RouterLink, PersianNumberPipe],
  templateUrl: "./list-table.component.html",
})
export class ListTableComponent {
  readonly typeLabels = LIST_TYPE_LABELS;
  readonly lists = input.required<ChecklistSummary[]>();
  readonly busy = input(false);
  readonly edited = output<ChecklistSummary>();
  readonly removed = output<ChecklistSummary>();
  readonly archived = output<ChecklistSummary>();
  count(l: ChecklistSummary) {
    return l.items.filter((i) => i.completed).length;
  }
}
