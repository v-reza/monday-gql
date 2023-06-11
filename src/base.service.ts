import { Injectable } from '@nestjs/common';
import { Model, ModelCtor } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as _ from 'lodash';


const convertLikePattern = (pattern: any, mappedQuery: Map<string, string>) => {
  let mappedObject = {}
  const likeQuery = mappedQuery.get(pattern);
  mappedObject = {
    ...mappedObject,
    ..._.map(likeQuery, (value, key) => {
      return {
        [key]: {
          [Op.like]: `%${value}%`
        }
      }
    })
  }
  
  const mergedObject = Object.assign({}, ...Object.values(mappedObject))

  return mergedObject
}

@Injectable()
export class BaseService<T extends Model> {
  protected readonly repository: ModelCtor<T>;

  private readonly PATTERN_SKIP = 'skip';
  private readonly PATTERN_LIMIT = 'limit';
  private readonly PATTERN_EQUALS = 'eq';
  private readonly PATTERN_NOT_EQUALS = 'neq';
  private readonly PATTERN_GREATER_THAN = 'gte';
  private readonly PATTERN_LESS_THAN = 'lte';
  private readonly PATTERN_LIKE = 'like';

  constructor(repository: ModelCtor<T>) {
    this.repository = repository;
  }

  async findAll(requestParams: FilterParameter): Promise<T[]> {
    const { limit, skip, query } = requestParams;
    const mappedQuery: Map<string, string> = new Map(Object.entries(query));

    return this.repository.findAll({
      limit: limit ?? 10,
      offset: skip ?? 0,
      ...(query
        ? {
            where: {
              // Equals Method
              ...(mappedQuery.get(this.PATTERN_EQUALS)
                ? {
                    [Op.and]: _.map(
                      mappedQuery.get(this.PATTERN_EQUALS),
                      (value, key) => {
                        return {
                          [key]: value,
                        };
                      },
                    ),
                  }
                : {
                    // Not Equals Method
                    ...(mappedQuery.get(this.PATTERN_NOT_EQUALS)
                      ? {
                          [Op.not]: _.map(
                            mappedQuery.get(this.PATTERN_NOT_EQUALS),
                            (value, key) => {
                              return {
                                [key]: value,
                              };
                            },
                          ),
                        }
                      : {
                          // Like Method
                          ...(mappedQuery.get(this.PATTERN_LIKE)
                            ? {
                                ...convertLikePattern(this.PATTERN_LIKE, mappedQuery)
                              }
                            : {}),
                        }),
                  }),
            },
          }
        : {}),
    });
  }

  async findOne(id: string): Promise<T> {
    return this.repository.findByPk(id);
  }

  async create(data: any): Promise<T> {
    data.created_at = new Date();
    return this.repository.create(data);
  }

  async update(id: string, data: any): Promise<T> {
    data.updated_at = new Date();
    const record = await this.repository.findByPk(id);
    if (!record) throw new Error('Record ID not found');
    return record.update(data);
  }

  async remove(id: string): Promise<T> {
    const record = await this.repository.findByPk(id);
    if (record) await record.destroy();
    else throw new Error('Record ID not found');

    return record;
  }
}
