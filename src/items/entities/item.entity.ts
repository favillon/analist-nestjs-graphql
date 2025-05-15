import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

import { User } from '../../users/entities/user.entity';

@Entity({name: 'items'})
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID field item' })
  id: String;

  @Column()
  @Field(() => String, { description: 'name field item' })
  name: string;

  // @Column({type: 'float'})
  // @Field(() => Float, { description: 'quantity field item' })
  // quantity: number;

  @Column({nullable: true})
  @Field(() => Int, { nullable: true, description: 'quantity units field item' })
  quantityUnits?: number;

  // User
  @ManyToOne( () => User, (user ) => user.items, { nullable: false, lazy: true })
  @Index('user_id_index')
  @Field(() => User, { nullable: true, description: 'user id field item' })
  user: User;
}
