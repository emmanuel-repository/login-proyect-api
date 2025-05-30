import sequelize from "../configs/database.config";
import User from "./user.model";
import Session from "./session.model";

const initDataBase = async () => {
  await sequelize.sync({force: true});

  console.info('Database synced');
}

export {sequelize, User, Session, initDataBase}