import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateProfileInput {
  @Field(() => String)
  @IsString()
  first_name: string
}
