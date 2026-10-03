import { ListType, LIST_TYPE_LABELS } from "../models/list-type.models";
import { ListTypePickerComponent } from "./list-type-picker.component";
import { Component, input, output, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DialogComponent } from "../../../shared/components/dialog.component";
import { FeedbackComponent } from "../../../shared/components/feedback.component";
import { ListInput } from "../models/checklist.models";
@Component({
  selector: "app-list-editor",
  imports: [
    FormsModule,
    DialogComponent,
    FeedbackComponent,
    ListTypePickerComponent,
  ],
  templateUrl: "./list-editor.component.html",
})
export class ListEditorComponent implements OnInit {
  readonly initial = input<ListInput | null>(null);
  readonly busy = input(false);
  readonly error = input("");
  readonly saved = output<ListInput>();
  readonly cancelled = output<void>();
  type: ListType = "TASK";
  readonly typeLabels = LIST_TYPE_LABELS;
  title = "";
  description = "";
  ngOnInit() {
    this.type = this.initial()?.type ?? "TASK";
    this.title = this.initial()?.title ?? "";
    this.description = this.initial()?.description ?? "";
  }
  submit() {
    if (this.title.trim())
      this.saved.emit({
        ...(!this.initial() ? { type: this.type } : {}),
        title: this.title.trim(),
        description: this.description.trim(),
      });
  }
}
