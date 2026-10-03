import { Component, inject, signal, computed, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ChecklistsStore } from "../data-access/checklists.store";
import { ChecklistSummary, ListInput } from "../models/checklist.models";
import { ListEditorComponent } from "../components/list-editor.component";
import { ListTableComponent } from "../components/list-table.component";
import { ListStatsComponent } from "../components/list-stats.component";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog.component";
import { FeedbackComponent } from "../../../shared/components/feedback.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state.component";
import { PageTask } from "../../../shared/utils/page-task";
@Component({
  imports: [
    FormsModule,
    ListEditorComponent,
    ListTableComponent,
    ListStatsComponent,
    ConfirmDialogComponent,
    FeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./list-overview.component.html",
})
export class ListOverviewComponent implements OnInit {
  readonly store = inject(ChecklistsStore);
  readonly task = new PageTask();
  private readonly router = inject(Router);
  readonly archived = !!inject(ActivatedRoute).snapshot.data["archived"];
  readonly query = signal("");
  readonly editor = signal<{ list: ChecklistSummary | null } | null>(null);
  readonly deleting = signal<ChecklistSummary | null>(null);
  readonly loaded = signal(false);
  readonly section = computed(() =>
    this.store.lists().filter((l) => l.archived === this.archived),
  );
  readonly visible = computed(() => {
    const q = this.query().trim().toLocaleLowerCase();
    return this.section().filter((l) =>
      (l.title + " " + l.description).toLocaleLowerCase().includes(q),
    );
  });
  ngOnInit() {
    this.load();
  }
  load() {
    return this.task.run(async () => {
      await this.store.load();
      this.loaded.set(true);
    });
  }
  edit(list: ChecklistSummary | null) {
    this.task.error.set("");
    this.editor.set({ list });
  }
  save(input: ListInput) {
    return this.task.run(async () => {
      const list = this.editor()!.list;
      if (list) {
        await this.store.edit(list.id, input);
        this.editor.set(null);
      } else {
        const created = await this.store.create(input);
        this.editor.set(null);
        await this.router.navigate(["/lists", created.id]);
      }
    });
  }
  archive(list: ChecklistSummary) {
    return this.task.run(() => this.store.archive(list));
  }
  remove() {
    return this.task.run(async () => {
      await this.store.remove(this.deleting()!);
      this.deleting.set(null);
    });
  }
}
