import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './repository/profile.repository';

@Injectable()
export class ProfileService extends ProfileRepository {}
