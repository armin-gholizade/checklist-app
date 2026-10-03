import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthStore } from "../data-access/auth.store";
import { AuthFormComponent } from "../components/auth-form.component";
import { Credentials } from "../models/auth.models";
import { HeaderComponent } from "../../../layout/header.component";
import { PageTask } from "../../../shared/utils/page-task";
@Component({
  imports: [AuthFormComponent, HeaderComponent, RouterLink],
  templateUrl: "./auth-page.component.html",
})
export class AuthPageComponent {
  readonly mode = inject(ActivatedRoute).snapshot.data["mode"] as
    "login" | "register";
  readonly task = new PageTask();
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  submit(data: Credentials) {
    return this.task.run(async () => {
      await this.auth.authenticate(this.mode, data);
      await this.router.navigateByUrl("/lists");
    });
  }
}
