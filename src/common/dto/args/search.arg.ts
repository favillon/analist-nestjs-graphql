import { ArgsType, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@ArgsType()
export class SearchArg {
 
    @Field( () => String , {nullable: true, description: "search string"})
    @IsOptional()
    @IsString()
    search?: string
}