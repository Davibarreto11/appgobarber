import { DataSource } from 'typeorm'

import Appointment from '../../../modules/appointments/infra/typeorm/entities/Appointment'
import User from '../../../modules/users/infra/typeorm/entities/User'
import UserToken from '../../../modules/users/infra/typeorm/entities/UserToken'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'gostack11',
  synchronize: false,
  logging: false,
  entities: [Appointment, User, UserToken],
  migrations: []
})

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })
