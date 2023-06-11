import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Table,
  Model,
  Column,
  DataType,
  Sequelize,
  HasOne,
} from 'sequelize-typescript';

@Table({ tableName: 'vmond_users' })
@ObjectType()
export class User extends Model {
  @Column({
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
  })
  @Field()
  _id: string;

  @Column
  @Field()
  email: string;

  @Column
  @Field()
  password: string;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
  })
  @Field({
    defaultValue: new Date(),
    name: 'created_at',
    nullable: true,
  })
  createdAt: Date;

  @Column({
    field: 'updated_at',
    type: DataType.DATE,
  })
  @Field({
    defaultValue: new Date(),
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @Column
  @Field({ defaultValue: 'system', name: 'created_by', nullable: true })
  created_by: string;

  @Column
  @Field({ defaultValue: 'system', name: 'updated_by', nullable: true })
  updated_by: string;
}
