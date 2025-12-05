import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center w-full">
        <h1 className="text-xl font-bold text-gray-800">건강검진 결과 조회</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user?.name} 님 안녕하세요! </span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
