import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Email eg: xxx@gmail.com' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Password' })
  @IsString()
  password: string;
}
