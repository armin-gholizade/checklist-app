import { LIST_TYPE_LABELS } from "../models/list-type.models";
import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  DestroyRef,
} from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ListDetailStore } from "../data-access/list-detail.store";
import { ListInput } from "../models/checklist.models";
import {
  ChecklistItem,
  ItemInput,
  ItemUpdate,
  ItemFilter,
} from "../../items/models/item.models";
import { ListEditorComponent } from "../components/list-editor.component";
import { ListProgressComponent } from "../components/list-progress.component";
import { ItemEditorComponent } from "../../items/components/item-editor.component";
import { ItemToolbarComponent } from "../../items/components/item-toolbar.component";
import { ItemListComponent } from "../../items/components/item-list.component";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog.component";
import { FeedbackComponent } from "../../../shared/components/feedback.component";
import { PageTask } from "../../../shared/utils/page-task";
@Component({
  imports: [
    FormsModule,
    RouterLink,
    ListEditorComponent,
    ListProgressComponent,
    ItemEditorComponent,
    ItemToolbarComponent,
    ItemListComponent,
    ConfirmDialogComponent,
    FeedbackComponent,
  ],
  templateUrl: "./list-detail.component.html",
})
export class ListDetailComponent implements OnInit {
  private routeVersion = 0;
  readonly typeLabels = LIST_TYPE_LABELS;
  readonly store = inject(ListDetailStore);
  readonly task = new PageTask();
  private readonly route = inject(ActivatedRoute);
  private readonly destroy = inject(DestroyRef);
  readonly query = signal("");
  readonly filter = signal<ItemFilter>("all");
  readonly listEditing = signal(false);
  readonly itemEditing = signal<{ item: ChecklistItem | null } | null>(null);
  readonly deleting = signal<ChecklistItem | null>(null);
  newTitle = "";
  readonly canReorder = computed(
    () => !this.query().trim() && this.filter() === "all",
  );
  readonly visible = computed(() => {
    const q = this.query().trim().toLocaleLowerCase();
    return (this.store.list()?.items ?? []).filter(
      (i) =>
        (i.title + " " + i.notes).toLocaleLowerCase().includes(q) &&
        (this.filter() === "all" ||
          (this.filter() === "completed" ? i.completed : !i.completed)),
    );
  });
  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((params) => {
        this.store.list.set(null);
        this.query.set("");
        this.filter.set("all");
        void this.loadRoute(params.get("id")!);
      });
  }
  async loadRoute(id: string) {
    const version = ++this.routeVersion;
    this.task.busy.set(true);
    this.task.error.set("");
    try {
      await this.store.load(id);
    } catch (e) {
      if (version === this.routeVersion)
        this.task.error.set(
          e instanceof Error ? e.message : "بارگذاری انجام نشد.",
        );
    } finally {
      if (version === this.routeVersion) this.task.busy.set(false);
    }
  }
  retry() {
    return this.task.run(() =>
      this.store.load(this.route.snapshot.paramMap.get("id")!),
    );
  }
  saveList(data: ListInput) {
    return this.task.run(async () => {
      await this.store.editList(data);
      this.listEditing.set(false);
    });
  }
  archive() {
    return this.task.run(() => this.store.archive());
  }
  quickAdd() {
    return this.task.run(async () => {
      await this.store.add({
        title: this.newTitle.trim(),
      });
      this.newTitle = "";
      setTimeout(() => document.getElementById("quick-add")?.focus());
    });
  }
  saveItem(data: ItemInput) {
    return this.task.run(async () => {
      const item = this.itemEditing()!.item;
      if (item) await this.store.update(item, data);
      else await this.store.add(data);
      this.itemEditing.set(null);
    });
  }
  update(e: { item: ChecklistItem; body: ItemUpdate }) {
    return this.task.run(() => this.store.update(e.item, e.body));
  }
  remove() {
    return this.task.run(async () => {
      await this.store.remove(this.deleting()!);
      this.deleting.set(null);
    });
  }
  reorder(e: { from: number; to: number }) {
    if (!this.canReorder()) return;
    return this.task.run(() => this.store.reorder(e.from, e.to));
  }
}
