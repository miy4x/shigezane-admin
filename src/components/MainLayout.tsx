import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Building2, Home, LandPlot, ParkingCircle, CalendarClock, LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'ダッシュボード', path: '/dashboard' },
    { icon: Building2, label: '賃貸物件', path: '/rental' },
    { icon: CalendarClock, label: 'ウィークリー', path: '/weekly' },
    { icon: LandPlot, label: '土地', path: '/land' },
    { icon: Home, label: '住宅', path: '/house' },
    { icon: ParkingCircle, label: '駐車場', path: '/parking' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold" style={{ color: '#5AB9CE' }}>
              重実不動産 管理画面
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー */}
        {sidebarOpen && (
          <aside className="w-64 bg-white border-r min-h-[calc(100vh-57px)] sticky top-[57px]">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </aside>
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
