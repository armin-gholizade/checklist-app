import { Transform } from "class-transformer";
import {
  IsNumber,
  Min,
  Max,
  IsString,
  Length,
  IsBoolean,
  ValidateIf,
  MaxLength,
  IsEnum,
  Matches,
  IsISO8601,
  IsArray,
  ArrayUnique,
  IsUUID,
  ArrayMaxSize,
} from "class-validator";
import { Priority } from "@prisma/client";
const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;
export class ItemFieldsDto {
  @ValidateIf((_, v) => v !== undefined)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  @Max(999999999.999)
  quantity?: number;
  @ValidateIf((_, v) => v !== undefined)
  @Transform(trim)
  @IsString()
  @Length(1, 30)
  unit?: string;
  @ValidateIf((_, v) => v !== undefined && v !== null)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  estimatedPrice?: number | null;
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @MaxLength(4000)
  notes?: string;
  @ValidateIf((_, v) => v !== undefined) @IsEnum(Priority) priority?: Priority;
  @ValidateIf((_, v) => v !== undefined && v !== null)
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsISO8601({ strict: true })
  dueDate?: string | null;
}
export class CreateItemDto extends ItemFieldsDto {
  @Transform(trim) @IsString() @Length(1, 240) title!: string;
}
export class UpdateItemDto extends ItemFieldsDto {
  @ValidateIf((_, v) => v !== undefined)
  @Transform(trim)
  @IsString()
  @Length(1, 240)
  title?: string;
  @ValidateIf((_, v) => v !== undefined) @IsBoolean() completed?: boolean;
}
export class ReorderItemsDto {
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(10000)
  @IsUUID("all", { each: true })
  ids!: string[];
}
