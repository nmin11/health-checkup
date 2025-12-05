import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "@/components/Dashboard";
import { useAuthStore } from "@/store/authStore";
import type { HealthCheckupData } from "@/types/healthCheckup";

// Mock Chart.js
vi.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="chart">Chart</div>,
}));

vi.mock("chart.js", () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}));

describe("Dashboard Component", () => {
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
    ],
    referenceList: [
      {
        height: "",
        weight: "",
        waist: "",
        BMI: "18.5-24.9",
        vision: "",
        hearing: "",
        bloodPressure: "",
        proteinuria: "",
        hemoglobin: "",
        fastingBloodGlucose: "100미만",
        totalCholesterol: "200미만",
        HDLCholesterol: "60이상",
        triglyceride: "150미만",
        LDLCholesterol: "",
        serumCreatinine: "",
        GFR: "",
        AST: "",
        ALT: "",
        yGPT: "",
        chestXrayResult: "",
        osteoporosis: "",
        refType: "정상",
      },
      {
        height: "",
        weight: "",
        waist: "",
        BMI: "18.5-24.9",
        vision: "",
        hearing: "",
        bloodPressure: "",
        proteinuria: "",
        hemoglobin: "",
        fastingBloodGlucose: "100미만",
        totalCholesterol: "200미만",
        HDLCholesterol: "60이상",
        triglyceride: "150미만",
        LDLCholesterol: "",
        serumCreatinine: "",
        GFR: "",
        AST: "",
        ALT: "",
        yGPT: "",
        chestXrayResult: "",
        osteoporosis: "",
        refType: "정상",
      },
      {
        height: "",
        weight: "",
        waist: "",
        BMI: "25-29.9",
        vision: "",
        hearing: "",
        bloodPressure: "",
        proteinuria: "",
        hemoglobin: "",
        fastingBloodGlucose: "100-125",
        totalCholesterol: "200-239",
        HDLCholesterol: "40-59",
        triglyceride: "150-199",
        LDLCholesterol: "",
        serumCreatinine: "",
        GFR: "",
        AST: "",
        ALT: "",
        yGPT: "",
        chestXrayResult: "",
        osteoporosis: "",
        refType: "주의",
      },
    ],
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
    ],
  };

  beforeEach(() => {
    mockOnBack.mockClear();
    const { logout, login } = useAuthStore.getState();
    logout();
    login("admin", "1234");
  });

  describe("rendering", () => {
    it("should render dashboard title", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("최근 건강검진 결과")).toBeInTheDocument();
    });

    it("should render checkup date", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText(/검진일:/)).toBeInTheDocument();
      expect(screen.getByText(/2024-03-15/)).toBeInTheDocument();
    });

    it("should render evaluation", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText(/종합평가:/)).toBeInTheDocument();
      expect(screen.getByText("정상A")).toBeInTheDocument();
    });

    it("should render chart", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByTestId("chart")).toBeInTheDocument();
    });

    it("should render key metrics", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("BMI")).toBeInTheDocument();
      expect(screen.getByText("혈압")).toBeInTheDocument();
      expect(screen.getByText("공복혈당")).toBeInTheDocument();
      expect(screen.getByText("총콜레스테롤")).toBeInTheDocument();
      expect(screen.getByText("HDL")).toBeInTheDocument();
      expect(screen.getByText("중성지방")).toBeInTheDocument();
    });

    it("should render other test results", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("기타 검사 결과")).toBeInTheDocument();
      expect(screen.getByText("신장")).toBeInTheDocument();
      expect(screen.getByText("체중")).toBeInTheDocument();
      expect(screen.getByText("허리둘레")).toBeInTheDocument();
      expect(screen.getByText("시력")).toBeInTheDocument();
      expect(screen.getByText("청력")).toBeInTheDocument();
    });

    it("should render back button", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("← 처음으로")).toBeInTheDocument();
    });

    it("should render history button", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(
        screen.getByRole("button", { name: "검진 이력 보기" })
      ).toBeInTheDocument();
    });
  });

  describe("key metrics display", () => {
    it("should display BMI value", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("22.9")).toBeInTheDocument();
    });

    it("should display blood pressure value", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("120/80")).toBeInTheDocument();
    });

    it("should display fasting blood glucose", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("95")).toBeInTheDocument();
    });

    it("should display total cholesterol", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("180")).toBeInTheDocument();
    });
  });

  describe("other test results display", () => {
    it("should display height", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText(/175.*cm/)).toBeInTheDocument();
    });

    it("should display weight", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText(/70.*kg/)).toBeInTheDocument();
    });

    it("should display waist", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText(/85.*cm/)).toBeInTheDocument();
    });

    it("should display vision", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(screen.getByText("1.0/1.0")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("should call onBack when back button is clicked", async () => {
      const user = userEvent.setup();

      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      const backButton = screen.getByRole("button", { name: "← 처음으로" });
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it("should show history when history button is clicked", async () => {
      const user = userEvent.setup();

      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      const historyButton = screen.getByRole("button", {
        name: "검진 이력 보기",
      });
      await user.click(historyButton);

      expect(screen.getByText("건강검진 이력")).toBeInTheDocument();
    });
  });

  describe("layout", () => {
    it("should have proper layout structure", () => {
      const { container } = render(
        <Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />
      );

      expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("main")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have accessible buttons", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      const backButton = screen.getByRole("button", { name: "← 처음으로" });
      const historyButton = screen.getByRole("button", {
        name: "검진 이력 보기",
      });

      expect(backButton).toBeEnabled();
      expect(historyButton).toBeEnabled();
    });

    it("should have proper headings", () => {
      render(<Dashboard data={mockHealthCheckupData} onBack={mockOnBack} />);

      expect(
        screen.getByRole("heading", { name: "최근 건강검진 결과" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "기타 검사 결과" })
      ).toBeInTheDocument();
    });
  });
});
