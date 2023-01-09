import { test } from '@japa/runner'
import { ChallangeFactory } from 'Database/factories'

import Database from '@ioc:Adonis/Lucid/Database'
test.group('Get challanges', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('can get all the challanges', async ({ client }) => {
    const challanges = await ChallangeFactory.createMany(3)
    const response = await client.get('/api/challanges').send()

    response.assertStatus(200)
    response.assertBodyContains([
      { title: challanges[0].title },
      { title: challanges[1].title },
      { title: challanges[2].title },
    ])
  })

  test('can get a challenge by id', async ({ client }) => {
    const challanges = await ChallangeFactory.createMany(3)
    const challenge = challanges[0]
    const response = await client.get(`/api/challanges/${challenge.id}`).send()

    response.assertStatus(200)
    response.assertBodyContains({
      title: challenge.title,
      id: challenge.id,
    })
  })

  test('status 404 if id do not exist', async ({ client }) => {
    const response = await client.get('/api/challanges/999').send()
    response.assertStatus(404)
  })
})
