import Header from "./Header";

interface VerificationWaitingProps {
  onBack: () => void;
  onVerificationComplete: () => void;
  isLoading?: boolean;
}

export default function VerificationWaiting({
  onBack,
  onVerificationComplete,
  isLoading = false,
}: VerificationWaitingProps) {
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

          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              본인 인증 대기 중
            </h2>

            <div className="text-gray-600 space-y-2">
              <p>휴대폰으로 전송된 인증 요청을 확인해주세요.</p>
              <p className="text-sm">
                인증을 완료하신 후 아래 버튼을 눌러주세요.
              </p>
            </div>

            <button
              onClick={onVerificationComplete}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "조회 중..." : "인증 완료"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
