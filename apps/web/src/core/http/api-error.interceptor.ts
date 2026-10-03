import { inject } from "@angular/core";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { SessionState } from "../session/session-state.service";
import { NotificationService } from "../../shared/services/notification.service";
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notices = inject(NotificationService);
  const session = inject(SessionState),
    router = inject(Router);
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      if (e.status === 401 && !req.url.includes("/auth/")) {
        session.user.set(null);
        notices.notices.set([]);
        void router.navigateByUrl("/auth/login");
      }
      const text =
        e.status === 0
          ? "ارتباط با سرور برقرار نشد. دوباره تلاش کن."
          : e.status === 401
            ? "نام کاربری یا رمز درست نیست، یا نشست شما به پایان رسیده."
            : e.status === 409
              ? req.url.includes("/register")
                ? "این نام کاربری قبلاً استفاده شده است."
                : "اطلاعات تغییر کرده یا لیست آرشیو شده است. صفحه را تازه کن و دوباره تلاش کن."
              : e.status === 400
                ? "اطلاعات فرم معتبر نیست؛ عنوان، طول متن و تاریخ را بررسی کن."
                : e.status === 404
                  ? "این مورد پیدا نشد؛ ممکن است حذف شده باشد."
                  : e.status === 429
                    ? "درخواست‌ها زیاد است؛ یک دقیقه دیگر تلاش کن."
                    : "عملیات انجام نشد. دوباره تلاش کن.";
      return throwError(() => new ApiError(text, e.status));
    }),
  );
};
