import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'
import Challange from 'App/Models/Challange'

test.group('Update challange', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('a user can update a challenge owned', async ({ client }) => {
    const user = await UserFactory.with('challange', 1).create()
    const challangeId = user.challange[0].id

    const data = {
      title: 'This is my new title',
    }
    const response = await client
      .put(`/api/challanges/${challangeId}`)
      .guard('api')
      .loginAs(user)
      .form(data)
      .send()
    console.log(response.body())
    response.assertStatus(200)
    response.assertBodyContains({
      id: user.challange[0].id,
      title: data.title,
    })
  })

  test('a user cannot update challange if not the author', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const otherUser = await UserFactory.with('challange', 1).create()

    const challangeId = otherUser.challange[0].id
    const data = {
      title: 'This is my new title',
    }

    const response = await client
      .put(`/api/challanges/${challangeId}`)
      .guard('api')
      .loginAs(user)
      .form(data)
      .send()

    console.log(response.body())
    response.assertStatus(403)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _challange = await Challange.find(challangeId)

    assert.notEqual(_challange?.title, data.title)
  })
})
