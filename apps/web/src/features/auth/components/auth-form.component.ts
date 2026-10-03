import { Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Credentials } from "../models/auth.models";
@Component({
  selector: "app-auth-form",
  imports: [FormsModule],
  templateUrl: "./auth-form.component.html",
})
export class AuthFormComponent {
  readonly mode = input<"login" | "register">("login");
  readonly busy = input(false);
  readonly error = input("");
  readonly submitted = output<Credentials>();
  username = "";
  password = "";
  confirmPassword = "";
  showPassword = false;
  submit() {
    if (
      this.busy() ||
      (this.mode() === "register" && this.password !== this.confirmPassword)
    )
      return;
    this.submitted.emit({
      username: this.username.trim(),
      password: this.password,
    });
  }
}
