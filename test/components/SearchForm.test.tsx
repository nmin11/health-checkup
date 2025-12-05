import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchForm from "@/components/SearchForm";
import { useAuthStore } from "@/store/authStore";

// Mock fetch
globalThis.fetch = vi.fn() as any;

describe("SearchForm Component", () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    (globalThis.fetch as any).mockClear();
    const { logout, login } = useAuthStore.getState();
    logout();
    login("admin", "1234");
  });

  describe("rendering", () => {
    it("should render form title", () => {
      render(<SearchForm onBack={mockOnBack} />);

      expect(screen.getByText("건강검진 정보 입력")).toBeInTheDocument();
    });

    it("should render back button", () => {
      render(<SearchForm onBack={mockOnBack} />);

      expect(
        screen.getByRole("button", { name: "← 돌아가기" })
      ).toBeInTheDocument();
    });

    it("should render birthdate input", () => {
      render(<SearchForm onBack={mockOnBack} />);

      expect(screen.getByLabelText(/생년월일/)).toBeInTheDocument();
    });

    it("should render phone number input", () => {
      render(<SearchForm onBack={mockOnBack} />);

      expect(screen.getByLabelText(/휴대폰 번호/)).toBeInTheDocument();
    });

    it("should render start date input", () => {
      render(<SearchForm onBack={mockOnBack} />);

      expect(screen.getByLabelText(/시작 연도/)).toBeInTheDocument();
    });

    it("should render end date input", () => {
      render(<SearchForm onBack={mockOnBack} />);

      expect(screen.getByLabelText(/종료 연도/)).toBeInTheDocument();
    });

    it("should render submit button", () => {
      render(<SearchForm onBack={mockOnBack} />);

      expect(
        screen.getByRole("button", { name: "조회하기" })
      ).toBeInTheDocument();
    });

    it("should have default year values", () => {
      render(<SearchForm onBack={mockOnBack} />);

      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1;

      const startDateInput = screen.getByLabelText(
        /시작 연도/
      ) as HTMLInputElement;
      const endDateInput = screen.getByLabelText(
        /종료 연도/
      ) as HTMLInputElement;

      expect(startDateInput.value).toBe(lastYear.toString());
      expect(endDateInput.value).toBe(currentYear.toString());
    });
  });

  describe("user input", () => {
    it("should update birthdate input value", async () => {
      const user = userEvent.setup();
      render(<SearchForm onBack={mockOnBack} />);

      const birthdateInput = screen.getByLabelText(
        /생년월일/
      ) as HTMLInputElement;

      await user.type(birthdateInput, "19900101");

      expect(birthdateInput.value).toBe("19900101");
    });

    it("should update phone number input value", async () => {
      const user = userEvent.setup();
      render(<SearchForm onBack={mockOnBack} />);

      const phoneInput = screen.getByLabelText(
        /휴대폰 번호/
      ) as HTMLInputElement;

      await user.type(phoneInput, "01012345678");

      expect(phoneInput.value).toBe("01012345678");
    });

    it("should update start date input value", async () => {
      const user = userEvent.setup();
      render(<SearchForm onBack={mockOnBack} />);

      const startDateInput = screen.getByLabelText(
        /시작 연도/
      ) as HTMLInputElement;

      await user.clear(startDateInput);
      await user.type(startDateInput, "2020");

      expect(startDateInput.value).toBe("2020");
    });

    it("should limit birthdate to 8 characters", () => {
      render(<SearchForm onBack={mockOnBack} />);

      const birthdateInput = screen.getByLabelText(
        /생년월일/
      ) as HTMLInputElement;

      expect(birthdateInput.maxLength).toBe(8);
    });

    it("should limit phone number to 11 characters", () => {
      render(<SearchForm onBack={mockOnBack} />);

      const phoneInput = screen.getByLabelText(
        /휴대폰 번호/
      ) as HTMLInputElement;

      expect(phoneInput.maxLength).toBe(11);
    });
  });

  describe("form validation", () => {
    it("should show error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(<SearchForm onBack={mockOnBack} />);

      const submitButton = screen.getByRole("button", { name: "조회하기" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("생년월일과 휴대폰 번호를 입력해주세요.")
        ).toBeInTheDocument();
      });
    });

    it("should show error when only birthdate is provided", async () => {
      const user = userEvent.setup();
      render(<SearchForm onBack={mockOnBack} />);

      const birthdateInput = screen.getByLabelText(/생년월일/);
      await user.type(birthdateInput, "19900101");

      const submitButton = screen.getByRole("button", { name: "조회하기" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("생년월일과 휴대폰 번호를 입력해주세요.")
        ).toBeInTheDocument();
      });
    });

    it("should show error when only phone number is provided", async () => {
      const user = userEvent.setup();
      render(<SearchForm onBack={mockOnBack} />);

      const phoneInput = screen.getByLabelText(/휴대폰 번호/);
      await user.type(phoneInput, "01012345678");

      const submitButton = screen.getByRole("button", { name: "조회하기" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("생년월일과 휴대폰 번호를 입력해주세요.")
        ).toBeInTheDocument();
      });
    });
  });

  describe("form submission", () => {
    it("should call API when form is submitted with valid data", async () => {
      const user = userEvent.setup();

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          status: "success",
          data: {
            transactionId: "test-transaction",
            jobIndex: 1,
            threadIndex: 1,
            multiFactorTimestamp: Date.now(),
          },
        }),
      });

      render(<SearchForm onBack={mockOnBack} />);

      const birthdateInput = screen.getByLabelText(/생년월일/);
      const phoneInput = screen.getByLabelText(/휴대폰 번호/);

      await user.type(birthdateInput, "19900101");
      await user.type(phoneInput, "01012345678");

      const submitButton = screen.getByRole("button", { name: "조회하기" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith(
          "/api/v1/nhis/checkup?response_type=candiy",
          expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
              "Content-Type": "application/json",
            }),
          })
        );
      });
    });

    it("should show loading state during submission", async () => {
      const user = userEvent.setup();

      (globalThis.fetch as any).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  json: async () => ({
                    status: "success",
                    data: {
                      transactionId: "test",
                      jobIndex: 1,
                      threadIndex: 1,
                      multiFactorTimestamp: Date.now(),
                    },
                  }),
                }),
              100
            )
          )
      );

      render(<SearchForm onBack={mockOnBack} />);

      const birthdateInput = screen.getByLabelText(/생년월일/);
      const phoneInput = screen.getByLabelText(/휴대폰 번호/);

      await user.type(birthdateInput, "19900101");
      await user.type(phoneInput, "01012345678");

      const submitButton = screen.getByRole("button", { name: "조회하기" });
      await user.click(submitButton);

      expect(screen.getByText("처리 중...")).toBeInTheDocument();
    });

    it("should show error message on API failure", async () => {
      const user = userEvent.setup();

      (globalThis.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          status: "error",
        }),
      });

      render(<SearchForm onBack={mockOnBack} />);

      const birthdateInput = screen.getByLabelText(/생년월일/);
      const phoneInput = screen.getByLabelText(/휴대폰 번호/);

      await user.type(birthdateInput, "19900101");
      await user.type(phoneInput, "01012345678");

      const submitButton = screen.getByRole("button", { name: "조회하기" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("조회 요청에 실패했습니다. 다시 시도해주세요.")
        ).toBeInTheDocument();
      });
    });

    it("should show network error message on exception", async () => {
      const user = userEvent.setup();

      // Suppress console.error for this test
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      (globalThis.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      render(<SearchForm onBack={mockOnBack} />);

      const birthdateInput = screen.getByLabelText(/생년월일/);
      const phoneInput = screen.getByLabelText(/휴대폰 번호/);

      await user.type(birthdateInput, "19900101");
      await user.type(phoneInput, "01012345678");

      const submitButton = screen.getByRole("button", { name: "조회하기" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("네트워크 오류가 발생했습니다. 다시 시도해주세요.")
        ).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("interactions", () => {
    it("should call onBack when back button is clicked", async () => {
      const user = userEvent.setup();

      render(<SearchForm onBack={mockOnBack} />);

      const backButton = screen.getByRole("button", { name: "← 돌아가기" });
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it("should disable submit button during loading", async () => {
      const user = userEvent.setup();

      (globalThis.fetch as any).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  json: async () => ({
                    status: "success",
                    data: {
                      transactionId: "test",
                      jobIndex: 1,
                      threadIndex: 1,
                      multiFactorTimestamp: Date.now(),
                    },
                  }),
                }),
              100
            )
          )
      );

      render(<SearchForm onBack={mockOnBack} />);

      const birthdateInput = screen.getByLabelText(/생년월일/);
      const phoneInput = screen.getByLabelText(/휴대폰 번호/);

      await user.type(birthdateInput, "19900101");
      await user.type(phoneInput, "01012345678");

      const submitButton = screen.getByRole("button", { name: "조회하기" });
      await user.click(submitButton);

      const loadingButton = screen.getByRole("button", { name: "처리 중..." });
      expect(loadingButton).toBeDisabled();
    });
  });

  describe("layout", () => {
    it("should have proper layout structure", () => {
      const { container } = render(<SearchForm onBack={mockOnBack} />);

      expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("main")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have accessible form inputs", () => {
      render(<SearchForm onBack={mockOnBack} />);

      expect(screen.getByLabelText(/생년월일/)).toBeInTheDocument();
      expect(screen.getByLabelText(/휴대폰 번호/)).toBeInTheDocument();
      expect(screen.getByLabelText(/시작 연도/)).toBeInTheDocument();
      expect(screen.getByLabelText(/종료 연도/)).toBeInTheDocument();
    });

    it("should have proper heading", () => {
      render(<SearchForm onBack={mockOnBack} />);

      expect(
        screen.getByRole("heading", { name: "건강검진 정보 입력" })
      ).toBeInTheDocument();
    });

    it("should have accessible buttons", () => {
      render(<SearchForm onBack={mockOnBack} />);

      const backButton = screen.getByRole("button", { name: "← 돌아가기" });
      const submitButton = screen.getByRole("button", { name: "조회하기" });

      expect(backButton).toBeEnabled();
      expect(submitButton).toBeEnabled();
    });
  });
});
