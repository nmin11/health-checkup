import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import History from "@/components/History";
import { useAuthStore } from "@/store/authStore";
import type { HealthCheckupData } from "@/types/healthCheckup";

describe("History Component", () => {
  const mockOnBack = vi.fn();

  const mockHealthCheckupData: HealthCheckupData = {
    patientName: "홍길동",
    overviewList: [
      {
        height: "175",
        weight: "70",
        waist: "85",
        BMI: "22.9",
        vision: "1.0/1.0",
        hearing: "정상",
        bloodPressure: "120/80",
        proteinuria: "음성",
        hemoglobin: "15.0",
        fastingBloodGlucose: "95",
        totalCholesterol: "180",
        HDLCholesterol: "55",
        triglyceride: "120",
        LDLCholesterol: "100",
        serumCreatinine: "1.0",
        GFR: "90",
        AST: "25",
        ALT: "20",
        yGPT: "25",
        chestXrayResult: "정상",
        osteoporosis: "정상",
        checkupDate: "2024-03-15",
        evaluation: "정상A",
      },
      {
        height: "174",
        weight: "68",
        waist: "84",
        BMI: "22.5",
        vision: "1.0/1.0",
        hearing: "정상",
        bloodPressure: "118/78",
        proteinuria: "음성",
        hemoglobin: "14.8",
        fastingBloodGlucose: "92",
        totalCholesterol: "175",
        HDLCholesterol: "58",
        triglyceride: "115",
        LDLCholesterol: "95",
        serumCreatinine: "0.9",
        GFR: "92",
        AST: "23",
        ALT: "18",
        yGPT: "23",
        chestXrayResult: "정상",
        osteoporosis: "정상",
        checkupDate: "2023-03-10",
        evaluation: "정상A",
      },
    ],
    referenceList: [],
    resultList: [
      {
        caseType: 1,
        checkupType: "일반검진",
        checkupDate: "2024-03-15",
        organizationName: "서울대학교병원",
        checkupFindings: "정상",
        pdfData: "",
        questionnaire: [],
        infantsCheckupList: [],
        infantsDentalList: [],
      },
      {
        caseType: 1,
        checkupType: "일반검진",
        checkupDate: "2023-03-10",
        organizationName: "연세대학교병원",
        checkupFindings: "정상",
        pdfData: "",
        questionnaire: [],
        infantsCheckupList: [],
        infantsDentalList: [],
      },
    ],
  };

  beforeEach(() => {
    mockOnBack.mockClear();
    const { logout, login } = useAuthStore.getState();
    logout();
    login("admin", "1234");
  });

  describe("rendering", () => {
    it("should render history title", () => {
      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("건강검진 이력")).toBeInTheDocument();
    });

    it("should render back button", () => {
      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(
        screen.getByRole("button", { name: "← 대시보드로 돌아가기" })
      ).toBeInTheDocument();
    });

    it("should render all checkup dates", () => {
      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("2024-03-15")).toBeInTheDocument();
      expect(screen.getByText("2023-03-10")).toBeInTheDocument();
    });

    it("should render latest badge on first checkup", () => {
      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("최신")).toBeInTheDocument();
    });

    it("should render evaluations", () => {
      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      const evaluations = screen.getAllByText(/종합평가: 정상A/);
      expect(evaluations.length).toBeGreaterThan(0);
    });
  });

  describe("checkup expansion", () => {
    it("should expand checkup details when clicked", async () => {
      const user = userEvent.setup();

      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      const buttons = screen.getAllByRole("button");
      const firstCheckupButton = buttons.find((btn) =>
        btn.textContent?.includes("2024-03-15")
      );

      expect(firstCheckupButton).toBeDefined();
      await user.click(firstCheckupButton!);

      await waitFor(
        () => {
          expect(screen.getByText("신체 측정")).toBeInTheDocument();
          expect(screen.getByText("혈액 검사")).toBeInTheDocument();
          expect(screen.getByText("기타 검사")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("should show physical measurements when expanded", async () => {
      const user = userEvent.setup();

      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      const buttons = screen.getAllByRole("button");
      const firstCheckupButton = buttons.find((btn) =>
        btn.textContent?.includes("2024-03-15")
      );

      expect(firstCheckupButton).toBeDefined();
      await user.click(firstCheckupButton!);

      await waitFor(
        () => {
          expect(screen.getByText(/175.*cm/)).toBeInTheDocument();
          expect(screen.getByText(/70.*kg/)).toBeInTheDocument();
          expect(screen.getByText(/85.*cm/)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("should show blood test results when expanded", async () => {
      const user = userEvent.setup();

      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      const buttons = screen.getAllByRole("button");
      const firstCheckupButton = buttons.find((btn) =>
        btn.textContent?.includes("2024-03-15")
      );

      expect(firstCheckupButton).toBeDefined();
      await user.click(firstCheckupButton!);

      await waitFor(
        () => {
          expect(screen.getByText(/120\/80.*mmHg/)).toBeInTheDocument();
          expect(screen.getByText(/95.*mg\/dL/)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("should show organization name when expanded", async () => {
      const user = userEvent.setup();

      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      const buttons = screen.getAllByRole("button");
      const firstCheckupButton = buttons.find((btn) =>
        btn.textContent?.includes("2024-03-15")
      );

      expect(firstCheckupButton).toBeDefined();
      await user.click(firstCheckupButton!);

      await waitFor(
        () => {
          expect(screen.getByText(/검진 기관:/)).toBeInTheDocument();
          expect(screen.getByText("서울대학교병원")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("should collapse checkup when clicked again", async () => {
      const user = userEvent.setup();

      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      const buttons = screen.getAllByRole("button");
      const firstCheckupButton = buttons.find((btn) =>
        btn.textContent?.includes("2024-03-15")
      );

      expect(firstCheckupButton).toBeDefined();

      // Expand
      await user.click(firstCheckupButton!);
      await waitFor(
        () => {
          expect(screen.getByText("신체 측정")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Collapse
      await user.click(firstCheckupButton!);
      await waitFor(
        () => {
          expect(screen.queryByText("신체 측정")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("empty state", () => {
    it("should show empty message when no checkups", () => {
      const emptyData: HealthCheckupData = {
        patientName: "홍길동",
        overviewList: [],
        referenceList: [],
        resultList: [],
      };

      render(<History data={emptyData} onBack={mockOnBack} />);

      expect(screen.getByText("검진 이력이 없습니다.")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("should call onBack when back button is clicked", async () => {
      const user = userEvent.setup();

      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      const backButton = screen.getByRole("button", {
        name: "← 대시보드로 돌아가기",
      });
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it("should expand different checkup when clicked", async () => {
      const user = userEvent.setup();

      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      const buttons = screen.getAllByRole("button");
      const secondCheckupButton = buttons.find((btn) =>
        btn.textContent?.includes("2023-03-10")
      );

      expect(secondCheckupButton).toBeDefined();
      await user.click(secondCheckupButton!);

      await waitFor(
        () => {
          expect(screen.getByText("연세대학교병원")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("layout", () => {
    it("should have proper layout structure", () => {
      const { container } = render(
        <History data={mockHealthCheckupData} onBack={mockOnBack} />
      );

      expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("main")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have accessible back button", () => {
      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      const backButton = screen.getByRole("button", {
        name: "← 대시보드로 돌아가기",
      });
      expect(backButton).toBeEnabled();
    });

    it("should have proper heading", () => {
      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(
        screen.getByRole("heading", { name: "건강검진 이력" })
      ).toBeInTheDocument();
    });

    it("should have accessible checkup buttons", () => {
      render(<History data={mockHealthCheckupData} onBack={mockOnBack} />);

      const buttons = screen.getAllByRole("button");
      buttons.slice(1).forEach((button) => {
        expect(button).toBeEnabled();
      });
    });
  });
});
