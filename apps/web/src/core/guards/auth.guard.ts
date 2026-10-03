import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../../features/auth/data-access/auth.store";
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore),
    router = inject(Router);
  return auth
    .ensureSession()
    .then((ok) => ok || router.createUrlTree(["/auth/login"]));
};
