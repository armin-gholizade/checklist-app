import { Transform } from "class-transformer";
import {
  IsString,
  Length,
  IsBoolean,
  IsOptional,
  Matches,
} from "class-validator";
export class LoginDto {
  @IsString() @Length(3, 40) @Matches(/^[a-zA-Z0-9_.-]+$/) username!: string;
  @IsString() @Length(8, 128) password!: string;
}
