import { Component, inject } from "@angular/core";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { HeaderComponent } from "./header.component";
import { AuthStore } from "../features/auth/data-access/auth.store";
import { PageTask } from "../shared/utils/page-task";
import { FeedbackComponent } from "../shared/components/feedback.component";
@Component({
  imports: [
    HeaderComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    FeedbackComponent,
  ],
  template: `<a class="skip-link" href="#main">رفتن به محتوا</a
    ><app-header [busy]="task.busy()" (logout)="logout()" />
    <main id="main">
      <div class="workspace">
        <aside class="sidebar">
          <span class="section-label">فضای کار</span
          ><a
            class="nav-item"
            routerLink="/lists"
            routerLinkActive="selected"
            [routerLinkActiveOptions]="{ exact: true }"
            >☷ لیست‌های من</a
          ><a
            class="nav-item"
            routerLink="/lists/archive"
            routerLinkActive="selected"
            >▤ آرشیو</a
          >
          <div class="sidebar-bottom">
            <strong>هر تیک، یک قدم جلوتر.</strong>
            <p>قدم‌های کوچک هم حساب می‌شوند.</p>
          </div>
        </aside>
        <section class="work-content">
          <nav class="mobile-nav">
            <a routerLink="/lists">لیست‌ها</a
            ><a routerLink="/lists/archive">آرشیو</a>
          </nav>
          <app-feedback [error]="task.error()" /><router-outlet />
        </section>
      </div>
    </main>`,
})
export class AppShellComponent {
  readonly task = new PageTask();
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  logout() {
    return this.task.run(async () => {
      await this.auth.logout();
      await this.router.navigateByUrl("/auth/login");
    });
  }
}
