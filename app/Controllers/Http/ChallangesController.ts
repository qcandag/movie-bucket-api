// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedException from 'App/Exceptions/UnauthorizedException'
import Challange from 'App/Models/Challange'
import CreateChallengeValidator from 'App/Validators/CreateChallengeValidator'
import UpdateChallangeValidator from 'App/Validators/UpdateChallangeValidator'

export default class ChallangesController {
  public async store({ request, response, auth }) {
    await request.validate(CreateChallengeValidator)

    const user = await auth.user
    const challange = await Challange.create({
      ...request.only(['title', 'description']),
      user_id: user.id,
    })

    response.status(201)
    return response.send({
      title: challange.title,
      description: challange.description,
      user_id: challange.user_id,
    })
  }

  public async all({ response }) {
    const challanges = await Challange.all()

    response.status(200)
    return response.send(challanges)
  }

  public async show({ response, params }) {
    const challange = await Challange.findOrFail(params.id)

    response.status(200)
    return response.send(challange)
  }

  public async update({ response, params, request, auth }) {
    await request.validate(UpdateChallangeValidator)
    const user = await auth.user
    const challange = await Challange.findOrFail(params.id)

    if (challange.user_id !== user.id) {
      const message = 'You are not authorized'
      const status = 403
      const errorCode = 'E_UNAUTHORIZED'

      throw new UnAuthorizedException(message, status, errorCode)
    }

    challange.merge(request.only(['title', 'description']))

    await challange.save()

    response.status(200)

    return challange
  }

  public async delete({ response, params, auth }) {
    const user = await auth.user

    const challange = await Challange.findOrFail(params.id)

    if (challange.user_id !== user.id) {
      const message = 'You are not authorized'
      const status = 403
      const errorCode = 'E_UNAUTHORIZED'

      throw new UnAuthorizedException(message, status, errorCode)
    }

    await challange.delete()

    return response.status(204)
  }
}
