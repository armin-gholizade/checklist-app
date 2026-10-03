import { BadRequestException } from "@nestjs/common";
import { ListType } from "@prisma/client";
import { CreateItemDto, UpdateItemDto } from "./items.dto";
/** Reject hidden fields instead of silently accepting data the UI cannot show. */
export function assertItemFieldsForType(
  type: ListType,
  data: CreateItemDto | UpdateItemDto,
): void {
  const taskFields = ["notes", "priority", "dueDate"] as const;
  const shoppingFields = ["quantity", "unit", "estimatedPrice"] as const;
  const disallowed =
    type === "TASK"
      ? shoppingFields
      : type === "SHOPPING"
        ? taskFields
        : [...taskFields, ...shoppingFields];
  if (disallowed.some((field) => data[field] !== undefined))
    throw new BadRequestException("Fields do not match the checklist type");
}
