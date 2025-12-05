import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "@/components/Dashboard";
import { useAuthStore } from "@/store/authStore";

describe("Dashboard Component", () => {
  beforeEach(() => {
    const { logout, login } = useAuthStore.getState();
    logout();
    login("admin", "1234");
  });

  describe("rendering", () => {
    it("should render dashboard with user name", () => {
      render(<Dashboard />);

      expect(
        screen.getByText("홍길동님, 최근 건강검진 결과입니다")
      ).toBeInTheDocument();
    });

    it("should render header title", () => {
      render(<Dashboard />);

      expect(screen.getByText("건강검진 결과 조회")).toBeInTheDocument();
    });

    it("should render logout button", () => {
      render(<Dashboard />);

      expect(
        screen.getByRole("button", { name: "로그아웃" })
      ).toBeInTheDocument();
    });

    it("should render placeholder content", () => {
      render(<Dashboard />);

      expect(
        screen.getByText("건강검진 결과 내용이 여기에 표시됩니다.")
      ).toBeInTheDocument();
    });
  });

  describe("user display", () => {
    it("should display correct user name for user1", () => {
      const { logout, login } = useAuthStore.getState();
      logout();
      login("user1", "5678");

      render(<Dashboard />);

      expect(
        screen.getByText("이순신님, 최근 건강검진 결과입니다")
      ).toBeInTheDocument();
    });

    it("should display correct user name for user2", () => {
      const { logout, login } = useAuthStore.getState();
      logout();
      login("user2", "2468");

      render(<Dashboard />);

      expect(
        screen.getByText("유관순님, 최근 건강검진 결과입니다")
      ).toBeInTheDocument();
    });
  });

  describe("logout functionality", () => {
    it("should call logout when logout button is clicked", async () => {
      const user = userEvent.setup();
      render(<Dashboard />);

      const logoutButton = screen.getByRole("button", { name: "로그아웃" });

      let state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);

      await user.click(logoutButton);

      await waitFor(() => {
        state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
      });
    });

    it("should logout successfully for different users", async () => {
      const user = userEvent.setup();

      const { logout, login } = useAuthStore.getState();
      logout();
      login("user1", "5678");

      render(<Dashboard />);

      const logoutButton = screen.getByRole("button", { name: "로그아웃" });
      await user.click(logoutButton);

      await waitFor(() => {
        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
      });
    });
  });

  describe("layout", () => {
    it("should have proper layout structure", () => {
      const { container } = render(<Dashboard />);

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();

      const main = container.querySelector("main");
      expect(main).toBeInTheDocument();
    });

    it("should apply correct styling classes", () => {
      const { container } = render(<Dashboard />);

      const mainDiv = container.querySelector(".min-h-screen");
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv).toHaveClass("bg-gray-100");
    });
  });

  describe("edge cases", () => {
    it("should handle missing user gracefully", () => {
      const { logout } = useAuthStore.getState();
      logout();

      render(<Dashboard />);

      expect(
        screen.getByText(/님, 최근 건강검진 결과입니다/)
      ).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have accessible button", () => {
      render(<Dashboard />);

      const logoutButton = screen.getByRole("button", { name: "로그아웃" });
      expect(logoutButton).toBeEnabled();
    });

    it("should have proper heading hierarchy", () => {
      render(<Dashboard />);

      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});
