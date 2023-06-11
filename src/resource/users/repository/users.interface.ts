import { Model } from "sequelize-typescript";

export interface UsersInterface<T extends Model> {
  currentFunc(): Promise<T[]>
}