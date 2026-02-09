import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { landApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { LandSearchForm, type LandSearchFilters } from '@/components/property/LandSearchForm';

export default function LandList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchFilters, setSearchFilters] = useState<LandSearchFilters>({});

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['land-properties'],
    queryFn: landApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: landApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['land-properties'] });
      toast.success('土地情報を削除しました');
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
        p.address?.toLowerCase().includes(keyword) ||
        p.land_category?.toLowerCase().includes(keyword)
      );
    }

    if (searchFilters.status) {
      result = result.filter((p) => p.status === searchFilters.status);
    }

    if (searchFilters.minPrice) {
      result = result.filter((p) => p.sale_price >= searchFilters.minPrice!);
    }

    if (searchFilters.maxPrice) {
      result = result.filter((p) => p.sale_price <= searchFilters.maxPrice!);
    }

    if (searchFilters.minArea) {
      result = result.filter((p) => p.land_area >= searchFilters.minArea!);
    }

    if (searchFilters.maxArea) {
      result = result.filter((p) => p.land_area <= searchFilters.maxArea!);
    }

    if (searchFilters.zoning) {
      result = result.filter((p) => p.zoning === searchFilters.zoning);
    }

    // 既存のステータスフィルター
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // ソート
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.sale_price - b.sale_price;
      if (sortBy === 'price-desc') return b.sale_price - a.sale_price;
      if (sortBy === 'area-desc') return b.land_area - a.land_area;
      if (sortBy === 'newest') return (b.land_id || 0) - (a.land_id || 0);
      return 0;
    });

    return result;
  }, [properties, searchFilters, statusFilter, sortBy]);

  const getStatusBadgeVariant = (status: string) => {
    if (status === '募集中') return 'default';
    if (status === '成約済') return 'secondary';
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">土地管理</h2>
          <p className="text-gray-500 mt-2">
            全{properties.length}件 / 表示{filteredProperties.length}件
          </p>
        </div>
        <Button onClick={() => navigate('/land/new')}>
          <Plus className="mr-2 h-4 w-4" />
          新規登録
        </Button>
      </div>

      {/* 検索フォーム */}
      <LandSearchForm onFilterChange={setSearchFilters} />

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="募集中">募集中</SelectItem>
            <SelectItem value="成約済">成約済</SelectItem>
            <SelectItem value="準備中">準備中</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">新着順</SelectItem>
            <SelectItem value="price-asc">価格安い順</SelectItem>
            <SelectItem value="price-desc">価格高い順</SelectItem>
            <SelectItem value="area-desc">面積広い順</SelectItem>
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
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">画像</TableHead>
                    <TableHead className="min-w-[150px]">住所</TableHead>
                    <TableHead className="w-[100px]">価格</TableHead>
                    <TableHead className="w-[120px]">土地面積</TableHead>
                    <TableHead className="w-[120px]">用途地域</TableHead>
                    <TableHead className="w-[100px]">ステータス</TableHead>
                    <TableHead className="text-right w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow 
                      key={property.land_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/land/${property.land_id}`)}
                    >
                      <TableCell>
                        <img
                          src={property.images?.main || 'https://placehold.co/100'}
                          alt={property.address}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{property.address}</TableCell>
                      <TableCell className="whitespace-nowrap">¥{(property.sale_price / 10000).toLocaleString()}万円</TableCell>
                      <TableCell className="whitespace-nowrap">{property.land_area}㎡ ({Math.round(property.land_area * 0.3025 * 100) / 100}坪)</TableCell>
                      <TableCell className="whitespace-nowrap">{property.zoning}</TableCell>
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
                              navigate(`/land/${property.land_id}/edit`);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(property.land_id);
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

        <TabsContent value="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card 
                key={property.land_id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/land/${property.land_id}`)}
              >
                <img
                  src={property.images?.main || 'https://placehold.co/400x300'}
                  alt={property.address}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <CardTitle className="text-lg truncate">
                    {property.address}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-[#5AB9CE]">
                      ¥{(property.sale_price / 10000).toLocaleString()}万円
                    </p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>土地面積: {property.land_area}㎡</p>
                      <p>坪巣: {Math.round(property.land_area * 0.3025 * 100) / 100}坪</p>
                      <p>建ぺい率/容積率: {property.building_coverage}% / {property.floor_area_ratio}%</p>
                    </div>
                    <div className="pt-2">
                      <Badge variant={getStatusBadgeVariant(property.status)}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/land/${property.land_id}/edit`);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(property.land_id);
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
