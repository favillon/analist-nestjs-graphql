import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { AuthResponseTypes } from './types/auth-response.type';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginInput } from './dto/inputs/login.input';
import { SignupInput } from './dto/inputs/signup.input';
import { currentUser } from './decorations/current-user.decoration';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';


@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation(() => AuthResponseTypes, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthResponseTypes> {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponseTypes, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponseTypes> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponseTypes, { name: 'getValidateToken' })
  @UseGuards( JwtAuthGuard )
  getValidateToken(
    @currentUser([ ValidRoles.ADMIN]) user: User
  ): AuthResponseTypes {
    //console.log({user});
    return this.authService.getValidateToken(user);
  }
}
