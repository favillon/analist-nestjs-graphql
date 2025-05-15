import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemInput, UpdateItemInput } from './dto/inputs/';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User) : Promise<Item> {
    const newItem = this.itemRepository.create({
      ...createItemInput,
      user
    });
    return await this.itemRepository.save(newItem);
  }

  async findAll(user: User): Promise<Item[]> {
    return this.itemRepository.find({
      where: {
        user : {
          id : user.id
        }
      }
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({
      id,
      user : {
        id : user.id
      }
    });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOne(id, user)
    const updateItem = await this.itemRepository.preload(updateItemInput);

    if (!updateItem) {
      throw new NotFoundException(`Item with id ${updateItemInput.id} not found`);
    }

    return this.itemRepository.save(updateItem);
  }

  async remove(id: string, user: User): Promise<Item> {
    const deleteItem = await this.findOne(id, user);
    this.itemRepository.remove(deleteItem);
    return deleteItem;
  }

  async itemCountByUser(user: User): Promise<number> {
    return await this.itemRepository.count({
      where : {
        user : {
          id : user.id
        }
      }
    });
  }
}
