import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rentalSchema } from '@/lib/validations';
import { rentalApi } from '@/lib/api';
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
import type { RentalUnitInput } from '@/types/property';

type RentalFormData = z.infer<typeof rentalSchema>;

export default function RentalForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      building_id: 0,
      unit_number: '',
      floor: 1,
      room_layout: '',
      area: 0,
      monthly_rent: 0,
      management_fee: 0,
      deposit: 0,
      key_money: 0,
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

  // 編集時のデータ取得
  useEffect(() => {
    if (isEdit && id) {
      rentalApi.getById(Number(id)).then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as any, value);
        });
      });
    }
  }, [isEdit, id, setValue]);

  const createMutation = useMutation({
    mutationFn: rentalApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-units'] });
      toast.success('物件を登録しました');
      navigate('/rental');
    },
    onError: () => {
      toast.error('登録に失敗しました');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<RentalUnitInput>) => rentalApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-units'] });
      toast.success('物件を更新しました');
      navigate('/rental');
    },
    onError: () => {
      toast.error('更新に失敗しました');
    },
  });

  const onSubmit = (data: RentalFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data as RentalUnitInput);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEdit ? '賃貸物件編集' : '賃貸物件登録'}
        </h2>
        <p className="text-gray-500 mt-2">物件情報を入力してください</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 建物選択 */}
        <Card>
          <CardHeader>
            <CardTitle>建物情報</CardTitle>
            <CardDescription>登録済みの建物から選択するか、新規作成してください</CardDescription>
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
                <Input id="unit_number" {...register('unit_number')} />
                {errors.unit_number && (
                  <p className="text-sm text-red-500">{errors.unit_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">階数</Label>
                <Input
                  id="floor"
                  type="number"
                  {...register('floor', { valueAsNumber: true })}
                />
                {errors.floor && (
                  <p className="text-sm text-red-500">{errors.floor.message}</p>
                )}
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
                    <SelectItem value="2K">2K</SelectItem>
                    <SelectItem value="2DK">2DK</SelectItem>
                    <SelectItem value="2LDK">2LDK</SelectItem>
                    <SelectItem value="3LDK">3LDK</SelectItem>
                  </SelectContent>
                </Select>
                {errors.room_layout && (
                  <p className="text-sm text-red-500">{errors.room_layout.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">面積（㎡）</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  {...register('area', { valueAsNumber: true })}
                />
                {errors.area && (
                  <p className="text-sm text-red-500">{errors.area.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="main_direction">向き</Label>
                <Select onValueChange={(value) => setValue('main_direction', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="向きを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="北">北</SelectItem>
                    <SelectItem value="南">南</SelectItem>
                    <SelectItem value="東">東</SelectItem>
                    <SelectItem value="西">西</SelectItem>
                    <SelectItem value="北東">北東</SelectItem>
                    <SelectItem value="北西">北西</SelectItem>
                    <SelectItem value="南東">南東</SelectItem>
                    <SelectItem value="南西">南西</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 賃料情報 */}
        <Card>
          <CardHeader>
            <CardTitle>賃料情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly_rent">月額賃料（円）</Label>
                <Input
                  id="monthly_rent"
                  type="number"
                  {...register('monthly_rent', { valueAsNumber: true })}
                />
                {errors.monthly_rent && (
                  <p className="text-sm text-red-500">{errors.monthly_rent.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="management_fee">管理費（円）</Label>
                <Input
                  id="management_fee"
                  type="number"
                  {...register('management_fee', { valueAsNumber: true })}
                />
                {errors.management_fee && (
                  <p className="text-sm text-red-500">{errors.management_fee.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit">敷金（円）</Label>
                <Input
                  id="deposit"
                  type="number"
                  {...register('deposit', { valueAsNumber: true })}
                />
                {errors.deposit && (
                  <p className="text-sm text-red-500">{errors.deposit.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="key_money">礼金（円）</Label>
                <Input
                  id="key_money"
                  type="number"
                  {...register('key_money', { valueAsNumber: true })}
                />
                {errors.key_money && (
                  <p className="text-sm text-red-500">{errors.key_money.message}</p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parking_available"
                    onCheckedChange={(checked) => setValue('parking_available', !!checked)}
                  />
                  <Label htmlFor="parking_available">駐車場あり</Label>
                </div>
              </div>

              {parkingAvailable && (
                <div className="space-y-2">
                  <Label htmlFor="parking_fee">駐車場代（円）</Label>
                  <Input
                    id="parking_fee"
                    type="number"
                    {...register('parking_fee', { valueAsNumber: true })}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* リスト表示: 賃料情報と設備・条件の間に追加 */}
        
        {/* 画像アップロード */}
        <div className="space-y-6">
          {/* サムネイル（必須） */}
          <Card>
            <CardHeader>
              <CardTitle>📷 サムネイル（必須）</CardTitle>
              <CardDescription>物件一覧で表示される代表画像</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadField
                name="images.main"
                value={watch('images.main')}
                onChange={(url) => setValue('images.main', url)}
                required
              />
              {errors.images?.main && (
                <p className="text-sm text-red-500">{errors.images.main.message}</p>
              )}
            </CardContent>
          </Card>
          
          {/* 間取り図（必須） */}
          <Card>
            <CardHeader>
              <CardTitle>📐 間取り図（必須）</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploadField
                name="images.floorplan"
                value={watch('images.floorplan')}
                onChange={(url) => setValue('images.floorplan', url)}
                required
              />
              {errors.images?.floorplan && (
                <p className="text-sm text-red-500">{errors.images.floorplan.message}</p>
              )}
            </CardContent>
          </Card>
          
          {/* その他の画像（任意） */}
          <Card>
            <CardHeader>
              <CardTitle>🖼️ その他の画像（最大10枚）</CardTitle>
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

        {/* 設備・条件 */}
        <Card>
          <CardHeader>
            <CardTitle>設備・条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pets_allowed"
                  onCheckedChange={(checked) => setValue('pets_allowed', !!checked)}
                />
                <Label htmlFor="pets_allowed">ペット可</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="musical_instruments_allowed"
                  onCheckedChange={(checked) =>
                    setValue('musical_instruments_allowed', !!checked)
                  }
                />
                <Label htmlFor="musical_instruments_allowed">楽器可</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ステータス */}
        <Card>
          <CardHeader>
            <CardTitle>ステータス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="status">ステータス</Label>
              <Select onValueChange={(value) => setValue('status', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="ステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="準備中">準備中</SelectItem>
                  <SelectItem value="募集中">募集中</SelectItem>
                  <SelectItem value="入居中">入居中</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 送信ボタン */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/rental')}>
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </div>
  );
}
