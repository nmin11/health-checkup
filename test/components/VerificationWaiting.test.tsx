import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerificationWaiting from "@/components/VerificationWaiting";

describe("VerificationWaiting Component", () => {
  const mockOnBack = vi.fn();
  const mockOnVerificationComplete = vi.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnVerificationComplete.mockClear();
  });

  describe("rendering", () => {
    it("should render waiting message", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      expect(screen.getByText("본인 인증 대기 중")).toBeInTheDocument();
    });

    it("should render instructions", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      expect(
        screen.getByText("휴대폰으로 전송된 인증 요청을 확인해주세요.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("인증을 완료하신 후 아래 버튼을 눌러주세요.")
      ).toBeInTheDocument();
    });

    it("should render back button", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      expect(
        screen.getByRole("button", { name: "← 돌아가기" })
      ).toBeInTheDocument();
    });

    it("should render verification complete button", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      expect(
        screen.getByRole("button", { name: "인증 완료" })
      ).toBeInTheDocument();
    });

    it("should render loading spinner", () => {
      const { container } = render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("button states", () => {
    it("should show '인증 완료' when not loading", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
          isLoading={false}
        />
      );

      expect(screen.getByText("인증 완료")).toBeInTheDocument();
    });

    it("should show '조회 중...' when loading", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
          isLoading={true}
        />
      );

      expect(screen.getByText("조회 중...")).toBeInTheDocument();
    });

    it("should disable verification button when loading", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
          isLoading={true}
        />
      );

      const button = screen.getByRole("button", { name: "조회 중..." });
      expect(button).toBeDisabled();
    });

    it("should enable verification button when not loading", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
          isLoading={false}
        />
      );

      const button = screen.getByRole("button", { name: "인증 완료" });
      expect(button).toBeEnabled();
    });
  });

  describe("interactions", () => {
    it("should call onBack when back button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      const backButton = screen.getByRole("button", { name: "← 돌아가기" });
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it("should call onVerificationComplete when complete button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
          isLoading={false}
        />
      );

      const completeButton = screen.getByRole("button", { name: "인증 완료" });
      await user.click(completeButton);

      expect(mockOnVerificationComplete).toHaveBeenCalledTimes(1);
    });

    it("should not call callbacks when not clicked", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      expect(mockOnBack).not.toHaveBeenCalled();
      expect(mockOnVerificationComplete).not.toHaveBeenCalled();
    });
  });

  describe("layout", () => {
    it("should have proper layout structure", () => {
      const { container } = render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("main")).toBeInTheDocument();
    });

    it("should apply correct styling classes", () => {
      const { container } = render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      const mainDiv = container.querySelector(".min-h-screen");
      expect(mainDiv).toHaveClass("bg-gray-100", "flex", "flex-col");
    });
  });

  describe("accessibility", () => {
    it("should have accessible buttons", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      const backButton = screen.getByRole("button", { name: "← 돌아가기" });
      const completeButton = screen.getByRole("button", { name: "인증 완료" });

      expect(backButton).toBeEnabled();
      expect(completeButton).toBeEnabled();
    });

    it("should have proper heading", () => {
      render(
        <VerificationWaiting
          onBack={mockOnBack}
          onVerificationComplete={mockOnVerificationComplete}
        />
      );

      const heading = screen.getByRole("heading", { name: "본인 인증 대기 중" });
      expect(heading).toBeInTheDocument();
    });
  });
});
