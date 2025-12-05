import { useAuthStore } from '@/store/authStore';
import Login from '@/components/Login';
import Home from '@/components/Home';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Home /> : <Login />;
}

export default App
