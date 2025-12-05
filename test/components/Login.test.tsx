import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "@/components/Login";
import { useAuthStore } from "@/store/authStore";

describe("Login Component", () => {
  beforeEach(() => {
    const { logout } = useAuthStore.getState();
    logout();
  });

  describe("rendering", () => {
    it("should render login form", () => {
      render(<Login />);

      expect(screen.getByText("건강검진 결과 조회")).toBeInTheDocument();
      expect(screen.getByLabelText("아이디")).toBeInTheDocument();
      expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "로그인" })
      ).toBeInTheDocument();
    });

    it("should render test account information", () => {
      render(<Login />);

      expect(screen.getByText("테스트 계정:")).toBeInTheDocument();
      expect(screen.getByText("admin / 1234")).toBeInTheDocument();
      expect(screen.getByText("user1 / 5678")).toBeInTheDocument();
      expect(screen.getByText("user2 / 2468")).toBeInTheDocument();
    });

    it("should render input placeholders", () => {
      render(<Login />);

      expect(
        screen.getByPlaceholderText("아이디를 입력하세요")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("비밀번호를 입력하세요")
      ).toBeInTheDocument();
    });
  });

  describe("user input", () => {
    it("should update username input value", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const usernameInput = screen.getByLabelText("아이디") as HTMLInputElement;

      await user.type(usernameInput, "admin");

      expect(usernameInput.value).toBe("admin");
    });

    it("should update password input value", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const passwordInput = screen.getByLabelText(
        "비밀번호"
      ) as HTMLInputElement;

      await user.type(passwordInput, "1234");

      expect(passwordInput.value).toBe("1234");
    });

    it("should mask password input", () => {
      render(<Login />);

      const passwordInput = screen.getByLabelText(
        "비밀번호"
      ) as HTMLInputElement;

      expect(passwordInput.type).toBe("password");
    });
  });

  describe("form validation", () => {
    it("should show error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const submitButton = screen.getByRole("button", { name: "로그인" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("아이디와 비밀번호를 입력해주세요.")
        ).toBeInTheDocument();
      });
    });

    it("should show error when username is empty", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const passwordInput = screen.getByLabelText("비밀번호");
      await user.type(passwordInput, "1234");

      const submitButton = screen.getByRole("button", { name: "로그인" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("아이디와 비밀번호를 입력해주세요.")
        ).toBeInTheDocument();
      });
    });

    it("should show error when password is empty", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const usernameInput = screen.getByLabelText("아이디");
      await user.type(usernameInput, "admin");

      const submitButton = screen.getByRole("button", { name: "로그인" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("아이디와 비밀번호를 입력해주세요.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("login functionality", () => {
    it("should successfully login with valid credentials", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const usernameInput = screen.getByLabelText("아이디");
      const passwordInput = screen.getByLabelText("비밀번호");
      const submitButton = screen.getByRole("button", { name: "로그인" });

      await user.type(usernameInput, "admin");
      await user.type(passwordInput, "1234");
      await user.click(submitButton);

      await waitFor(() => {
        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.user?.username).toBe("admin");
      });
    });

    it("should show error with invalid credentials", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const usernameInput = screen.getByLabelText("아이디");
      const passwordInput = screen.getByLabelText("비밀번호");
      const submitButton = screen.getByRole("button", { name: "로그인" });

      await user.type(usernameInput, "invaliduser");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("아이디 또는 비밀번호가 올바르지 않습니다.")
        ).toBeInTheDocument();
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });

    it("should show error with wrong password", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const usernameInput = screen.getByLabelText("아이디");
      const passwordInput = screen.getByLabelText("비밀번호");
      const submitButton = screen.getByRole("button", { name: "로그인" });

      await user.type(usernameInput, "admin");
      await user.type(passwordInput, "wrongpassword");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("아이디 또는 비밀번호가 올바르지 않습니다.")
        ).toBeInTheDocument();
      });
    });

    it("should clear error message when typing after error", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const submitButton = screen.getByRole("button", { name: "로그인" });

      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("아이디와 비밀번호를 입력해주세요.")
        ).toBeInTheDocument();
      });

      const usernameInput = screen.getByLabelText("아이디");
      await user.type(usernameInput, "admin");

      expect(
        screen.getByText("아이디와 비밀번호를 입력해주세요.")
      ).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("should submit form on Enter key in username field", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const usernameInput = screen.getByLabelText("아이디");
      const passwordInput = screen.getByLabelText("비밀번호");

      await user.type(usernameInput, "admin");
      await user.type(passwordInput, "1234");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
      });
    });

    it("should submit form on Enter key in password field", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const usernameInput = screen.getByLabelText("아이디");
      const passwordInput = screen.getByLabelText("비밀번호");

      await user.type(usernameInput, "admin");
      await user.type(passwordInput, "1234{Enter}");

      await waitFor(() => {
        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
      });
    });
  });
});
