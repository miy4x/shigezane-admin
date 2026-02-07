import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { parkingApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, ArrowLeft } from 'lucide-react';

// Fixed export issue
export default function ParkingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const propertyId = Number(id);

  const { data: property, isLoading } = useQuery({
    queryKey: ['parking-space', propertyId],
    queryFn: () => parkingApi.getById(propertyId),
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
    if (status === '契約中') return 'secondary';
    return 'outline';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/parking')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
               {property.parking_lot_name} {property.space_number}
            </h1>
            <p className="text-gray-500">駐車場詳細</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => navigate(`/parking/${propertyId}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            編集する
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左カラム：基本情報 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                   <div className="text-sm text-gray-500">区画番号</div>
                   <div className="font-medium text-lg">{property.space_number}</div>
                </div>
                 <div>
                   <div className="text-sm text-gray-500">車両サイズ</div>
                   <div className="font-medium text-lg">{property.vehicle_size}</div>
                 </div>
              </div>
            </CardContent>
          </Card>
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
            <CardContent>
               <div>
                  <div className="text-sm text-gray-500">月額賃料</div>
                  <div className="text-3xl font-bold text-[#5AB9CE]">¥{property.monthly_fee?.toLocaleString()}</div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
