import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { Profile } from './entities/profile.entity';
import { FilterParameters } from 'src/graphql/filters.graphql';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => Profile)
  createProfile(
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
  ) {
    return this.profileService.create(createProfileInput);
  }

  @Query(() => [Profile], { name: 'getProfiles' })
  findAll(
    @Args('filters', { type: () => FilterParameters, nullable: true })
    allParams: any,
  ) {
    return this.profileService.findAll(allParams);
  }

  @Query(() => Profile)
  findProfileById(@Args('id', { type: () => String }) id: string) {
    return this.profileService.findOne(id);
  }

  @Mutation(() => Profile)
  updateUser(
    @Args('updateProfileInput') UpdateProfileInput: UpdateProfileInput,
  ) {
    return this.profileService.update(
      UpdateProfileInput.id,
      UpdateProfileInput,
    );
  }

  @Mutation(() => Profile)
  remove(@Args('id') id: string) {
    return this.profileService.remove(id);
  }
}
