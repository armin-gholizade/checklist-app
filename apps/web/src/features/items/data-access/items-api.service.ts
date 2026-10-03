import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ChecklistItem, ItemInput, ItemUpdate } from "../models/item.models";
@Injectable({ providedIn: "root" })
export class ItemsApiService {
  private readonly http = inject(HttpClient);
  private base(listId: string) {
    return "/api/lists/" + listId + "/items";
  }
  create(listId: string, body: ItemInput) {
    return this.http.post<ChecklistItem>(this.base(listId), body);
  }
  update(listId: string, id: string, body: ItemUpdate) {
    return this.http.patch(this.base(listId) + "/" + id, body);
  }
  remove(listId: string, id: string) {
    return this.http.delete(this.base(listId) + "/" + id);
  }
  restore(listId: string, id: string) {
    return this.http.post(this.base(listId) + "/" + id + "/restore", {});
  }
  reorder(listId: string, ids: string[]) {
    return this.http.patch(this.base(listId) + "/reorder", { ids });
  }
}
