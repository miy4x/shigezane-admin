import type { ReactNode } from 'react';
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
import WeeklyList from '@/pages/WeeklyList';
import WeeklyForm from '@/pages/WeeklyForm';
import LandList from '@/pages/LandList';
import LandForm from '@/pages/LandForm';
import HouseList from '@/pages/HouseList';
import HouseForm from '@/pages/HouseForm';
import ParkingList from '@/pages/ParkingList';
import ParkingForm from '@/pages/ParkingForm';

// 認証ガードコンポーネント
function RequireAuth({ children }: { children: ReactNode }) {
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
            
            {/* ウィークリー管理 */}
            <Route path="weekly" element={<WeeklyList />} />
            <Route path="weekly/new" element={<WeeklyForm />} />
            <Route path="weekly/:id/edit" element={<WeeklyForm />} />

            {/* 土地管理 */}
            <Route path="land" element={<LandList />} />
            <Route path="land/new" element={<LandForm />} />
            <Route path="land/:id/edit" element={<LandForm />} />

            {/* 住宅管理 */}
            <Route path="house" element={<HouseList />} />
            <Route path="house/new" element={<HouseForm />} />
            <Route path="house/:id/edit" element={<HouseForm />} />

            {/* 駐車場管理 */}
            <Route path="parking" element={<ParkingList />} />
            <Route path="parking/new" element={<ParkingForm />} />
            <Route path="parking/:id/edit" element={<ParkingForm />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
