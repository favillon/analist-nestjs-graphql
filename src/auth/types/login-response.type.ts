import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";

@ObjectType()  // Salida de objeto
export class AuthResponseTypes {

    @Field(() => String)
    token: string;

    @Field(() => User)
    user: User
    /*
    signup: {
        accessToken: string;
        refreshToken: string;
    };
    login: {
        accessToken: string;
        refreshToken: string;
    };
    getValidateToken: {
        accessToken: string;
        refreshToken: string;
    };
    */
}