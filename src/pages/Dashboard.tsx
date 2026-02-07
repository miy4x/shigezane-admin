import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { rentalApi, weeklyApi, landApi, houseApi, parkingApi } from '@/lib/api';
import { Building2, CalendarClock, LandPlot, Home, ParkingCircle, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  // 並列でデータ取得（パフォーマンス最適化）
  const queries = useQueries({
    queries: [
      {
        queryKey: ['rental-units'],
        queryFn: rentalApi.getAll,
      },
      {
        queryKey: ['weekly-units'],
        queryFn: weeklyApi.getAll,
      },
      {
        queryKey: ['land-properties'],
        queryFn: landApi.getAll,
      },
      {
        queryKey: ['house-properties'],
        queryFn: houseApi.getAll,
      },
      {
        queryKey: ['parking-spaces'],
        queryFn: parkingApi.getAll,
      },
    ],
  });

  const [rentalQuery, weeklyQuery, landQuery, houseQuery, parkingQuery] = queries;
  
  const rentalUnits = rentalQuery.data || [];
  const weeklyUnits = weeklyQuery.data || [];
  const landProperties = landQuery.data || [];
  const houseProperties = houseQuery.data || [];
  const parkingSpaces = parkingQuery.data || [];

  const isLoading = queries.some((query) => query.isLoading);

  const totalProperties = 
    rentalUnits.length + 
    weeklyUnits.length + 
    landProperties.length + 
    houseProperties.length + 
    parkingSpaces.length;

  const vacantRentals = rentalUnits.filter((u) => u.status === '募集中').length;
  const vacantWeekly = weeklyUnits.filter((u) => u.status === '募集中').length;
  const availableLand = landProperties.filter((p) => p.status === '募集中').length;
  const availableHouse = houseProperties.filter((p) => p.status === '募集中').length;
  const availableParking = parkingSpaces.filter((s) => s.status === '募集中').length;

  const totalVacant = vacantRentals + vacantWeekly + availableLand + availableHouse + availableParking;
  const vacancyRate = totalProperties > 0 ? ((totalVacant / totalProperties) * 100).toFixed(1) : '0.0';

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
        <p className="text-gray-500 mt-2">物件管理の概要</p>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">総物件数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProperties}件</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">募集中物件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#5AB9CE]">{totalVacant}件</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">空室率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{vacancyRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">月間成約数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">-件</div>
            <p className="text-xs text-gray-500 mt-1">準備中</p>
          </CardContent>
        </Card>
      </div>

      {/* カテゴリー別状況 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#5AB9CE]" />
              <CardTitle>賃貸物件</CardTitle>
            </div>
            <CardDescription>全{rentalUnits.length}件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>募集中</span>
                <span className="font-semibold text-[#5AB9CE]">{vacantRentals}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>入居中</span>
                <span className="font-semibold">{rentalUnits.filter(u => u.status === '入居中').length}件</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/rental')}
              >
                詳細を見る <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-[#5AB9CE]" />
              <CardTitle>ウィークリー</CardTitle>
            </div>
            <CardDescription>全{weeklyUnits.length}件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>募集中</span>
                <span className="font-semibold text-[#5AB9CE]">{vacantWeekly}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>入居中</span>
                <span className="font-semibold">{weeklyUnits.filter(u => u.status === '入居中').length}件</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/weekly')}
              >
                詳細を見る <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LandPlot className="h-5 w-5 text-[#5AB9CE]" />
              <CardTitle>売買（土地）</CardTitle>
            </div>
            <CardDescription>全{landProperties.length}件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>募集中</span>
                <span className="font-semibold text-[#5AB9CE]">{availableLand}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>成約済</span>
                <span className="font-semibold">{landProperties.filter(p => p.status === '成約済').length}件</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/land')}
              >
                詳細を見る <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-[#5AB9CE]" />
              <CardTitle>売買（住宅）</CardTitle>
            </div>
            <CardDescription>全{houseProperties.length}件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>募集中</span>
                <span className="font-semibold text-[#5AB9CE]">{availableHouse}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>成約済</span>
                <span className="font-semibold">{houseProperties.filter(p => p.status === '成約済').length}件</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/house')}
              >
                詳細を見る <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ParkingCircle className="h-5 w-5 text-[#5AB9CE]" />
              <CardTitle>駐車場</CardTitle>
            </div>
            <CardDescription>全{parkingSpaces.length}件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>募集中</span>
                <span className="font-semibold text-[#5AB9CE]">{availableParking}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>契約中</span>
                <span className="font-semibold">{parkingSpaces.filter(s => s.status === '契約中').length}件</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/parking')}
              >
                詳細を見る <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近の活動 */}
      <Card>
        <CardHeader>
          <CardTitle>最近の更新</CardTitle>
          <CardDescription>直近の物件更新履歴</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">データがありません</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
