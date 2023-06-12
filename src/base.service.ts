import { Injectable } from '@nestjs/common';
import { Model, ModelCtor } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as _ from 'lodash';
import * as moment from 'moment';
import { SERVER_DATE_TIME_FORMAT } from './utils/constants';


const convertLikePattern = (pattern: string, mappedQuery: Map<string, string>) => {
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

const convertGteLtePattern = (pattern: string, mappedQuery: Map<string, string>) => {
  let mappedObject = {}
  const query = mappedQuery.get(pattern)
  mappedObject = {
    ...mappedObject,
    ...(_.map(query, (value, key) => {
      const validate = moment(value, 'YYYY-MM-DDTHH:mm:ss', true).isValid()
      if (!validate) throw new Error('Invalid date format')

      if (pattern === 'gte') {
        return {
          [key]: {
            [Op.gte]: moment(value).format(SERVER_DATE_TIME_FORMAT)
          }
        }
      } else if (pattern === 'lte') {
        return {
          [key]: {
            [Op.lte]: moment(value).format(SERVER_DATE_TIME_FORMAT)
          }
        }
      }
    }))
  }

  const mergedObject = Object.assign({}, ...Object.values(mappedObject))
  return mergedObject
}

@Injectable()
export class BaseService<T extends Model> {
  protected readonly repository: ModelCtor<T>;

  private readonly PATTERN_EQUALS = 'eq';
  private readonly PATTERN_NOT_EQUALS = 'neq';
  private readonly PATTERN_GREATER_THAN = 'gte';
  private readonly PATTERN_LESS_THAN = 'lte';
  private readonly PATTERN_LIKE = 'like';

  constructor(repository: ModelCtor<T>) {
    this.repository = repository;
  }

  async findAll(requestParams: FilterParameter): Promise<T[]> {
    const { limit, skip, query = {} } = requestParams;
    const mappedQuery: Map<string, string> = new Map(Object.entries(query));
    let mappedWhere = {}

    if (mappedQuery.get(this.PATTERN_EQUALS)) {
      mappedWhere = { 
        ...mappedWhere,
        ...({
          [Op.and]: _.map(mappedQuery.get(this.PATTERN_EQUALS), (value, key) => {
            return {
              [key]: value
            }
          })
        })
      }
    }

    if (mappedQuery.get(this.PATTERN_NOT_EQUALS)) {
      mappedWhere = {
        ...mappedWhere,
        ...({
          [Op.not]: _.map(mappedQuery.get(this.PATTERN_NOT_EQUALS), (value, key) => {
            return {
              [key]: value
            }
          })
        })
      }
    }

    if (mappedQuery.get(this.PATTERN_LIKE)) {
      mappedWhere = {
        ...mappedWhere,
        ...convertLikePattern(this.PATTERN_LIKE, mappedQuery)
      }
    }

    if (mappedQuery.get(this.PATTERN_GREATER_THAN)) {
      mappedWhere = {
        ...mappedWhere,
        ...convertGteLtePattern(this.PATTERN_GREATER_THAN, mappedQuery)
      }
    }

    if (mappedQuery.get(this.PATTERN_LESS_THAN)) {
      mappedWhere = {
        ...mappedWhere,
        ...convertGteLtePattern(this.PATTERN_LESS_THAN, mappedQuery)
      }
    }



    return this.repository.findAll({
      limit: limit ?? 10,
      offset: skip ?? 0,
      ...(query
        ? {
            where: {
              ...mappedWhere
            }
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
