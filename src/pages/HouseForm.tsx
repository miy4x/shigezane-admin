import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { houseSchema } from '@/lib/validations';
import { houseApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { z } from 'zod';
import { ImageUploadField, MultiImageUploadField } from '@/components/common/ImageUploadField';
import type { HousePropertyInput as HouseInput } from '@/types/property';
import { Camera, FileDigit, Images } from 'lucide-react';

type HouseFormData = z.infer<typeof houseSchema>;

export default function HouseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<HouseFormData>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      property_type: '戸建',
      address: '',
      sale_price: 0,
      land_area: 0,
      building_area: 0,
      room_layout: '',
      building_age: 0,
      structure: '',
      floor: 1,
      status: '準備中',
      images: {
        main: '',
        floorplan: '',
        gallery: [],
      },
    },
  });

  const propertyType = watch('property_type');

  useEffect(() => {
    if (isEdit && id) {
      houseApi.getById(Number(id)).then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as any, value);
        });
      });
    }
  }, [isEdit, id, setValue]);

  const createMutation = useMutation({
    mutationFn: houseApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['house-properties'] });
      toast.success('物件を登録しました');
      navigate('/house');
    },
    onError: () => {
      toast.error('登録に失敗しました');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<HouseInput>) => houseApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['house-properties'] });
      toast.success('物件を更新しました');
      navigate('/house');
    },
    onError: () => {
      toast.error('更新に失敗しました');
    },
  });

  const onSubmit = (data: HouseFormData) => {
    if (data.images?.main?.startsWith('blob:')) {
      toast.error('画像のアップロードが完了していません');
      return;
    }

    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data as HouseInput);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEdit ? '住宅・マンション編集' : '住宅・マンション登録'}
        </h2>
        <p className="text-gray-500 mt-2">物件の詳細情報を入力してください</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 space-y-2">
                <Label htmlFor="property_type">物件種別</Label>
                <div className="flex gap-4">
                   <Button 
                    type="button" 
                    variant={propertyType === '戸建' ? 'default' : 'outline'}
                    onClick={() => setValue('property_type', '戸建')}
                   >
                    戸建
                   </Button>
                   <Button 
                    type="button" 
                    variant={propertyType === '中古マンション' ? 'default' : 'outline'}
                    onClick={() => setValue('property_type', '中古マンション')}
                   >
                    中古マンション
                   </Button>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">住所</Label>
                <Input id="address" {...register('address')} placeholder="例：東京都..." />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale_price">販売価格（円）</Label>
                <Input id="sale_price" type="number" autoComplete="off" {...register('sale_price', { valueAsNumber: true })} />
                {errors.sale_price && <p className="text-sm text-red-500">{errors.sale_price.message}</p>}
              </div>

              {propertyType === '戸建' && (
                <div className="space-y-2">
                  <Label htmlFor="land_area">土地面積（㎡）</Label>
                  <Input id="land_area" type="number" step="0.01" autoComplete="off" {...register('land_area', { valueAsNumber: true })} />
                  {errors.land_area && <p className="text-sm text-red-500">{errors.land_area.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="building_area">建物面積/専有面積（㎡）</Label>
                <Input id="building_area" type="number" step="0.01" autoComplete="off" {...register('building_area', { valueAsNumber: true })} />
                {errors.building_area && <p className="text-sm text-red-500">{errors.building_area.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>建物詳細</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room_layout">間取り</Label>
                <Select onValueChange={(value) => setValue('room_layout', value)} value={watch('room_layout')}>
                  <SelectTrigger><SelectValue placeholder="間取りを選択" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1R">1R</SelectItem>
                    <SelectItem value="1K">1K</SelectItem>
                    <SelectItem value="1DK">1DK</SelectItem>
                    <SelectItem value="1LDK">1LDK</SelectItem>
                    <SelectItem value="2LDK">2LDK</SelectItem>
                    <SelectItem value="3LDK">3LDK</SelectItem>
                    <SelectItem value="4LDK">4LDK</SelectItem>
                    <SelectItem value="5LDK以上">5LDK以上</SelectItem>
                  </SelectContent>
                </Select>
                {errors.room_layout && <p className="text-sm text-red-500">{errors.room_layout.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="building_age">築年数（年）</Label>
                <Input id="building_age" type="number" autoComplete="off" {...register('building_age', { valueAsNumber: true })} />
                <p className="text-xs text-gray-400">新築の場合は0を入力</p>
                {errors.building_age && <p className="text-sm text-red-500">{errors.building_age.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="structure">構造</Label>
                 <Select onValueChange={(value) => setValue('structure', value)} value={watch('structure')}>
                  <SelectTrigger><SelectValue placeholder="構造を選択" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="木造">木造</SelectItem>
                    <SelectItem value="軽量鉄骨造">軽量鉄骨造</SelectItem>
                    <SelectItem value="鉄骨造">鉄骨造</SelectItem>
                    <SelectItem value="RC造">RC造</SelectItem>
                    <SelectItem value="SRC造">SRC造</SelectItem>
                  </SelectContent>
                </Select>
                {errors.structure && <p className="text-sm text-red-500">{errors.structure.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">階数</Label>
                <Input id="floor" type="number" autoComplete="off" {...register('floor', { valueAsNumber: true })} />
                {propertyType === '戸建' ? (
                   <p className="text-xs text-gray-400">建物全体の階数</p>
                ) : (
                   <p className="text-xs text-gray-400">所在階</p>
                )}
                {errors.floor && <p className="text-sm text-red-500">{errors.floor.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 画像アップロード */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  サムネイル（必須）
                </CardTitle>
                <CardDescription>一覧で表示される代表画像</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploadField
                  name="images.main"
                  value={watch('images.main')}
                  onChange={(url) => setValue('images.main', url)}
                  required
                />
                {errors.images?.main && <p className="text-sm text-red-500">{errors.images.main.message}</p>}
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileDigit className="h-5 w-5" />
                  間取り図（必須）
                </CardTitle>
                <CardDescription>部屋の配置を示す図面</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploadField
                  name="images.floorplan"
                  value={watch('images.floorplan')}
                  onChange={(url) => setValue('images.floorplan', url)}
                  required
                />
                {errors.images?.floorplan && <p className="text-sm text-red-500">{errors.images.floorplan.message}</p>}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Images className="h-5 w-5" />
                その他の画像（最大10枚）
              </CardTitle>
              <CardDescription>内観、設備、周辺環境等</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiImageUploadField
                value={watch('images.gallery') || []}
                onChange={(urls) => setValue('images.gallery', urls)}
                maxFiles={10}
              />
            </CardContent>
          </Card>
        </div>

        {/* ステータス */}
        <Card>
          <CardHeader>
            <CardTitle>ステータス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="status">販売ステータス</Label>
              <Select onValueChange={(value) => setValue('status', value as any)} value={watch('status')}>
                <SelectTrigger><SelectValue placeholder="ステータスを選択" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="準備中">準備中</SelectItem>
                  <SelectItem value="募集中">募集中</SelectItem>
                  <SelectItem value="成約済">成約済</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/house')}>キャンセル</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '保存中...' : '保存'}</Button>
        </div>
      </form>
    </div>
  );
}
