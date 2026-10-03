import { Injectable, signal } from "@angular/core";
@Injectable({ providedIn: "root" })
export class SessionState {
  readonly user = signal<{ username: string } | null>(null);
}
