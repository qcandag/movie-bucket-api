import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('challanges', 'ChallangesController.store')
  Route.put('challanges/:id', 'ChallangesController.update')
  Route.delete('challanges/:id', 'ChallangesController.delete')
})
  .prefix('api')
  .middleware('auth')

Route.group(() => {
  Route.get('challanges', 'ChallangesController.all')
  Route.get('challanges/:id', 'ChallangesController.show')
}).prefix('api')

Route.group(() => {
  Route.get('challanges', 'MeController.challanges')
})
  .prefix('api/me')
  .middleware('auth')

Route.group(() => {
  Route.get('/', 'MoviesController.index')
}).prefix('/api/movies')
