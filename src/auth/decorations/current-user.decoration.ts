import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { ValidRoles } from "../enums/valid-roles.enum";
import { User } from "src/users/entities/user.entity";

export const currentUser = createParamDecorator(
    ( roles: ValidRoles[] = [], context:ExecutionContext) =>{
        const ctx= GqlExecutionContext.create(context);
        const user:User = ctx.getContext().req.user

        if (!user)
            throw new InternalServerErrorException('No User inside the request - mke sure that we used the AuthGuard');

        if (roles.length === 0) return user;

        for (const role of roles) {
            if (user.roles.includes(role)) return user;
        }

        throw new ForbiddenException('User does not have the required roles');
})