export type Priority = "LOW" | "NORMAL" | "HIGH";
export type ItemFilter = "all" | "pending" | "completed";
export interface ChecklistItem {
  id: string;
  title: string;
  notes: string;
  quantity: string | null;
  unit: string | null;
  estimatedPrice: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  position: number;
}
export interface ItemInput {
  title: string;
  notes?: string;
  priority?: Priority;
  dueDate?: string | null;
  quantity?: number;
  unit?: string;
  estimatedPrice?: number | null;
}
export type ItemUpdate = Partial<ItemInput> & { completed?: boolean };
export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "کم",
  NORMAL: "معمولی",
  HIGH: "مهم",
};
