import { Component, input, output } from "@angular/core";
import { ListType, LIST_TYPES } from "../models/list-type.models";
@Component({
  selector: "app-list-type-picker",
  template: `<fieldset class="type-picker">
    <legend>نوع لیست</legend>
    <div class="type-options">
      @for (option of options; track option.value) {
        <label class="type-option" [class.selected]="value() === option.value"
          ><input
            type="radio"
            name="listType"
            [value]="option.value"
            [checked]="value() === option.value"
            [disabled]="disabled()"
            (change)="valueChange.emit(option.value)"
          /><strong>{{ option.label }}</strong
          ><small>{{ option.description }}</small></label
        >
      }
    </div>
  </fieldset>`,
})
export class ListTypePickerComponent {
  readonly value = input<ListType>("TASK");
  readonly disabled = input(false);
  readonly valueChange = output<ListType>();
  readonly options = LIST_TYPES;
}
