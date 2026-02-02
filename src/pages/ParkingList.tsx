import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { parkingApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Car } from 'lucide-react';
import { toast } from 'sonner';

export default function ParkingList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: spaces = [], isLoading } = useQuery({
    queryKey: ['parking-spaces'],
    queryFn: parkingApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: parkingApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-spaces'] });
      toast.success('区画を削除しました');
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
  let filteredSpaces = [...spaces];
  if (statusFilter !== 'all') {
    filteredSpaces = filteredSpaces.filter((p) => p.status === statusFilter);
  }

  // ソート
  filteredSpaces.sort((a, b) => {
    if (sortBy === 'price-asc') return a.monthly_fee - b.monthly_fee;
    if (sortBy === 'price-desc') return b.monthly_fee - a.monthly_fee;
    if (sortBy === 'newest') return (b.parking_space_id || 0) - (a.parking_space_id || 0);
    return 0;
  });

  const getStatusBadgeVariant = (status: string) => {
    if (status === '募集中') return 'default';
    if (status === '契約中') return 'secondary';
    return 'outline';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">駐車場管理</h2>
          <p className="text-gray-500 mt-2">全{spaces.length}区画</p>
        </div>
        <Button onClick={() => navigate('/parking/new')}>
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
            <SelectItem value="募集中">募集中</SelectItem>
            <SelectItem value="契約中">契約中</SelectItem>
            <SelectItem value="準備中">準備中</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">新着順</SelectItem>
            <SelectItem value="price-asc">賃料安い順</SelectItem>
            <SelectItem value="price-desc">賃料高い順</SelectItem>
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
                  <TableHead>駐車場名</TableHead>
                  <TableHead>区画番号</TableHead>
                  <TableHead>月額賃料</TableHead>
                  <TableHead>車両サイズ</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpaces.map((space) => (
                  <TableRow key={space.parking_space_id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        {space.parking_lot_name}
                      </div>
                    </TableCell>
                    <TableCell>{space.space_number}</TableCell>
                    <TableCell>¥{space.monthly_fee.toLocaleString()}</TableCell>
                    <TableCell>{space.vehicle_size}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(space.status)}>
                        {space.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/parking/${space.parking_space_id}/edit`)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(space.parking_space_id)}
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
            {filteredSpaces.map((space) => (
              <Card key={space.parking_space_id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="h-5 w-5 text-gray-500" />
                    {space.parking_lot_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                       <span className="text-gray-600">区画 No.</span>
                       <span className="font-bold text-lg">{space.space_number}</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-[#5AB9CE]">
                        月額 ¥{space.monthly_fee.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        サイズ: {space.vehicle_size}
                      </p>
                      <Badge variant={getStatusBadgeVariant(space.status)}>
                        {space.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/parking/${space.parking_space_id}/edit`)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(space.parking_space_id)}
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
