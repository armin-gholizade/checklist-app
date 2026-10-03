import { Component, input } from "@angular/core";
@Component({
  selector: "app-empty-state",
  template: `<section class="empty">
    <span class="empty-icon" aria-hidden="true">☷</span>
    <h2>{{ title() }}</h2>
    <p>{{ description() }}</p>
    <ng-content />
  </section>`,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input("");
}
