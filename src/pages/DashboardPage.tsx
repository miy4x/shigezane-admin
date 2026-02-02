import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { rentalApi, weeklyApi, landApi, houseApi, parkingApi } from '@/lib/api';
import { Building2, Home, LandPlot, ParkingCircle, CalendarClock } from 'lucide-react';

export default function DashboardPage() {
  const { data: rentalUnits } = useQuery({
    queryKey: ['rental-units'],
    queryFn: rentalApi.getAll,
  });

  const { data: weeklyUnits } = useQuery({
    queryKey: ['weekly-units'],
    queryFn: weeklyApi.getAll,
  });

  const { data: landProperties } = useQuery({
    queryKey: ['land-properties'],
    queryFn: landApi.getAll,
  });

  const { data: houseProperties } = useQuery({
    queryKey: ['house-properties'],
    queryFn: houseApi.getAll,
  });

  const { data: parkingSpaces } = useQuery({
    queryKey: ['parking-spaces'],
    queryFn: parkingApi.getAll,
  });

  const rentalCount = rentalUnits?.length || 0;
  const weeklyCount = weeklyUnits?.length || 0;
  const landCount = landProperties?.length || 0;
  const houseCount = houseProperties?.length || 0;
  const parkingCount = parkingSpaces?.length || 0;

  const totalProperties = rentalCount + weeklyCount + landCount + houseCount + parkingCount;

  const availableRental = rentalUnits?.filter((u) => u.status === '募集中').length || 0;
  const availableWeekly = weeklyUnits?.filter((u) => u.status === '募集中').length || 0;
  const availableLand = landProperties?.filter((p) => p.status === '募集中').length || 0;
  const availableHouse = houseProperties?.filter((p) => p.status === '募集中').length || 0;
  const availableParking = parkingSpaces?.filter((p) => p.status === '募集中').length || 0;

  const totalAvailable = availableRental + availableWeekly + availableLand + availableHouse + availableParking;
  const availabilityRate = totalProperties > 0 ? ((totalAvailable / totalProperties) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
        <p className="text-muted-foreground">物件管理の概要</p>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総物件数</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}件</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">募集中</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAvailable}件</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">空室率</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availabilityRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">月間成約数</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3件</div>
            <p className="text-xs text-muted-foreground">仮データ</p>
          </CardContent>
        </Card>
      </div>

      {/* カテゴリー別状況 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" style={{ color: '#5AB9CE' }} />
              <CardTitle>賃貸物件</CardTitle>
            </div>
            <CardDescription>総数: {rentalCount}件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>募集中</span>
                <span className="font-semibold">{availableRental}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>入居中</span>
                <span className="font-semibold">{rentalUnits?.filter((u) => u.status === '入居中').length || 0}件</span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/rental">詳細を見る →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" style={{ color: '#5AB9CE' }} />
              <CardTitle>ウィークリー</CardTitle>
            </div>
            <CardDescription>総数: {weeklyCount}件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>募集中</span>
                <span className="font-semibold">{availableWeekly}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>入居中</span>
                <span className="font-semibold">{weeklyUnits?.filter((u) => u.status === '入居中').length || 0}件</span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/weekly">詳細を見る →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LandPlot className="h-5 w-5" style={{ color: '#5AB9CE' }} />
              <CardTitle>土地</CardTitle>
            </div>
            <CardDescription>総数: {landCount}件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>募集中</span>
                <span className="font-semibold">{availableLand}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>成約済</span>
                <span className="font-semibold">{landProperties?.filter((p) => p.status === '成約済').length || 0}件</span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/land">詳細を見る →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5" style={{ color: '#5AB9CE' }} />
              <CardTitle>住宅</CardTitle>
            </div>
            <CardDescription>総数: {houseCount}件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>募集中</span>
                <span className="font-semibold">{availableHouse}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>成約済</span>
                <span className="font-semibold">{houseProperties?.filter((p) => p.status === '成約済').length || 0}件</span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/house">詳細を見る →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ParkingCircle className="h-5 w-5" style={{ color: '#5AB9CE' }} />
              <CardTitle>駐車場</CardTitle>
            </div>
            <CardDescription>総数: {parkingCount}件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>募集中</span>
                <span className="font-semibold">{availableParking}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>契約中</span>
                <span className="font-semibold">{parkingSpaces?.filter((p) => p.status === '契約中').length || 0}件</span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/parking">詳細を見る →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 最近の活動 */}
      <Card>
        <CardHeader>
          <CardTitle>最近の更新</CardTitle>
          <CardDescription>直近の物件登録・編集履歴</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-muted-foreground">2/2 12:30</span>
              <span>-</span>
              <span>新規物件が登録されました（仮データ）</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-muted-foreground">2/1 15:20</span>
              <span>-</span>
              <span>物件情報が更新されました（仮データ）</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
