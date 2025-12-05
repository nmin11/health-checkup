import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "./Header";
import History from "./History";
import type { HealthCheckupData } from "@/types/healthCheckup";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  data: HealthCheckupData;
  onBack: () => void;
}

export default function Dashboard({ data, onBack }: DashboardProps) {
  const [showHistory, setShowHistory] = useState(false);

  const latestCheckup = data.overviewList[data.overviewList.length - 1];

  // 건강 상태 판단 함수
  const getHealthStatus = (
    value: string,
    normalRef: string,
    cautionRef: string
  ): string => {
    if (!value || !normalRef) return "unknown";

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "unknown";

    // 정상 범위 파싱
    if (normalRef.includes("미만")) {
      const threshold = parseFloat(normalRef);
      if (numValue < threshold) return "normal";
    } else if (normalRef.includes("이상")) {
      const threshold = parseFloat(normalRef);
      if (numValue >= threshold) return "normal";
    } else if (normalRef.includes("-")) {
      const [min, max] = normalRef.split("-").map((s) => parseFloat(s));
      if (numValue >= min && numValue <= max) return "normal";
    }

    // 주의 범위 체크
    if (cautionRef && cautionRef.includes("-")) {
      const [min, max] = cautionRef.split("-").map((s) => parseFloat(s));
      if (!isNaN(min) && !isNaN(max) && numValue >= min && numValue <= max)
        return "caution";
    }

    return "danger";
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "caution":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "danger":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "normal":
        return "정상";
      case "caution":
        return "주의";
      case "danger":
        return "위험";
      default:
        return "-";
    }
  };

  // 주요 지표 선택
  const keyMetrics = [
    { label: "BMI", value: latestCheckup.BMI, unit: "kg/m²" },
    { label: "혈압", value: latestCheckup.bloodPressure, unit: "mmHg" },
    {
      label: "공복혈당",
      value: latestCheckup.fastingBloodGlucose,
      unit: "mg/dL",
    },
    {
      label: "총콜레스테롤",
      value: latestCheckup.totalCholesterol,
      unit: "mg/dL",
    },
    { label: "HDL", value: latestCheckup.HDLCholesterol, unit: "mg/dL" },
    { label: "중성지방", value: latestCheckup.triglyceride, unit: "mg/dL" },
  ];

  // Chart.js 데이터
  const chartData = {
    labels: keyMetrics.map((m) => m.label),
    datasets: [
      {
        label: "측정값",
        data: keyMetrics.map((m) => {
          const value = parseFloat(m.value.split("/")[0] || m.value);
          return isNaN(value) ? 0 : value;
        }),
        backgroundColor: keyMetrics.map((m, idx) => {
          const normalRef = data.referenceList[1];
          const cautionRef = data.referenceList[2];

          let refValue = "";
          let cautionValue = "";

          switch (idx) {
            case 0: // BMI
              refValue = normalRef.BMI;
              cautionValue = cautionRef.BMI;
              break;
            case 2: // 공복혈당
              refValue = normalRef.fastingBloodGlucose;
              cautionValue = cautionRef.fastingBloodGlucose;
              break;
            case 3: // 총콜레스테롤
              refValue = normalRef.totalCholesterol;
              cautionValue = cautionRef.totalCholesterol;
              break;
            case 4: // HDL
              refValue = normalRef.HDLCholesterol;
              cautionValue = cautionRef.HDLCholesterol;
              break;
            case 5: // 중성지방
              refValue = normalRef.triglyceride;
              cautionValue = cautionRef.triglyceride;
              break;
          }

          const status = getHealthStatus(m.value, refValue, cautionValue);
          return status === "normal"
            ? "rgba(34, 197, 94, 0.7)"
            : status === "caution"
            ? "rgba(234, 179, 8, 0.7)"
            : "rgba(239, 68, 68, 0.7)";
        }),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "주요 건강 지표",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (showHistory) {
    return <History data={data} onBack={() => setShowHistory(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
            >
              ← 처음으로
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              검진 이력 보기
            </button>
          </div>

          {/* 최근 검진 정보 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              최근 건강검진 결과
            </h2>
            <div className="text-gray-600 mb-4">
              <p>검진일: {latestCheckup.checkupDate}</p>
              <p>
                종합평가:{" "}
                <span className="font-semibold">
                  {latestCheckup.evaluation}
                </span>
              </p>
            </div>

            {/* 차트 */}
            <div className="h-80 mb-6">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* 주요 지표 상세 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {keyMetrics.map((metric, idx) => {
                const normalRef = data.referenceList[1];
                const cautionRef = data.referenceList[2];

                let refValue = "";
                let cautionValue = "";

                switch (idx) {
                  case 0:
                    refValue = normalRef.BMI;
                    cautionValue = cautionRef.BMI;
                    break;
                  case 2:
                    refValue = normalRef.fastingBloodGlucose;
                    cautionValue = cautionRef.fastingBloodGlucose;
                    break;
                  case 3:
                    refValue = normalRef.totalCholesterol;
                    cautionValue = cautionRef.totalCholesterol;
                    break;
                  case 4:
                    refValue = normalRef.HDLCholesterol;
                    cautionValue = cautionRef.HDLCholesterol;
                    break;
                  case 5:
                    refValue = normalRef.triglyceride;
                    cautionValue = cautionRef.triglyceride;
                    break;
                }

                const status = getHealthStatus(
                  metric.value,
                  refValue,
                  cautionValue
                );

                return (
                  <div
                    key={metric.label}
                    className={`p-4 rounded-lg border-2 ${getStatusColor(
                      status
                    )}`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {metric.label}
                    </div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="text-xs text-gray-600">{metric.unit}</div>
                    <div className="mt-2 text-sm font-semibold">
                      {getStatusText(status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 기타 검사 결과 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              기타 검사 결과
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">신장</p>
                <p className="text-lg font-semibold">
                  {latestCheckup.height} cm
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">체중</p>
                <p className="text-lg font-semibold">
                  {latestCheckup.weight} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">허리둘레</p>
                <p className="text-lg font-semibold">
                  {latestCheckup.waist} cm
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">시력</p>
                <p className="text-lg font-semibold">{latestCheckup.vision}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">청력</p>
                <p className="text-lg font-semibold">{latestCheckup.hearing}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">요단백</p>
                <p className="text-lg font-semibold">
                  {latestCheckup.proteinuria}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">흉부X선</p>
                <p className="text-lg font-semibold">
                  {latestCheckup.chestXrayResult}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">혈색소</p>
                <p className="text-lg font-semibold">
                  {latestCheckup.hemoglobin} g/dL
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
