import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/Header";
import { useAuthStore } from "@/store/authStore";

describe("Header Component", () => {
  beforeEach(() => {
    const { logout } = useAuthStore.getState();
    logout();
  });

  describe("rendering", () => {
    it("should render header title", () => {
      const { login } = useAuthStore.getState();
      login("admin", "1234");

      render(<Header />);

      expect(screen.getByText("건강검진 결과 조회")).toBeInTheDocument();
    });

    it("should render user name when logged in", () => {
      const { login } = useAuthStore.getState();
      login("admin", "1234");

      render(<Header />);

      expect(screen.getByText("홍길동 님 안녕하세요!")).toBeInTheDocument();
    });

    it("should render logout button", () => {
      const { login } = useAuthStore.getState();
      login("admin", "1234");

      render(<Header />);

      expect(
        screen.getByRole("button", { name: "로그아웃" })
      ).toBeInTheDocument();
    });

    it("should render different user name for different user", () => {
      const { login } = useAuthStore.getState();
      login("assignee", "1124");

      render(<Header />);

      expect(screen.getByText("남궁민 님 안녕하세요!")).toBeInTheDocument();
    });
  });

  describe("logout functionality", () => {
    it("should call logout when logout button is clicked", async () => {
      const user = userEvent.setup();
      const { login } = useAuthStore.getState();
      login("admin", "1234");

      render(<Header />);

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
  });

  describe("layout", () => {
    it("should have proper header structure", () => {
      const { login } = useAuthStore.getState();
      login("admin", "1234");

      const { container } = render(<Header />);

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("bg-white", "shadow");
    });

    it("should have proper layout classes", () => {
      const { login } = useAuthStore.getState();
      login("admin", "1234");

      const { container } = render(<Header />);

      const headerContent = container.querySelector(
        ".max-w-4xl.mx-auto.px-4.py-4"
      );
      expect(headerContent).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have accessible logout button", () => {
      const { login } = useAuthStore.getState();
      login("admin", "1234");

      render(<Header />);

      const logoutButton = screen.getByRole("button", { name: "로그아웃" });
      expect(logoutButton).toBeEnabled();
    });

    it("should have proper heading", () => {
      const { login } = useAuthStore.getState();
      login("admin", "1234");

      render(<Header />);

      const heading = screen.getByRole("heading", { name: "건강검진 결과 조회" });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle no user gracefully", () => {
      render(<Header />);

      expect(screen.getByText("건강검진 결과 조회")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
    });
  });
});
