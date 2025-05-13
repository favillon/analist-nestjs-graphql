import { ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { CurrentUser } from "src/auth/decorations/current-user.decoration";
import { ValidRoles } from "src/auth/enums/valid-roles.enum";
import { UpdateUserInput } from "./dto/update-user.input";

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRolesArgs: ValidRolesArgs,
    @CurrentUser([ ValidRoles.ADMIN ]) user: User
  ): Promise<User[]> {
    return this.usersService.findAll(validRolesArgs.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @CurrentUser([ ValidRoles.ADMIN ]) user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ ValidRoles.ADMIN ]) user: User
  ): Promise<User> {
    //console.log({user});
    console.log({updateUserInput});
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, {name: 'blockUser'})
  blockUser(
    @CurrentUser([ ValidRoles.ADMIN ]) user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string
  ): Promise<User> {
    return this.usersService.block(id, user);
  }
}
