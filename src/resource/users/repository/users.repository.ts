import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import { BaseService } from '../../../base.service';

@Injectable()
export class UsersRepository extends BaseService<User> {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
  ) {
    super(userRepository);
  }
}
