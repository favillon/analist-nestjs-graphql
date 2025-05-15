import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { CreateItemInput, UpdateItemInput } from './dto/inputs/';
import { CurrentUser } from '../auth/decorations/current-user.decoration';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Item)
@UseGuards( JwtAuthGuard )
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem' })
  async createItem(
    @CurrentUser() user: User,
    @Args('createItemInput') createItemInput: CreateItemInput
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUser() user: User,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user);
  }

  @Query(() => Item, { name: 'item' })
  async findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string
  ): Promise<Item> {
    return this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item)
  async updateItem(
    @CurrentUser() user: User,
    @Args('updateItemInput') updateItemInput: UpdateItemInput
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => Item)
  async removeItem(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string
  ): Promise<Item> {
    return this.itemsService.remove(id, user);
  }
}
