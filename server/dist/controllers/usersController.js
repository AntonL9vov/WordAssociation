"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    // GET /api/users - получить всех пользователей
    async getAllUsers(req, res) {
        try {
            // Пока что возвращаем пустой массив, так как в UsersService нет метода getAllUsers
            // Можно добавить этот метод в UsersService если нужно
            res.status(200).json({ users: [] });
        }
        catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // GET /api/users/:id - получить пользователя по ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = this.usersService.getUser(id);
            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                    message: `User with ID ${id} not found`
                });
                return;
            }
            res.status(200).json({ user });
        }
        catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // POST /api/users - создать нового пользователя
    async createUser(req, res) {
        try {
            const { name } = req.body;
            if (!name || typeof name !== 'string' || name.trim().length === 0) {
                res.status(400).json({
                    error: 'Bad request',
                    message: 'Name is required and must be a non-empty string'
                });
                return;
            }
            const user = this.usersService.addUser(name.trim());
            res.status(201).json({ user });
        }
        catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // PUT /api/users/:id - обновить пользователя
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            if (!name || typeof name !== 'string' || name.trim().length === 0) {
                res.status(400).json({
                    error: 'Bad request',
                    message: 'Name is required and must be a non-empty string'
                });
                return;
            }
            const existingUser = this.usersService.getUser(id);
            if (!existingUser) {
                res.status(404).json({
                    error: 'User not found',
                    message: `User with ID ${id} not found`
                });
                return;
            }
            const updatedUser = this.usersService.updateUser({ id, name: name.trim() });
            res.status(200).json({ user: updatedUser });
        }
        catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // DELETE /api/users/:id - удалить пользователя
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const existingUser = this.usersService.getUser(id);
            if (!existingUser) {
                res.status(404).json({
                    error: 'User not found',
                    message: `User with ID ${id} not found`
                });
                return;
            }
            this.usersService.deleteUser(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.UsersController = UsersController;
