import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { weeklyApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WeeklyList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['weekly-units'],
    queryFn: weeklyApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: weeklyApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-units'] });
      toast.success('物件を削除しました');
    },
    onError: () => {
      toast.error('削除に失敗しました');
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      deleteMutation.mutate(id);
    }
  };

  // フィルタリング
  let filteredProperties = [...properties];
  if (statusFilter !== 'all') {
    filteredProperties = filteredProperties.filter((p) => {
      if (statusFilter === 'available') return p.status === '募集中';
      if (statusFilter === 'occupied') return p.status === '入居中';
      if (statusFilter === 'preparing') return p.status === '準備中';
      return true;
    });
  }

  // ソート
  filteredProperties.sort((a, b) => {
    if (sortBy === 'rate-asc') return a.daily_rate - b.daily_rate;
    if (sortBy === 'rate-desc') return b.daily_rate - a.daily_rate;
    if (sortBy === 'newest') return (b.weekly_unit_id || 0) - (a.weekly_unit_id || 0);
    return 0;
  });

  const getStatusBadgeVariant = (status: string) => {
    if (status === '募集中') return 'default';
    if (status === '入居中') return 'secondary';
    return 'outline';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ウィークリー物件</h2>
          <p className="text-gray-500 mt-2">全{properties.length}件</p>
        </div>
        <Button onClick={() => navigate('/weekly/new')}>
          <Plus className="mr-2 h-4 w-4" />
          新規登録
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="available">募集中</SelectItem>
            <SelectItem value="occupied">入居中</SelectItem>
            <SelectItem value="preparing">準備中</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">新着順</SelectItem>
            <SelectItem value="rate-asc">賃料安い順</SelectItem>
            <SelectItem value="rate-desc">賃料高い順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">リスト表示</TabsTrigger>
          <TabsTrigger value="card">パネル表示</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>画像</TableHead>
                  <TableHead>建物名</TableHead>
                  <TableHead>部屋</TableHead>
                  <TableHead>間取り</TableHead>
                  <TableHead>日額 / 週額 / 月額</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.weekly_unit_id}>
                    <TableCell>
                      <img
                        src={property.images?.main || 'https://via.placeholder.com/100'}
                        alt={property.building_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{property.building_name}</TableCell>
                    <TableCell>{property.unit_number}</TableCell>
                    <TableCell>{property.room_layout}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>日: ¥{property.daily_rate.toLocaleString()}</div>
                        <div>週: ¥{property.weekly_rate.toLocaleString()}</div>
                        <div>月: ¥{property.monthly_rate.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(property.status)}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/weekly/${property.weekly_unit_id}/edit`)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(property.weekly_unit_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.weekly_unit_id}>
                <img
                  src={property.images?.main || 'https://via.placeholder.com/400x300'}
                  alt={property.building_name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <CardTitle className="text-lg">
                    {property.building_name} {property.unit_number}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {property.floor}階 / {property.room_layout} / {property.area}㎡
                    </p>
                    <p className="text-xl font-bold text-[#5AB9CE]">
                      日額 ¥{property.daily_rate.toLocaleString()}
                    </p>
                    <Badge variant={getStatusBadgeVariant(property.status)}>
                      {property.status}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/weekly/${property.weekly_unit_id}/edit`)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(property.weekly_unit_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
