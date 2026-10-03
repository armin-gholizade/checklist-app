import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Checklist,
  ChecklistSummary,
  ListInput,
} from "../models/checklist.models";
@Injectable({ providedIn: "root" })
export class ListsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = "/api/lists";
  all() {
    return this.http.get<ChecklistSummary[]>(this.base);
  }
  one(id: string) {
    return this.http.get<Checklist>(this.base + "/" + id);
  }
  create(body: ListInput) {
    return this.http.post<Checklist>(this.base, body);
  }
  update(id: string, body: Partial<ListInput> & { archived?: boolean }) {
    return this.http.patch(this.base + "/" + id, body);
  }
  remove(id: string) {
    return this.http.delete(this.base + "/" + id);
  }
  restore(id: string) {
    return this.http.post(this.base + "/" + id + "/restore", {});
  }
}
