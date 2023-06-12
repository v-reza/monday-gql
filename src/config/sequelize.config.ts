import { SequelizeOptions } from "sequelize-typescript";

const sequelizeConfig: SequelizeOptions = {
  database: 'vmond',
  username: 'vmond',
  password: '%zP%6Ns!Rem?KRn',
  host: '147.139.182.64',
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  port: 3306,
}

export default sequelizeConfig