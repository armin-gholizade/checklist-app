import { Routes } from "@angular/router";
export const CHECKLIST_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/list-overview.component").then(
        (m) => m.ListOverviewComponent,
      ),
  },
  {
    path: "archive",
    loadComponent: () =>
      import("./pages/list-overview.component").then(
        (m) => m.ListOverviewComponent,
      ),
    data: { archived: true },
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./pages/list-detail.component").then(
        (m) => m.ListDetailComponent,
      ),
  },
];
