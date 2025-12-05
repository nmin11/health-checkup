import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/components/Home";
import { useAuthStore } from "@/store/authStore";

describe("Home Component", () => {
  beforeEach(() => {
    const { logout, login } = useAuthStore.getState();
    logout();
    login("admin", "1234");
  });

  describe("rendering", () => {
    it("should render home with user name", () => {
      render(<Home />);

      expect(screen.getByText("반갑습니다, 홍길동 님!")).toBeInTheDocument();
    });

    it("should render header title", () => {
      render(<Home />);

      expect(screen.getByText("건강검진 결과 조회")).toBeInTheDocument();
    });

    it("should render logout button", () => {
      render(<Home />);

      expect(
        screen.getByRole("button", { name: "로그아웃" })
      ).toBeInTheDocument();
    });

    it("should render search button", () => {
      render(<Home />);

      expect(
        screen.getByRole("button", { name: "건강검진 조회" })
      ).toBeInTheDocument();
    });
  });

  describe("user display", () => {
    it("should display correct user name for assignee", () => {
      const { logout, login } = useAuthStore.getState();
      logout();
      login("assignee", "1124");

      render(<Home />);

      expect(screen.getByText("반갑습니다, 남궁민 님!")).toBeInTheDocument();
    });

    it("should display correct user name for admin", () => {
      const { logout, login } = useAuthStore.getState();
      logout();
      login("admin", "1234");

      render(<Home />);

      expect(screen.getByText("반갑습니다, 홍길동 님!")).toBeInTheDocument();
    });
  });

  describe("logout functionality", () => {
    it("should call logout when logout button is clicked", async () => {
      const user = userEvent.setup();
      render(<Home />);

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

      render(<Home />);

      const logoutButton = screen.getByRole("button", { name: "로그아웃" });
      await user.click(logoutButton);

      await waitFor(() => {
        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
      });
    });
  });

  describe("navigation", () => {
    it("should show search form when search button is clicked", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const searchButton = screen.getByRole("button", { name: "건강검진 조회" });
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText("건강검진 정보 입력")).toBeInTheDocument();
      });
    });
  });

  describe("layout", () => {
    it("should have proper layout structure", () => {
      const { container } = render(<Home />);

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();

      const main = container.querySelector("main");
      expect(main).toBeInTheDocument();
    });

    it("should apply correct styling classes", () => {
      const { container } = render(<Home />);

      const mainDiv = container.querySelector(".min-h-screen");
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv).toHaveClass("bg-gray-100");
    });
  });

  describe("edge cases", () => {
    it("should handle missing user gracefully", () => {
      const { logout } = useAuthStore.getState();
      logout();

      render(<Home />);

      expect(screen.getByText(/반갑습니다,.*님!/)).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have accessible buttons", () => {
      render(<Home />);

      const logoutButton = screen.getByRole("button", { name: "로그아웃" });
      expect(logoutButton).toBeEnabled();

      const searchButton = screen.getByRole("button", { name: "건강검진 조회" });
      expect(searchButton).toBeEnabled();
    });

    it("should have proper heading hierarchy", () => {
      render(<Home />);

      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);
    });
  });
});
