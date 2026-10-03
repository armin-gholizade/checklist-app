import { Transform } from "class-transformer";
import {
  IsEnum,
  IsString,
  Length,
  IsBoolean,
  ValidateIf,
  MaxLength,
} from "class-validator";
import { ListType } from "@prisma/client";
const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;
export class CreateListDto {
  @ValidateIf((_, v) => v !== undefined) @IsEnum(ListType) type?: ListType;
  @Transform(trim) @IsString() @Length(1, 120) title!: string;
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @MaxLength(2000)
  description?: string;
}
export class UpdateListDto {
  @ValidateIf((_, v) => v !== undefined)
  @Transform(trim)
  @IsString()
  @Length(1, 120)
  title?: string;
  @ValidateIf((_, v) => v !== undefined)
  @IsString()
  @MaxLength(2000)
  description?: string;
  @ValidateIf((_, v) => v !== undefined) @IsBoolean() archived?: boolean;
}
