import { useAuthStore } from '@/store/authStore';

export default function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center w-full">
          <h1 className="text-xl font-bold text-gray-800">건강검진 결과 조회</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {user?.name}님, 최근 건강검진 결과입니다
          </h2>
          <div className="text-gray-600 text-center">
            <p>건강검진 결과 내용이 여기에 표시됩니다.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
