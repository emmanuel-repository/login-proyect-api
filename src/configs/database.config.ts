import { Sequelize } from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.mysql.database || '', config.mysql.user || '', config.mysql.password, {
  host: config.mysql.host,
  dialect: 'mysql'
});

export default sequelize;