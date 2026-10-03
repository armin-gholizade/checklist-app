import { Component, inject, output, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SessionState } from "../core/session/session-state.service";
@Component({
  selector: "app-header",
  imports: [RouterLink],
  template: `<header class="topbar">
    <a class="brand" routerLink="/lists"
      ><span class="brand-mark" aria-hidden="true">✓</span
      ><span>لیست من<small>فضایی برای کارهای تو</small></span></a
    >
    @if (session.user(); as user) {
      <div class="account">
        <span class="avatar">{{ user.username.charAt(0).toUpperCase() }}</span
        ><bdi>{{ user.username }}</bdi
        ><button class="quiet" [disabled]="busy()" (click)="logout.emit()">
          خروج ↗
        </button>
      </div>
    } @else {
      <span class="top-note">کمی نظم، کمی آرامش.</span>
    }
  </header>`,
})
export class HeaderComponent {
  readonly session = inject(SessionState);
  readonly busy = input(false);
  readonly logout = output<void>();
}
