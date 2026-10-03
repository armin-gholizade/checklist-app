import { Routes } from "@angular/router";
export const AUTH_ROUTES: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./pages/auth-page.component").then((m) => m.AuthPageComponent),
    data: { mode: "login" },
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/auth-page.component").then((m) => m.AuthPageComponent),
    data: { mode: "register" },
  },
  { path: "", pathMatch: "full", redirectTo: "login" },
];
