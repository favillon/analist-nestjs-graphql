import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsModule } from 'src/items/items.module';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    ItemsModule
  ],
  exports: [
    UsersService,
    TypeOrmModule,
  ],
})
export class UsersModule {}
