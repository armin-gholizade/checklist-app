import { ListType } from "./list-type.models";
import { ChecklistItem } from "../../items/models/item.models";
export interface ChecklistSummary {
  type: ListType;
  id: string;
  title: string;
  description: string;
  archived: boolean;
  items: { id: string; completed: boolean }[];
}
export interface Checklist extends Omit<ChecklistSummary, "items"> {
  items: ChecklistItem[];
}
export interface ListInput {
  type?: ListType;
  title: string;
  description: string;
}
