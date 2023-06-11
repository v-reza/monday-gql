import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository'
import { User } from './entities/user.entity';
import { UsersInterface } from './repository/users.interface';

@Injectable()
export class UsersService extends UsersRepository implements UsersInterface<User> {
  currentFunc(): Promise<User[]> {
    return this.repository.findAll({
      where: {
        email: "string"
      }
    })
  }
}