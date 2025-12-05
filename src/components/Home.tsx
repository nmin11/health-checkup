import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import SearchForm from "./SearchForm";
import Header from "./Header";

export default function Home() {
  const { user } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);

  if (showSearch) {
    return <SearchForm onBack={() => setShowSearch(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            반갑습니다, {user?.name} 님!
          </h2>
          <div className="flex justify-center">
            <button
              onClick={() => setShowSearch(true)}
              className="px-8 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              건강검진 조회
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
