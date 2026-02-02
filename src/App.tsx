import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/store/auth';

// Layouts
import MainLayout from '@/components/MainLayout';

// Pages
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import RentalList from '@/pages/RentalList';
import RentalForm from '@/pages/RentalForm';

// 認証ガードコンポーネント
function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* 保護されたルート */}
          <Route path="/" element={<RequireAuth><MainLayout /></RequireAuth>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* 賃貸管理 */}
            <Route path="rental" element={<RentalList />} />
            <Route path="rental/new" element={<RentalForm />} />
            <Route path="rental/:id/edit" element={<RentalForm />} />
            
            {/* 今後実装予定のルート */}
            <Route path="weekly" element={<div className="p-4">ウィークリー管理（準備中）</div>} />
            <Route path="land" element={<div className="p-4">土地管理（準備中）</div>} />
            <Route path="house" element={<div className="p-4">住宅管理（準備中）</div>} />
            <Route path="parking" element={<div className="p-4">駐車場管理（準備中）</div>} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
