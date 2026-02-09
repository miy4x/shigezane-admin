import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { rentalApi, buildingApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { RentalSearchForm, type RentalSearchFilters } from '@/components/property/RentalSearchForm';

export default function RentalList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchFilters, setSearchFilters] = useState<RentalSearchFilters>({});

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['rental-units'],
    queryFn: rentalApi.getAll,
  });

  const { data: buildings = [] } = useQuery({
    queryKey: ['buildings'],
    queryFn: buildingApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: rentalApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-units'] });
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

  // フィルタリングとソート
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // 検索フィルター適用
    if (searchFilters.keyword) {
      const keyword = searchFilters.keyword.toLowerCase();
      result = result.filter((p) =>
        p.building_name?.toLowerCase().includes(keyword) ||
        p.building_address?.toLowerCase().includes(keyword) ||
        p.unit_number?.toLowerCase().includes(keyword) ||
        p.remarks?.toLowerCase().includes(keyword)
      );
    }

    if (searchFilters.status) {
      result = result.filter((p) => p.status === searchFilters.status);
    }

    if (searchFilters.minRent) {
      result = result.filter((p) => p.monthly_rent >= searchFilters.minRent!);
    }

    if (searchFilters.maxRent) {
      result = result.filter((p) => p.monthly_rent <= searchFilters.maxRent!);
    }

    if (searchFilters.roomLayout) {
      result = result.filter((p) => p.room_layout === searchFilters.roomLayout);
    }

    if (searchFilters.buildingId) {
      result = result.filter((p) => p.building_id === searchFilters.buildingId);
    }

    if (searchFilters.petsAllowed) {
      result = result.filter((p) => p.pets_allowed === true);
    }

    if (searchFilters.instrumentsAllowed) {
      result = result.filter((p) => p.musical_instruments_allowed === true);
    }

    if (searchFilters.parkingAvailable) {
      result = result.filter((p) => p.parking_available === true);
    }

    // 既存のステータスフィルター
    if (statusFilter !== 'all') {
      result = result.filter((p) => {
        if (statusFilter === 'available') return p.status === '募集中';
        if (statusFilter === 'occupied') return p.status === '入居中';
        if (statusFilter === 'preparing') return p.status === '準備中';
        return true;
      });
    }

    // ソート
    result.sort((a, b) => {
      if (sortBy === 'rent-asc') return a.monthly_rent - b.monthly_rent;
      if (sortBy === 'rent-desc') return b.monthly_rent - a.monthly_rent;
      if (sortBy === 'newest') return (b.unit_id || 0) - (a.unit_id || 0);
      return 0;
    });

    return result;
  }, [properties, searchFilters, statusFilter, sortBy]);

  const getStatusBadgeVariant = (status: string) => {
    if (status === '募集中') return 'default';
    if (status === '入居中') return 'secondary';
    return 'outline';
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">賃貸物件</h2>
          <p className="text-gray-500 mt-2">
            全{properties.length}件 / 表示{filteredProperties.length}件
          </p>
        </div>
        <Button onClick={() => navigate('/rental/new')}>
          <Plus className="mr-2 h-4 w-4" />
          新規登録
        </Button>
      </div>

      {/* 検索フォーム */}
      <RentalSearchForm onFilterChange={setSearchFilters} buildings={buildings} />

      {/* フィルター・ソート */}
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
            <SelectItem value="rent-asc">家賃安い順</SelectItem>
            <SelectItem value="rent-desc">家賃高い順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* タブ切り替え */}
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">リスト表示</TabsTrigger>
          <TabsTrigger value="card">パネル表示</TabsTrigger>
        </TabsList>

        {/* リスト表示 */}
        <TabsContent value="list">
          <Card>
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">画像</TableHead>
                    <TableHead className="min-w-[150px]">建物名</TableHead>
                    <TableHead className="w-[100px]">部屋</TableHead>
                    <TableHead className="w-[100px]">間取り</TableHead>
                    <TableHead className="w-[120px]">家賃</TableHead>
                    <TableHead className="w-[100px]">ステータス</TableHead>
                    <TableHead className="text-right w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow 
                      key={property.unit_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/rental/${property.unit_id}`)}
                    >
                      <TableCell>
                        <img
                          src={property.images?.main || 'https://placehold.co/100'}
                          alt={property.building_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{property.building_name}</TableCell>
                      <TableCell className="whitespace-nowrap">{property.unit_number}</TableCell>
                      <TableCell className="whitespace-nowrap">{property.room_layout}</TableCell>
                      <TableCell className="font-semibold whitespace-nowrap">
                        ¥{property.monthly_rent.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(property.status)} className="whitespace-nowrap">
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/rental/${property.unit_id}/edit`);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(property.unit_id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* パネル表示 */}
        <TabsContent value="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card 
                key={property.unit_id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/rental/${property.unit_id}`)}
              >
                <img
                  src={property.images?.main || 'https://placehold.co/400x300'}
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
                    <p className="text-2xl font-bold text-[#5AB9CE]">
                      ¥{property.monthly_rent.toLocaleString()}/月
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
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/rental/${property.unit_id}/edit`);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(property.unit_id);
                    }}
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
