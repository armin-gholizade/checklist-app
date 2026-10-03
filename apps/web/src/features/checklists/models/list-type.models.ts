export type ListType = "TASK" | "SHOPPING" | "SIMPLE";
export const LIST_TYPE_LABELS: Record<ListType, string> = {
  TASK: "کارها",
  SHOPPING: "خرید",
  SIMPLE: "ساده",
};
export const LIST_TYPES: {
  value: ListType;
  label: string;
  description: string;
}[] = [
  {
    value: "TASK",
    label: "کارها",
    description: "اولویت، موعد انجام و یادداشت",
  },
  {
    value: "SHOPPING",
    label: "خرید",
    description: "تعداد، واحد و قیمت تخمینی",
  },
  { value: "SIMPLE", label: "ساده", description: "فقط عنوان و تیک" },
];
