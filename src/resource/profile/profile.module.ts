import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [SequelizeModule.forFeature([Profile])],
  providers: [ProfileResolver, ProfileService]
})
export class ProfileModule {}
