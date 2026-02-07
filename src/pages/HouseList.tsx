import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { houseApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function HouseList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['house-properties'],
    queryFn: houseApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: houseApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['house-properties'] });
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
    filteredProperties = filteredProperties.filter((p) => p.status === statusFilter);
  }
  if (typeFilter !== 'all') {
    filteredProperties = filteredProperties.filter((p) => p.property_type === typeFilter);
  }

  // ソート
  filteredProperties.sort((a, b) => {
    if (sortBy === 'price-asc') return a.sale_price - b.sale_price;
    if (sortBy === 'price-desc') return b.sale_price - a.sale_price;
    if (sortBy === 'age-asc') return a.building_age - b.building_age;
    if (sortBy === 'newest') return (b.house_id || 0) - (a.house_id || 0);
    return 0;
  });

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
          <h2 className="text-3xl font-bold tracking-tight">住宅・マンション管理</h2>
          <p className="text-gray-500 mt-2">全{properties.length}件</p>
        </div>
        <Button onClick={() => navigate('/house/new')}>
          <Plus className="mr-2 h-4 w-4" />
          新規登録
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="募集中">募集中</SelectItem>
            <SelectItem value="成約済">成約済</SelectItem>
            <SelectItem value="準備中">準備中</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="種別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="戸建">戸建</SelectItem>
            <SelectItem value="中古マンション">マンション</SelectItem>
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
            <SelectItem value="age-asc">築浅順</SelectItem>
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
                    <TableHead className="w-[120px]">種別</TableHead>
                    <TableHead className="min-w-[150px]">住所</TableHead>
                    <TableHead className="w-[100px]">価格</TableHead>
                    <TableHead className="w-[150px]">間取り / 面積</TableHead>
                    <TableHead className="w-[100px]">築年数</TableHead>
                    <TableHead className="w-[100px]">ステータス</TableHead>
                    <TableHead className="text-right w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow 
                      key={property.house_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/house/${property.house_id}`)}  
                    >
                      <TableCell>
                        <img
                          src={property.images?.main || 'https://placehold.co/100'}
                          alt={property.address}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">{property.property_type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{property.address}</TableCell>
                      <TableCell className="whitespace-nowrap">¥{(property.sale_price / 10000).toLocaleString()}万円</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm">
                          {property.room_layout}
                          <span className="text-gray-400 mx-1">/</span>
                          {property.building_area}㎡
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">築{property.building_age}年</TableCell>
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
                              navigate(`/house/${property.house_id}/edit`);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(property.house_id);
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
                key={property.house_id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/house/${property.house_id}`)}
              >
                <div className="relative">
                  <img
                    src={property.images?.main || 'https://placehold.co/400x300'}
                    alt={property.address}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 left-2 bg-white/90 text-black hover:bg-white/100">
                    {property.property_type}
                  </Badge>
                </div>
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
                      <p>{property.room_layout} / {property.building_area}㎡</p>
                      <p>築{property.building_age}年 / {property.structure}</p>
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
                      navigate(`/house/${property.house_id}/edit`);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    編集
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(property.house_id);
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
