import { ArrayContainedBy, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SignupInput } from '../auth/dto/inputs/signup.input';
import { User } from './entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {

  private logger: Logger= new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput) : Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll( roles: ValidRoles[]): Promise<User[]> {
    try {
      let users;
      if (roles.length === 0) {
        users =  await this.userRepository.find({
          relations: {
            lastUpdateBy : true
          }
        })
      } else {
        users =  await this.userRepository.findBy({
          roles: ArrayContainedBy(roles),
        })
      }
      return users;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOneById(id:string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({id});
    } catch (error) {
      throw new NotFoundException(`${id} not found`)
    }
  }

  async findOneByEmail(email: string): Promise<User>  {
    try {
      return await this.userRepository.findOneByOrFail({email});
    } catch (error) {
      this.handleDBErrors({
        code: 'error-001',
        detail: `User with email ${email} not found`,
      });
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updatedBy: User
  ): Promise<User>  {
    try {
      const userUpdate = await this.userRepository.preload({
        ...updateUserInput,
        id
      });

      if (!userUpdate) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      userUpdate.lastUpdateBy = updatedBy;

      return await this.userRepository.save(userUpdate);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User>  {
    try {
      const userToBlock = await this.findOneById(id);
      userToBlock.isActive = false;
      userToBlock.lastUpdateBy = adminUser;
      return await this.userRepository.save(userToBlock);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }


  private handleDBErrors(error: any): never {
    console.log(error);

    if (error.code === '23505' || error.code === 'error-001') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error('Error in DB:', error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
