import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterParameters {
  @Field({ defaultValue: 0 })
  skip: number;

  @Field({ defaultValue: 10 })
  limit: number;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
    name: 'query',
    description:
      'Query parameters (allow -> eq, in, like, gte, lte)  "example: { query: { eq: { email: "xxx@gmail.com" } } }"',
  })
  query: unknown;
}
