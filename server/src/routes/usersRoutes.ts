import { Router } from 'express';
import { UsersController } from '../controllers/usersController';

export function createUsersRoutes(usersController: UsersController): Router {
  const router = Router();

  // GET /api/users - получить всех пользователей
  router.get('/', (req, res) => usersController.getAllUsers(req, res));

  // GET /api/users/:id - получить пользователя по ID
  router.get('/:id', (req, res) => usersController.getUserById(req, res));

  // POST /api/users - создать нового пользователя
  router.post('/', (req, res) => usersController.createUser(req, res));

  // PUT /api/users/:id - обновить пользователя
  router.put('/:id', (req, res) => usersController.updateUser(req, res));

  // DELETE /api/users/:id - удалить пользователя
  router.delete('/:id', (req, res) => usersController.deleteUser(req, res));

  return router;
} 