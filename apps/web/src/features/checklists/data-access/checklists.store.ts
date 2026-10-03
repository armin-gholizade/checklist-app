import { Injectable, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ListsApiService } from "./lists-api.service";
import { ChecklistSummary, ListInput } from "../models/checklist.models";
import { NotificationService } from "../../../shared/services/notification.service";
@Injectable({ providedIn: "root" })
export class ChecklistsStore {
  private readonly api = inject(ListsApiService);
  private readonly notices = inject(NotificationService);
  readonly lists = signal<ChecklistSummary[]>([]);
  async load() {
    this.lists.set(await firstValueFrom(this.api.all()));
  }
  create(input: ListInput) {
    return firstValueFrom(this.api.create(input));
  }
  async edit(id: string, input: ListInput) {
    await firstValueFrom(this.api.update(id, input));
    await this.load();
  }
  async archive(list: ChecklistSummary) {
    await firstValueFrom(
      this.api.update(list.id, { archived: !list.archived }),
    );
    await this.load();
    this.notices.show(
      list.archived ? "لیست به بخش فعال برگشت." : "لیست آرشیو شد.",
    );
  }
  async remove(list: ChecklistSummary) {
    await firstValueFrom(this.api.remove(list.id));
    this.lists.update((all) => all.filter((l) => l.id !== list.id));
    this.notices.show("«" + list.title + "» حذف شد.", async () => {
      await firstValueFrom(this.api.restore(list.id));
      await this.load();
    });
  }
}
