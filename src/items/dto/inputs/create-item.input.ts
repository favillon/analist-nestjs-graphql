import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

@InputType()
export class CreateItemInput {

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Float)
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;

  @Field(() => Int)
  @IsPositive()
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantityUnits?: number;
}
