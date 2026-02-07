import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { houseApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, ArrowLeft } from 'lucide-react';

// Fixed export issue
export default function HouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const propertyId = Number(id);

  const { data: property, isLoading } = useQuery({
    queryKey: ['house-property', propertyId],
    queryFn: () => houseApi.getById(propertyId),
    enabled: !!propertyId,
  });

  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  if (!property) {
    return <div className="p-8 text-center">物件が見つかりませんでした</div>;
  }

  const getStatusBadgeVariant = (status: string) => {
    if (status === '募集中') return 'default';
    if (status === '成約済') return 'secondary';
    return 'outline';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/house')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
               <Badge variant="outline">{property.property_type}</Badge>
               <h1 className="text-2xl font-bold tracking-tight">
                  {property.address}
               </h1>
            </div>
            <p className="text-gray-500">住宅・マンション詳細</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => navigate(`/house/${propertyId}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            編集する
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左カラム：画像・主要情報 */}
        <div className="md:col-span-2 space-y-6">
          {/* メイン画像 */}
          <Card className="overflow-hidden">
             <img
              src={property.images?.main || 'https://placehold.co/800x400'}
              alt="Main"
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </Card>

          {/* 基本スペック */}
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">間取り</div>
                  <div className="font-medium text-lg">{property.room_layout}</div>
                </div>
                 <div>
                  <div className="text-sm text-gray-500">建物面積/専有面積</div>
                  <div className="font-medium text-lg">{property.building_area}㎡</div>
                </div>
                {property.property_type === '戸建' && (
                 <div>
                   <div className="text-sm text-gray-500">土地面積</div>
                   <div className="font-medium text-lg">{property.land_area}㎡</div>
                 </div>
                )}
                <div>
                  <div className="text-sm text-gray-500">階数</div>
                  <div className="font-medium text-lg">{property.floor}階</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 詳細情報 */}
          <Card>
            <CardHeader>
              <CardTitle>詳細情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                       <div className="text-sm text-gray-500">築年数</div>
                       <div className="font-medium">{property.building_age === 0 ? '新築' : `築${property.building_age}年`}</div>
                   </div>
                   <div>
                       <div className="text-sm text-gray-500">構造</div>
                       <div className="font-medium">{property.structure || '-'}</div>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
           {/* 図面・ギャラリー */}
           {property.images && (
            <div className="space-y-4">
              {property.images.floorplan && (
                <Card>
                  <CardHeader><CardTitle>間取り図</CardTitle></CardHeader>
                  <CardContent>
                    <img src={property.images.floorplan} alt="Floorplan" className="w-full h-auto rounded" />
                  </CardContent>
                </Card>
              )}
              {property.images.gallery && property.images.gallery.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>ギャラリー</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {property.images.gallery.map((img: string, i: number) => (
                        <img key={i} src={img} alt={`Gallery ${i}`} className="w-full h-32 object-cover rounded" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* 右カラム：金額情報 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                 <CardTitle>販売価格</CardTitle>
                 <Badge variant={getStatusBadgeVariant(property.status)}>{property.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
               <div className="text-3xl font-bold text-[#5AB9CE]">¥{property.sale_price?.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
