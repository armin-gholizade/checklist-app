import { ListType } from "../../checklists/models/list-type.models";
import { Component, input, output, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DialogComponent } from "../../../shared/components/dialog.component";
import { FeedbackComponent } from "../../../shared/components/feedback.component";
import { ChecklistItem, ItemInput, Priority } from "../models/item.models";
@Component({
  selector: "app-item-editor",
  imports: [FormsModule, DialogComponent, FeedbackComponent],
  templateUrl: "./item-editor.component.html",
})
export class ItemEditorComponent implements OnInit {
  readonly initial = input<ChecklistItem | null>(null);
  readonly listType = input<ListType>("TASK");
  readonly busy = input(false);
  readonly error = input("");
  readonly saved = output<ItemInput>();
  readonly cancelled = output<void>();
  quantity: number | null = 1;
  unit = "عدد";
  estimatedPrice: number | null = null;
  readonly units = [
    "عدد",
    "کیلوگرم",
    "گرم",
    "لیتر",
    "میلی‌لیتر",
    "بسته",
    "جعبه",
    "متر",
  ];
  title = "";
  notes = "";
  priority: Priority = "NORMAL";
  dueDate = "";
  ngOnInit() {
    const i = this.initial();
    if (i) {
      this.quantity = i.quantity === null ? 1 : Number(i.quantity);
      this.unit = i.unit ?? "عدد";
      this.estimatedPrice =
        i.estimatedPrice === null ? null : Number(i.estimatedPrice);
      this.title = i.title;
      this.notes = i.notes;
      this.priority = i.priority;
      this.dueDate = i.dueDate ?? "";
    }
  }
  shoppingValid() {
    return (
      this.quantity !== null &&
      Number.isFinite(this.quantity) &&
      this.quantity >= 0.001 &&
      this.quantity <= 999999999.999 &&
      /^\d+(\.\d{1,3})?$/.test(String(this.quantity)) &&
      !!this.unit.trim() &&
      this.unit.trim().length <= 30 &&
      (this.estimatedPrice === null ||
        (Number.isFinite(this.estimatedPrice) &&
          this.estimatedPrice >= 0 &&
          this.estimatedPrice <= 9999999999.99 &&
          /^\d+(\.\d{1,2})?$/.test(String(this.estimatedPrice))))
    );
  }
  submit() {
    if (!this.title.trim()) return;
    const common = { title: this.title.trim() };
    if (this.listType() === "SHOPPING") {
      if (!this.shoppingValid()) return;
      this.saved.emit({
        ...common,
        quantity: this.quantity!,
        unit: this.unit.trim(),
        estimatedPrice: this.estimatedPrice,
      });
    } else if (this.listType() === "TASK")
      this.saved.emit({
        ...common,
        notes: this.notes.trim(),
        priority: this.priority,
        dueDate: this.dueDate || null,
      });
    else this.saved.emit(common);
  }
}
