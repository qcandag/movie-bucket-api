import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import Challange from 'App/Models/Challange'
import Movie from 'App/Models/Movie'

export const ChallangeFactory = Factory.define(Challange, ({ faker }) => {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
  }
}).build()

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    password: 'password123',
  }
})
  .relation('challange', () => ChallangeFactory)
  .build()

export const MovieFactory = Factory.define(Movie, ({ faker }) => {
  return {
    title: faker.lorem.sentence(),
  }
}).build()
