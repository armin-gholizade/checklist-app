import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: "fa", standalone: true })
export class PersianNumberPipe implements PipeTransform {
  transform(value: number): string {
    return value.toLocaleString("fa-IR");
  }
}
