import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Get user challenges', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('can get all the user challenges', async ({ assert, client }) => {
    const user = await UserFactory.with('challange', 2).create()
    const otherUser = await UserFactory.with('challange', 2).create()

    const response = await client.get('/api/me/challanges').guard('api').loginAs(user).send()

    response.assertStatus(200)
    assert.equal(response.body().length, 2)
    response.assertBodyContains([
      { title: user.challange[0].title },
      { title: user.challange[1].title },
    ])
  })
})
