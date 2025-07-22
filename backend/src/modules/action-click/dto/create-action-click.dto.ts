import { IsUUID } from "class-validator";

export class CreateActionClickDto {
  @IsUUID()
  chosenActionId: string;

  @IsUUID()
  shopId: string;
}
