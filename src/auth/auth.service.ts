import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthResponseTypes } from './types/auth-response.type';
import { LoginInput } from './dto/inputs/login.input';
import { SignupInput } from './dto/inputs/signup.input';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
	async signup(signupInput: SignupInput) : Promise<AuthResponseTypes> {
    const user = await this.userService.create(signupInput);
    if (!user)
      throw new Error('Error creating user');

    return {
      token: this.getJwtToken(user),
      user,
	  }
  }

	async login(loginInput: LoginInput) : Promise<AuthResponseTypes> {
    const { email, password } = loginInput;
		const user = await  this.userService.findOneByEmail(email);
    if ( !bcrypt.compareSync(password, user.password) ) {
      throw new Error('Invalid credentials');
    }

		return {
      token: this.getJwtToken(user),
      user,
	  }
	}

  getValidateToken(user:User):AuthResponseTypes {
		const token = this.getJwtToken(user);
		return {
      token,
      user
    };
	}

  private getJwtToken( user:User ): string {
    return this.jwtService.sign({ id: user.id, email: user.email });
  }
}
