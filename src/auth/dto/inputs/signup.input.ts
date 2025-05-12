import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()  // entrada de objeto
export class SignupInput {

  @Field(() => String)
  @IsString()
  fullName: string;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password: string;
}
