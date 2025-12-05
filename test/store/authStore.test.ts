import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/store/authStore";

describe("authStore", () => {
  beforeEach(() => {
    const { logout } = useAuthStore.getState();
    logout();
  });

  describe("initial state", () => {
    it("should have null user initially", () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });

    it("should not be authenticated initially", () => {
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe("login", () => {
    it("should successfully login with valid credentials", () => {
      const { login } = useAuthStore.getState();

      const success = login("admin", "1234");

      expect(success).toBe(true);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual({
        username: "admin",
        name: "홍길동",
      });
    });

    it("should successfully login user1", () => {
      const { login } = useAuthStore.getState();

      const success = login("user1", "5678");

      expect(success).toBe(true);

      const state = useAuthStore.getState();
      expect(state.user?.name).toBe("이순신");
    });

    it("should successfully login user2", () => {
      const { login } = useAuthStore.getState();

      const success = login("user2", "2468");

      expect(success).toBe(true);

      const state = useAuthStore.getState();
      expect(state.user?.name).toBe("유관순");
    });

    it("should fail login with invalid username", () => {
      const { login } = useAuthStore.getState();

      const success = login("invaliduser", "1234");

      expect(success).toBe(false);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it("should fail login with invalid password", () => {
      const { login } = useAuthStore.getState();

      const success = login("admin", "wrongpassword");

      expect(success).toBe(false);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it("should fail login with empty credentials", () => {
      const { login } = useAuthStore.getState();

      const success = login("", "");

      expect(success).toBe(false);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe("logout", () => {
    it("should logout successfully", () => {
      const { login, logout } = useAuthStore.getState();

      login("admin", "1234");

      let state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).not.toBeNull();

      logout();

      state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it("should be safe to logout when not logged in", () => {
      const { logout } = useAuthStore.getState();

      logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });
});
