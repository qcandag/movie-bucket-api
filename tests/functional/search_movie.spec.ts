import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { MovieFactory } from 'Database/factories'

test.group('Search movie', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('can query for a certain movie title', async ({ assert, client }) => {
    await MovieFactory.merge({ title: 'Joker' }).create()

    const response = await client.get('/api/movies?title=Joker').send()

    response.assertStatus(200)
    response.assertBodyContains([{ title: 'Joker' }])
  })

  test('can query with a subset of the title', async ({ assert, client }) => {
    await MovieFactory.merge({ title: 'Joker' }).create()

    const response = await client.get('/api/movies?title=jok').send()

    response.assertStatus(200)
    response.assertBodyContains([{ title: 'Joker' }])
  })

  test('should throw 400 if no title is pass', async ({ client }) => {
    const response = await client.get('/api/movies').send()

    response.assertStatus(400)
  })
})
