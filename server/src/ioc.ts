import { IocContainer } from "@tsoa/runtime";
import { UsersService } from "./services/usersService";
import { GameService } from "./services/gameService";

// IoC контейнер для tsoa
export const iocContainer: IocContainer = {
  get: <T>(controller: new (...args: any[]) => T): T => {
    // Получаем сервисы из глобального состояния или контекста
    // В реальном приложении здесь может быть DI контейнер
    const services = getServicesFromContext();
    
    if (controller.name === "UsersControllerV2") {
      return new controller(services.usersService) as T;
    }
    
    if (controller.name === "GameControllerV2") {
      return new controller(services.gameService) as T;
    }
    
    if (controller.name === "HealthController") {
      return new controller() as T;
    }
    
    throw new Error(`Controller ${controller.name} not registered in IoC container`);
  }
};

// Глобальные сервисы (в реальном приложении лучше использовать DI)
let globalServices: {
  usersService: UsersService;
  gameService: GameService;
} | null = null;

export function setServices(services: { usersService: UsersService; gameService: GameService }) {
  globalServices = services;
}

function getServicesFromContext() {
  if (!globalServices) {
    throw new Error("Services not initialized. Call setServices() first.");
  }
  return globalServices;
}