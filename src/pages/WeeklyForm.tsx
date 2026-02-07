import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { weeklySchema } from '@/lib/validations';
import { weeklyApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { z } from 'zod';
import { ImageUploadField, MultiImageUploadField } from '@/components/common/ImageUploadField';
import { BuildingSelector } from '@/components/property/BuildingSelector';
import type { WeeklyUnitInput } from '@/types/property';
import { Camera, FileDigit, Images } from 'lucide-react';

type WeeklyFormData = z.infer<typeof weeklySchema>;

export default function WeeklyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<WeeklyFormData>({
    resolver: zodResolver(weeklySchema),
    defaultValues: {
      building_id: 0,
      unit_number: '',
      floor: 1,
      room_layout: '',
      area: 0,
      daily_rate: 0,
      weekly_rate: 0,
      monthly_rate: 0,
      management_fee: 0,
      parking_available: false,
      parking_fee: 0,
      pets_allowed: false,
      musical_instruments_allowed: false,
      status: '準備中',
      images: {
        main: '',
        floorplan: '',
        gallery: [],
      },
      unit_features: [],
    },
  });

  const parkingAvailable = watch('parking_available');

  useEffect(() => {
    if (isEdit && id) {
      weeklyApi.getById(Number(id)).then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as any, value);
        });
      });
    }
  }, [isEdit, id, setValue]);

  const createMutation = useMutation({
    mutationFn: weeklyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-units'] });
      toast.success('ウィークリー物件を登録しました');
      navigate('/weekly');
    },
    onError: () => {
      toast.error('登録に失敗しました');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<WeeklyUnitInput>) => weeklyApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-units'] });
      toast.success('ウィークリー物件を更新しました');
      navigate('/weekly');
    },
    onError: () => {
      toast.error('更新に失敗しました');
    },
  });

  const onSubmit = (data: WeeklyFormData) => {
    if (data.images?.main?.startsWith('blob:')) {
      toast.error('画像のアップロードが完了していません');
      return;
    }

    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data as WeeklyUnitInput);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEdit ? 'ウィークリー物件編集' : 'ウィークリー物件登録'}
        </h2>
        <p className="text-gray-500 mt-2">物件情報を入力してください</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>建物情報</CardTitle>
            <CardDescription>既存の建物から選択するか、新規作成してください</CardDescription>
          </CardHeader>
          <CardContent>
            <BuildingSelector
              value={watch('building_id')}
              onChange={(id) => setValue('building_id', id)}
              error={errors.building_id?.message}
            />
          </CardContent>
        </Card>

        {/* 部屋情報 */}
        <Card>
          <CardHeader>
            <CardTitle>部屋情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit_number">部屋番号</Label>
                <Input id="unit_number" autoComplete="off" {...register('unit_number')} />
                {errors.unit_number && <p className="text-sm text-red-500">{errors.unit_number.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">階数</Label>
                <Input id="floor" type="number" autoComplete="off" {...register('floor', { valueAsNumber: true })} />
                {errors.floor && <p className="text-sm text-red-500">{errors.floor.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="room_layout">間取り</Label>
                <Select onValueChange={(value) => setValue('room_layout', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="間取りを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1K">1K</SelectItem>
                    <SelectItem value="1DK">1DK</SelectItem>
                    <SelectItem value="1LDK">1LDK</SelectItem>
                  </SelectContent>
                </Select>
                {errors.room_layout && <p className="text-sm text-red-500">{errors.room_layout.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">面積（㎡）</Label>
                <Input id="area" type="number" step="0.1" autoComplete="off" {...register('area', { valueAsNumber: true })} />
                {errors.area && <p className="text-sm text-red-500">{errors.area.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="main_direction">向き</Label>
                <Select onValueChange={(value) => setValue('main_direction', value)}>
                  <SelectTrigger><SelectValue placeholder="向きを選択" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="北">北</SelectItem>
                    <SelectItem value="南">南</SelectItem>
                    <SelectItem value="東">東</SelectItem>
                    <SelectItem value="西">西</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 料金情報 - ウィークリー特有 */}
        <Card>
          <CardHeader>
            <CardTitle>料金情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="daily_rate">日額（円）</Label>
                <Input id="daily_rate" type="number" autoComplete="off" {...register('daily_rate', { valueAsNumber: true })} />
                {errors.daily_rate && <p className="text-sm text-red-500">{errors.daily_rate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weekly_rate">週額（円）</Label>
                <Input id="weekly_rate" type="number" autoComplete="off" {...register('weekly_rate', { valueAsNumber: true })} />
                {errors.weekly_rate && <p className="text-sm text-red-500">{errors.weekly_rate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_rate">月額（円）</Label>
                <Input id="monthly_rate" type="number" autoComplete="off" {...register('monthly_rate', { valueAsNumber: true })} />
                {errors.monthly_rate && <p className="text-sm text-red-500">{errors.monthly_rate.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="management_fee">管理費（円）</Label>
                <Input id="management_fee" type="number" autoComplete="off" {...register('management_fee', { valueAsNumber: true })} />
              </div>
              
              <div className="col-span-3 grid grid-cols-2 gap-4">
                 <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="parking_available"
                    checked={parkingAvailable}
                    onCheckedChange={(checked) => setValue('parking_available', !!checked)}
                  />
                  <Label htmlFor="parking_available">駐車場あり</Label>
                </div>
                {parkingAvailable && (
                  <div className="space-y-2">
                    <Label htmlFor="parking_fee">駐車場代（円）</Label>
                    <Input id="parking_fee" type="number" autoComplete="off" {...register('parking_fee', { valueAsNumber: true })} />
                  </div>
                )}
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
                <CardDescription>物件一覧で表示される代表画像</CardDescription>
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
            </CardHeader>
            <CardContent>
              <MultiImageUploadField
                name="images.gallery"
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
              <Label htmlFor="status">ステータス</Label>
              <Select onValueChange={(value) => setValue('status', value as any)}>
                <SelectTrigger><SelectValue placeholder="ステータスを選択" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="準備中">準備中</SelectItem>
                  <SelectItem value="募集中">募集中</SelectItem>
                  <SelectItem value="入居中">入居中</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/weekly')}>キャンセル</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '保存中...' : '保存'}</Button>
        </div>
      </form>
    </div>
  );
}
