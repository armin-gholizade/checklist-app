import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { AuthApiService } from "./auth-api.service";
import { SessionState } from "../../../core/session/session-state.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { Credentials } from "../models/auth.models";
@Injectable({ providedIn: "root" })
export class AuthStore {
  private readonly api = inject(AuthApiService);
  readonly session = inject(SessionState);
  private readonly notices = inject(NotificationService);
  async ensureSession() {
    if (this.session.user()) return true;
    try {
      this.session.user.set(await firstValueFrom(this.api.me()));
      return true;
    } catch {
      return false;
    }
  }
  async authenticate(mode: "login" | "register", data: Credentials) {
    const user = await firstValueFrom(this.api[mode](data));
    this.notices.notices.set([]);
    this.session.user.set(user);
  }
  async logout() {
    await firstValueFrom(this.api.logout());
    this.session.user.set(null);
    this.notices.notices.set([]);
  }
}
