import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'items'})
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID field item' })
  id: String;

  @Column()
  @Field(() => String, { description: 'name field item' })
  name: string;

  @Column({type: 'float'})
  @Field(() => Float, { description: 'quantity field item' })
  quantity: number;

  @Column({nullable: true})
  @Field(() => Int, { nullable: true, description: 'quantity units field item' })
  quantityUnits?: number;
}
