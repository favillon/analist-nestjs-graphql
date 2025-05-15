import { ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql';

import { CurrentUser } from "src/auth/decorations/current-user.decoration";
import { ItemsService } from '../items/items.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ValidRoles } from "src/auth/enums/valid-roles.enum";
import { ValidRolesArgs } from './dto/args/roles.arg';

@Resolver(() => User)
@UseGuards( JwtAuthGuard )
export class UsersResolver {

  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService
  ) {}

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
  @ResolveField( () => Int, {name: 'itemCount'})
  async itemCount (
    @Parent() user: User,
  ) : Promise<number>{
    console.log(user);
    return this.itemsService.itemCountByUser(user);
  }

}
