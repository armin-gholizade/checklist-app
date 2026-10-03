import { ListType } from "../../checklists/models/list-type.models";
import { Component, input, output } from "@angular/core";
import {
  CdkDrag,
  CdkDropList,
  CdkDragHandle,
  CdkDragDrop,
} from "@angular/cdk/drag-drop";
import { ChecklistItem, ItemUpdate } from "../models/item.models";
import { ItemRowComponent } from "./item-row.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state.component";
import { PersianNumberPipe } from "../../../shared/pipes/persian-number.pipe";
@Component({
  selector: "app-item-list",
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    ItemRowComponent,
    EmptyStateComponent,
    PersianNumberPipe,
  ],
  templateUrl: "./item-list.component.html",
})
export class ItemListComponent {
  readonly items = input.required<ChecklistItem[]>();
  readonly listType = input<ListType>("TASK");
  readonly busy = input(false);
  readonly readonly = input(false);
  readonly reorderEnabled = input(true);
  readonly updated = output<{ item: ChecklistItem; body: ItemUpdate }>();
  readonly details = output<ChecklistItem>();
  readonly removed = output<ChecklistItem>();
  readonly reordered = output<{ from: number; to: number }>();
  drop(e: CdkDragDrop<ChecklistItem[]>) {
    if (e.previousIndex !== e.currentIndex)
      this.reordered.emit({ from: e.previousIndex, to: e.currentIndex });
  }
}
