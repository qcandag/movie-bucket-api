import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory, ChallangeFactory } from 'Database/factories'
import Challange from 'App/Models/Challange'

test.group('Delete user challange', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('a user can delete a challange owned', async ({ client }) => {
    const user = await UserFactory.with('challange', 1).create()
    const response = await client
      .delete(`/api/challanges/${user.challange[0].id}`)
      .guard('api')
      .loginAs(user)

    response.assertStatus(204)
  })

  test('a user cannot delete a challange if not the author', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const otherUser = await UserFactory.with('challange', 1).create()

    const response = await client
      .delete(`/api/challanges/${otherUser.challange[0].id}`)
      .guard('api')
      .loginAs(user)

    response.assertStatus(403)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _challange = await Challange.find(otherUser.challange[0].id)

    assert.isNotNull(_challange)
  })
})
