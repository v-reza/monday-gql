import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from '../entities/profile.entity';
import { BaseService } from 'src/base.service';

@Injectable()
export class ProfileRepository extends BaseService<Profile> {
  constructor(
    @InjectModel(Profile)
    private readonly profileRepository: typeof Profile,
  ) {
    super(profileRepository);
  }
}
