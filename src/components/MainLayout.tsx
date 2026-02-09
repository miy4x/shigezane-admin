import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Building2, Home, LandPlot, ParkingCircle, CalendarClock, LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b sticky top-0 z-[60] h-[57px]">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed left-4 top-2 z-[70] bg-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold ml-12 md:ml-0" style={{ color: '#5AB9CE' }}>
              重実不動産 管理画面
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:inline">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* サイドバー (デスクトップ) */}
        <aside className="hidden md:block w-64 bg-white border-r h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto">
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

        {/* サイドバー (モバイル - オーバーレイ) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
             <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
             <aside className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg animate-in slide-in-from-left">
                <div className="p-4 border-b h-[57px] flex items-center">
                   <span className="font-bold">メニュー</span>
                </div>
                <nav className="p-4 space-y-2">
                  {menuItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
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
          </div>
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 p-4 md:p-6 w-full max-w-[100vw] overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
