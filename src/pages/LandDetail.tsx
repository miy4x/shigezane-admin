import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { landApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, ArrowLeft } from 'lucide-react';

// Fixed export issue
export default function LandDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const propertyId = Number(id);

  const { data: property, isLoading } = useQuery({
    queryKey: ['land-property', propertyId],
    queryFn: () => landApi.getById(propertyId),
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/land')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {property.address}
            </h1>
            <p className="text-gray-500">土地詳細</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => navigate(`/land/${propertyId}/edit`)}>
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
                  <div className="text-sm text-gray-500">土地面積</div>
                  <div className="font-medium text-lg">{property.land_area}㎡</div>
                </div>
                 <div>
                  <div className="text-sm text-gray-500">地目</div>
                  <div className="font-medium text-lg">{property.land_category || '-'}</div>
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
                      <div className="text-sm text-gray-500">用途地域</div>
                      <div className="font-medium">{property.zoning || '-'}</div>
                   </div>
                   <div>
                       <div className="text-sm text-gray-500">建ぺい率 / 容積率</div>
                       <div className="font-medium">{property.building_coverage}% / {property.floor_area_ratio}%</div>
                   </div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">接道状況</div>
                    <div className="font-medium">{property.road_contact || '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
           {/* 図面・ギャラリー */}
           {property.images && (
            <div className="space-y-4">
              {property.images.survey && (
                <Card>
                  <CardHeader><CardTitle>測量図・区画図</CardTitle></CardHeader>
                  <CardContent>
                    <img src={property.images.survey} alt="Survey" className="w-full h-auto rounded" />
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
