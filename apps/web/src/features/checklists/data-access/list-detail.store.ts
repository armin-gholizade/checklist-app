import { Injectable, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { moveItemInArray } from "@angular/cdk/drag-drop";
import { ListsApiService } from "./lists-api.service";
import { ItemsApiService } from "../../items/data-access/items-api.service";
import { Checklist, ListInput } from "../models/checklist.models";
import {
  ChecklistItem,
  ItemInput,
  ItemUpdate,
} from "../../items/models/item.models";
import { ChecklistsStore } from "./checklists.store";
import { NotificationService } from "../../../shared/services/notification.service";
@Injectable({ providedIn: "root" })
export class ListDetailStore {
  readonly list = signal<Checklist | null>(null);
  private readonly overview = inject(ChecklistsStore);
  private readonly listsApi = inject(ListsApiService);
  private readonly itemsApi = inject(ItemsApiService);
  private readonly notices = inject(NotificationService);
  private currentId = "";
  async load(id: string) {
    this.currentId = id;
    const list = await firstValueFrom(this.listsApi.one(id));
    if (this.currentId === id) this.list.set(list);
  }
  private id() {
    const id = this.list()?.id;
    if (!id) throw new Error("لیست بارگذاری نشده است.");
    return id;
  }
  async editList(data: ListInput) {
    const id = this.id();
    await firstValueFrom(this.listsApi.update(id, data));
    await this.load(id);
  }
  async archive() {
    const list = this.list()!;
    await firstValueFrom(
      this.listsApi.update(list.id, { archived: !list.archived }),
    );
    await this.load(list.id);
  }
  async add(data: ItemInput) {
    const id = this.id();
    await firstValueFrom(this.itemsApi.create(id, data));
    await this.load(id);
  }
  async update(item: ChecklistItem, data: ItemUpdate) {
    const id = this.id();
    await firstValueFrom(this.itemsApi.update(id, item.id, data));
    await this.load(id);
  }
  async remove(item: ChecklistItem) {
    const id = this.id();
    await firstValueFrom(this.itemsApi.remove(id, item.id));
    this.list.update((l) =>
      l?.id === id
        ? { ...l, items: l.items.filter((i) => i.id !== item.id) }
        : l,
    );
    this.notices.show("«" + item.title + "» حذف شد.", async () => {
      await firstValueFrom(this.itemsApi.restore(id, item.id));
      await this.overview.load();
      if (this.currentId === id) await this.load(id);
    });
  }
  async reorder(from: number, to: number) {
    const list = this.list()!;
    if (
      from < 0 ||
      to < 0 ||
      from >= list.items.length ||
      to >= list.items.length
    )
      return;
    const ordered = [...list.items];
    moveItemInArray(ordered, from, to);
    await firstValueFrom(
      this.itemsApi.reorder(
        list.id,
        ordered.map((i) => i.id),
      ),
    );
    await this.load(list.id);
  }
}
