import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Credentials, Account } from "../models/auth.models";
@Injectable({ providedIn: "root" })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly base = "/api/auth";
  me() {
    return this.http.get<Account>(this.base + "/me");
  }
  login(body: Credentials) {
    return this.http.post<Account>(this.base + "/login", body);
  }
  register(body: Credentials) {
    return this.http.post<Account>(this.base + "/register", body);
  }
  logout() {
    return this.http.post(this.base + "/logout", {});
  }
}
