import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/shared/context/AuthContext";
import { userService } from "@/shared/api/user-service";

// Mock userService
vi.mock("@/shared/api/user-service", () => ({
  userService: {
    getUserById: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Replace global localStorage with our mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

const mockedUserService = vi.mocked(userService);

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
  mockedUserService.getUserById.mockResolvedValue({
    id: "test-user",
    name: "Test User",
  });
});

// Test component that uses the auth context
const TestComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? "authenticated" : "not-authenticated"}
      </div>
      <div data-testid="user-name">{user ? user.name : "no-user"}</div>
      <button
        data-testid="login-btn"
        onClick={() => login({ id: "test-user", name: "Test User" })}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  describe("Initial State", () => {
    it("starts with unauthenticated state when no stored user", () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not-authenticated"
      );
      expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");
    });

    it("loads user from localStorage on mount", async () => {
      const storedUser = {
        id: "stored-user",
        name: "Stored User",
        socketId: "socket-456",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedUser));
      mockedUserService.getUserById.mockResolvedValue(storedUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "authenticated"
        );
        expect(screen.getByTestId("user-name")).toHaveTextContent("Stored User");
      });
    });

    it("handles corrupted localStorage data gracefully", () => {
      localStorageMock.getItem.mockReturnValue("invalid-json");

      expect(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
      }).not.toThrow();

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not-authenticated"
      );
    });
  });

  describe("Login Functionality", () => {
    it("updates state when login is called", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginBtn = screen.getByTestId("login-btn");
      fireEvent.click(loginBtn);

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "authenticated"
        );
        expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
      });
    });

    it("stores user in localStorage after login", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginBtn = screen.getByTestId("login-btn");
      fireEvent.click(loginBtn);

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "user",
          JSON.stringify({
            id: "test-user",
            name: "Test User",
          })
        );
      });
    });

    it("handles login with different user types", async () => {
      const CustomTestComponent = () => {
        const { login, user } = useAuth();

        return (
          <div>
            <button
              data-testid="login-minimal"
              onClick={() => login({ id: "min-user", name: "Min User" } as any)}
            >
              Login Minimal
            </button>
            <div data-testid="user-data">{JSON.stringify(user)}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <CustomTestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByTestId("login-minimal"));

      await waitFor(() => {
        const userData = screen.getByTestId("user-data").textContent;
        expect(userData).toContain("min-user");
        expect(userData).toContain("Min User");
      });
    });
  });

  describe("Logout Functionality", () => {
    it("clears state when logout is called", async () => {
      const existingUser = {
        id: "existing-user",
        name: "Existing User",
        socketId: "socket-789",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingUser));
      mockedUserService.getUserById.mockResolvedValue(existingUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Verify initially authenticated
      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "authenticated"
        );
      });

      // Logout
      const logoutBtn = screen.getByTestId("logout-btn");
      fireEvent.click(logoutBtn);

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "not-authenticated"
        );
        expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");
      });
    });

    it("removes user from localStorage after logout", async () => {
      const existingUser = {
        id: "existing-user",
        name: "Existing User",
        socketId: "socket-789",
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingUser));
      mockedUserService.getUserById.mockResolvedValue(existingUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const logoutBtn = screen.getByTestId("logout-btn");
      fireEvent.click(logoutBtn);

      await waitFor(() => {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
      });
    });

    it("handles logout when not authenticated", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not-authenticated"
      );

      const logoutBtn = screen.getByTestId("logout-btn");

      expect(() => {
        fireEvent.click(logoutBtn);
      }).not.toThrow();

      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not-authenticated"
      );
    });
  });

  describe("Context Provider", () => {
    it("throws error when useAuth is used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow();

      consoleSpy.mockRestore();
    });

    it("provides context to nested components", () => {
      const NestedComponent = () => {
        const { isAuthenticated } = useAuth();
        return (
          <div data-testid="nested-auth">{isAuthenticated ? "yes" : "no"}</div>
        );
      };

      render(
        <AuthProvider>
          <div>
            <TestComponent />
            <NestedComponent />
          </div>
        </AuthProvider>
      );

      expect(screen.getByTestId("nested-auth")).toHaveTextContent("no");

      fireEvent.click(screen.getByTestId("login-btn"));

      expect(screen.getByTestId("nested-auth")).toHaveTextContent("yes");
    });
  });

  describe("State Persistence", () => {
    it("maintains authentication across re-renders", async () => {
      const { rerender } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Login
      fireEvent.click(screen.getByTestId("login-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "authenticated"
        );
      });

      // Re-render
      rerender(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Should still be authenticated due to localStorage
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "authenticated"
      );
    });

    it("handles rapid login/logout sequences", async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginBtn = screen.getByTestId("login-btn");
      const logoutBtn = screen.getByTestId("logout-btn");

      // Rapid sequence
      fireEvent.click(loginBtn);
      fireEvent.click(logoutBtn);
      fireEvent.click(loginBtn);
      fireEvent.click(logoutBtn);

      await waitFor(() => {
        expect(screen.getByTestId("auth-status")).toHaveTextContent(
          "not-authenticated"
        );
      });
    });
  });

  describe("Error Handling", () => {
    it("handles localStorage errors gracefully", () => {
      // Mock localStorage to throw error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Should not crash on login
      expect(() => {
        act(() => {
          fireEvent.click(screen.getByTestId("login-btn"));
        });
      }).not.toThrow();
    });

    it("handles invalid user data in login", async () => {
      const InvalidLoginComponent = () => {
        const { login, isAuthenticated } = useAuth();

        return (
          <div>
            <button
              data-testid="invalid-login"
              onClick={() => login(null as any)}
            >
              Invalid Login
            </button>
            <div data-testid="auth-status">
              {isAuthenticated ? "authenticated" : "not-authenticated"}
            </div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <InvalidLoginComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByTestId("invalid-login"));

      // Should handle gracefully
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not-authenticated"
      );
    });
  });

  describe("User Data Integrity", () => {
    it("preserves user data structure after login", async () => {
      const userData = {
        id: "test-user-123",
        name: "Test User Name",
        socketId: "socket-test-456",
      };

      const DataTestComponent = () => {
        const { login, user } = useAuth();

        return (
          <div>
            <button
              data-testid="login-with-data"
              onClick={() => login(userData)}
            >
              Login
            </button>
            <div data-testid="user-id">{user?.id || "no-id"}</div>
            <div data-testid="user-name">{user?.name || "no-name"}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <DataTestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByTestId("login-with-data"));

      await waitFor(() => {
        expect(screen.getByTestId("user-id")).toHaveTextContent(
          "test-user-123"
        );
        expect(screen.getByTestId("user-name")).toHaveTextContent(
          "Test User Name"
        );
      });
    });
  });
});
