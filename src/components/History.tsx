import { useState } from "react";
import Header from "./Header";
import type {
  HealthCheckupData,
  HealthCheckupOverview,
} from "@/types/healthCheckup";

interface HistoryProps {
  data: HealthCheckupData;
  onBack: () => void;
}

export default function History({ data, onBack }: HistoryProps) {
  const [selectedCheckup, setSelectedCheckup] =
    useState<HealthCheckupOverview | null>(null);

  const handleCheckupClick = (checkup: HealthCheckupOverview) => {
    setSelectedCheckup(
      selectedCheckup?.checkupDate === checkup.checkupDate ? null : checkup
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={onBack}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
            >
              ← 대시보드로 돌아가기
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              건강검진 이력
            </h2>

            <div className="space-y-4">
              {data.overviewList.map((checkup, index) => (
                <div
                  key={checkup.checkupDate}
                  className="border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => handleCheckupClick(checkup)}
                    className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-800">
                          {checkup.checkupDate}
                        </span>
                        {index === 0 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            최신
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        종합평가: {checkup.evaluation}
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {selectedCheckup?.checkupDate === checkup.checkupDate
                        ? "▲"
                        : "▼"}
                    </div>
                  </button>

                  {selectedCheckup?.checkupDate === checkup.checkupDate && (
                    <div className="p-4 border-t bg-gray-50">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-700">
                            신체 측정
                          </h4>
                          <div>
                            <p className="text-xs text-gray-600">신장</p>
                            <p className="text-sm font-medium">
                              {checkup.height} cm
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">체중</p>
                            <p className="text-sm font-medium">
                              {checkup.weight} kg
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">허리둘레</p>
                            <p className="text-sm font-medium">
                              {checkup.waist} cm
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">BMI</p>
                            <p className="text-sm font-medium">
                              {checkup.BMI} kg/m²
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-700">
                            혈액 검사
                          </h4>
                          <div>
                            <p className="text-xs text-gray-600">혈압</p>
                            <p className="text-sm font-medium">
                              {checkup.bloodPressure} mmHg
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">공복혈당</p>
                            <p className="text-sm font-medium">
                              {checkup.fastingBloodGlucose} mg/dL
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">
                              총콜레스테롤
                            </p>
                            <p className="text-sm font-medium">
                              {checkup.totalCholesterol || "-"}{" "}
                              {checkup.totalCholesterol && "mg/dL"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">
                              HDL 콜레스테롤
                            </p>
                            <p className="text-sm font-medium">
                              {checkup.HDLCholesterol || "-"}{" "}
                              {checkup.HDLCholesterol && "mg/dL"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">중성지방</p>
                            <p className="text-sm font-medium">
                              {checkup.triglyceride || "-"}{" "}
                              {checkup.triglyceride && "mg/dL"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-700">
                            기타 검사
                          </h4>
                          <div>
                            <p className="text-xs text-gray-600">시력</p>
                            <p className="text-sm font-medium">
                              {checkup.vision}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">청력</p>
                            <p className="text-sm font-medium">
                              {checkup.hearing}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">요단백</p>
                            <p className="text-sm font-medium">
                              {checkup.proteinuria}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">흉부X선</p>
                            <p className="text-sm font-medium">
                              {checkup.chestXrayResult}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 검진 기관 정보 */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          검진 기관:{" "}
                          <span className="font-medium text-gray-800">
                            {data.resultList.find(
                              (r) => r.checkupDate === checkup.checkupDate
                            )?.organizationName || "-"}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {data.overviewList.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                검진 이력이 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
