import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastOutletComponent } from "./shared/components/toast-outlet.component";
@Component({
  selector: "app-root",
  imports: [RouterOutlet, ToastOutletComponent],
  template: "<router-outlet/><app-toast-outlet/>",
})
export class App {}
