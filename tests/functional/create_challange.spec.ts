import { test } from '@japa/runner'
import { UserFactory, ChallangeFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Create challange', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('can create a challange if valid data', async ({ assert, client }) => {
    const data = {
      title: 'Top 5 2023 Movies to watch',
      description: 'A list of 5 movies from 2023 to absolutely watched',
    }

    const user = await UserFactory.create()
    const response = await client
      .post('/api/challanges')
      .guard('api')
      .loginAs(user)
      .form(data)
      .send()

    response.assertStatus(201)
    response.assertBodyContains({
      title: 'Top 5 2023 Movies to watch',
      description: 'A list of 5 movies from 2023 to absolutely watched',
      user_id: user.id,
    })
  })

  test('cannot create a challenge if not authenticated', async ({ assert, client }) => {
    const { title, description } = await ChallangeFactory.create()

    const response = await client.post('/api/challanges').form({ title, description }).send()
    response.assertStatus(401)
    response.assertBodyContains({})
  })

  test('cannot create a challenge if no title', async ({ assert, client }) => {
    const { description } = await ChallangeFactory.create()
    const user = await UserFactory.create()

    const data = {
      description,
    }

    const response = await client
      .post('/api/challanges')
      .guard('api')
      .loginAs(user)
      .form(data)
      .send()

    response.assertStatus(422)
    console.log(response.body())
    response.assertBodyContains({
      errors: [
        {
          rule: 'required',
          field: 'title',
          message: 'required validation failed',
        },
      ],
    })
  })

  test('cannot create a challenge if title and description are not a string', async ({
    assert,
    client,
  }) => {
    const user = await UserFactory.create()

    const data = {
      title: 123,
      description: 123,
    }

    const response = await client
      .post('/api/challanges')
      .guard('api')
      .loginAs(user)
      .json({
        title: 123,
        description: 123,
      })
      .send()

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'string',
          field: 'title',
          message: 'string validation failed',
        },
        {
          rule: 'string',
          field: 'description',
          message: 'string validation failed',
        },
      ],
    })
  })
})
