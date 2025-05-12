import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Code, Repository } from 'typeorm';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { User } from './entities/user.entity';

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

  async findAll(): Promise<User[]> {
    return [];
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

  block(id: string): Promise<User>  {
    throw new Error('Method not implemented.');
    //return `This action removes a #${id} user`;
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
