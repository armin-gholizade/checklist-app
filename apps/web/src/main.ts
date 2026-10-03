import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { App } from "./app";
import { routes } from "./app.routes";
import { apiErrorInterceptor } from "./core/http/api-error.interceptor";
bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptors([apiErrorInterceptor])),
    provideRouter(routes),
  ],
}).catch(console.error);
