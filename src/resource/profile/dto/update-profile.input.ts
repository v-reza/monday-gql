import { CreateProfileInput } from './create-profile.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {
  @Field(() => String)
  id: string;
}