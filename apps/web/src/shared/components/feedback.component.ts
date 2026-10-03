import { Component, input } from "@angular/core";
@Component({
  selector: "app-feedback",
  template: `@if (error()) {
      <div class="error" role="alert">{{ error() }}</div>
    }
    @if (loading()) {
      <p class="loading-inline" role="status">
        <span class="spinner"></span> در حال بارگذاری…
      </p>
    }`,
})
export class FeedbackComponent {
  readonly error = input("");
  readonly loading = input(false);
}
