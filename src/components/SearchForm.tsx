import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/store/authStore";
import VerificationWaiting from "./VerificationWaiting";
import Header from "./Header";
import Dashboard from "./Dashboard";
import type { HealthCheckupData } from "@/types/healthCheckup";

interface SearchFormProps {
  onBack: () => void;
}

interface MultiFactorInfo {
  transactionId: string;
  jobIndex: number;
  threadIndex: number;
  multiFactorTimestamp: number;
}

interface RequestData {
  id: string;
  loginTypeLevel: string;
  legalName: string;
  birthdate: string;
  phoneNo: string;
  telecom: string;
  startDate: string;
  endDate: string;
  inquiryType: string;
}

export default function SearchForm({ onBack }: SearchFormProps) {
  const { user } = useAuthStore();
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const [birthdate, setBirthdate] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [startDate, setStartDate] = useState(lastYear.toString());
  const [endDate, setEndDate] = useState(currentYear.toString());

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [multiFactorInfo, setMultiFactorInfo] =
    useState<MultiFactorInfo | null>(null);
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [checkupData, setCheckupData] = useState<HealthCheckupData | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!birthdate || !phoneNo) {
      setError("생년월일과 휴대폰 번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_API_KEY;

      const reqData: RequestData = {
        id: `id-${uuidv4()}`,
        loginTypeLevel: "1",
        legalName: user?.name || "",
        birthdate,
        phoneNo,
        telecom: "0",
        startDate,
        endDate,
        inquiryType: "0",
      };

      const response = await fetch(
        "/api/v1/nhis/checkup?response_type=candiy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify(reqData),
        }
      );

      const data = await response.json();

      if (data.status === "success" && data.data) {
        setRequestData(reqData);
        setMultiFactorInfo({
          transactionId: data.data.transactionId,
          jobIndex: data.data.jobIndex,
          threadIndex: data.data.threadIndex,
          multiFactorTimestamp: data.data.multiFactorTimestamp,
        });
        setWaitingForVerification(true);
      } else {
        setError("조회 요청에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = async () => {
    if (!multiFactorInfo || !requestData) {
      setError("인증 정보가 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_API_KEY;

      const response = await fetch(
        "/api/v1/nhis/checkup?response_type=candiy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({
            ...requestData,
            isContinue: "1",
            multiFactorInfo: {
              transactionId: multiFactorInfo.transactionId,
              jobIndex: multiFactorInfo.jobIndex,
              threadIndex: multiFactorInfo.threadIndex,
              multiFactorTimestamp: multiFactorInfo.multiFactorTimestamp,
            },
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success" && data.data) {
        setCheckupData(data.data);
      } else {
        setError("건강검진 결과 조회에 실패했습니다.");
        setWaitingForVerification(false);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("네트워크 오류가 발생했습니다.");
      setWaitingForVerification(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkupData) {
    return (
      <Dashboard
        data={checkupData}
        onBack={() => {
          setCheckupData(null);
          setWaitingForVerification(false);
          setMultiFactorInfo(null);
          setRequestData(null);
        }}
      />
    );
  }

  if (waitingForVerification) {
    return (
      <VerificationWaiting
        onBack={() => {
          setWaitingForVerification(false);
          setMultiFactorInfo(null);
          setRequestData(null);
        }}
        onVerificationComplete={handleVerificationComplete}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 w-96">
          <div className="mb-6">
            <button
              onClick={onBack}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
            >
              ← 돌아가기
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            건강검진 정보 입력
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="birthdate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                생년월일 (YYYYMMDD)
              </label>
              <input
                id="birthdate"
                type="text"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                placeholder="예: 19000101"
                maxLength={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                휴대폰 번호
              </label>
              <input
                id="phoneNo"
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder="예: 01012345678"
                maxLength={11}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  시작 연도
                </label>
                <input
                  id="startDate"
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="예: 2020"
                  maxLength={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  종료 연도
                </label>
                <input
                  id="endDate"
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="예: 2024"
                  maxLength={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "처리 중..." : "조회하기"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
