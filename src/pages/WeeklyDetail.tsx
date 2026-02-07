import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { weeklyApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, ArrowLeft } from 'lucide-react';

// Fixed export issue
export default function WeeklyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const propertyId = Number(id);

  const { data: property, isLoading } = useQuery({
    queryKey: ['weekly-unit', propertyId],
    queryFn: () => weeklyApi.getById(propertyId),
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
    if (status === '入居中') return 'secondary';
    return 'outline';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/weekly')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {property.building_name || '建物名不明'} {property.unit_number}
            </h1>
            <p className="text-gray-500">ウィークリー物件詳細</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => navigate(`/weekly/${propertyId}/edit`)}>
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
                  <div className="text-sm text-gray-500">専有面積</div>
                  <div className="font-medium text-lg">{property.area}㎡</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">階数</div>
                  <div className="font-medium text-lg">{property.floor}階</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">向き</div>
                  <div className="font-medium text-lg">{property.main_direction || '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 設備・条件 */}
          <Card>
            <CardHeader>
              <CardTitle>設備・条件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {property.unit_features?.map((feature: string) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">ペット相談</span>
                  <span className="font-medium">{property.pets_allowed ? '可' : '不可'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">楽器相談</span>
                  <span className="font-medium">{property.musical_instruments_allowed ? '可' : '不可'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">駐車場</span>
                  <span className="font-medium">
                    {property.parking_available 
                      ? `あり (¥${property.parking_fee?.toLocaleString()})` 
                      : 'なし'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
           {/* 間取り・ギャラリー */}
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
                 <CardTitle>契約条件</CardTitle>
                 <Badge variant={getStatusBadgeVariant(property.status)}>{property.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                 <div>
                    <div className="text-sm text-gray-500">日額</div>
                    <div className="text-xl font-bold text-[#5AB9CE]">¥{property.daily_rate?.toLocaleString()}</div>
                 </div>
                 <div>
                    <div className="text-sm text-gray-500">週額</div>
                    <div className="text-xl font-bold text-[#5AB9CE]">¥{property.weekly_rate?.toLocaleString()}</div>
                 </div>
                 <div>
                    <div className="text-sm text-gray-500">月額</div>
                    <div className="text-xl font-bold text-[#5AB9CE]">¥{property.monthly_rate?.toLocaleString()}</div>
                 </div>
              </div>
              
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">管理費・共益費</span>
                  <span className="font-medium">¥{property.management_fee?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

           <Card>
             <CardHeader><CardTitle>備考</CardTitle></CardHeader>
             <CardContent>
               <p className="text-sm text-gray-700 whitespace-pre-wrap">
                 {property.remarks || '備考なし'}
               </p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
