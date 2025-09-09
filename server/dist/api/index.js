"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiServer = createApiServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const usersRoutes_1 = require("../routes/usersRoutes");
const usersController_1 = require("../controllers/usersController");
function createApiServer(usersService) {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Controllers
    const usersController = new usersController_1.UsersController(usersService);
    // Routes
    app.use("/api/users", (0, usersRoutes_1.createUsersRoutes)(usersController));
    // Health check endpoint
    app.get("/api/health", (req, res) => {
        res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
    });
    // 404 handler
    app.use("*", (req, res) => {
        res.status(404).json({
            error: "Not found",
            message: `Route ${req.method} ${req.originalUrl} not found`,
        });
    });
    return app;
}
