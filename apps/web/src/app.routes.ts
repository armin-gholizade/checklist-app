import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
export const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/auth.routes").then((m) => m.AUTH_ROUTES),
  },
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./layout/app-shell.component").then((m) => m.AppShellComponent),
    children: [
      {
        path: "lists",
        loadChildren: () =>
          import("./features/checklists/checklists.routes").then(
            (m) => m.CHECKLIST_ROUTES,
          ),
      },
      { path: "", pathMatch: "full", redirectTo: "lists" },
    ],
  },
  { path: "**", redirectTo: "lists" },
];
