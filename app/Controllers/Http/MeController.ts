// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Challange from 'App/Models/Challange'

export default class MeController {
  public async challanges({ auth }) {
    return Challange.query().where('user_id', auth.user.id)
  }
}
