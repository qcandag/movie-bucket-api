// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Movie from 'App/Models/Movie'

export default class MoviesController {
  public async index({ request, response }) {
    const title = request.input('title')

    if (!title) {
      return response.status(400).json({ error: 'title is required' })
    }
    const movies = await Movie.query().where('title', 'LIKE', `%${title}%`)

    response.status(200)
    return movies
  }
}
