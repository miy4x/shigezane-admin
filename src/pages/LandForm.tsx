import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { landSchema } from '@/lib/validations';
import { landApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { z } from 'zod';
import { ImageUploadField, MultiImageUploadField } from '@/components/common/ImageUploadField';
import type { LandPropertyInput as LandInput } from '@/types/property';

type LandFormData = z.infer<typeof landSchema>;

export default function LandForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LandFormData>({
    resolver: zodResolver(landSchema),
    defaultValues: {
      address: '',
      sale_price: 0,
      land_area: 0,
      zoning: '',
      building_coverage: 60,
      floor_area_ratio: 200,
      road_contact: '',
      land_category: '宅地',
      status: '準備中',
      images: {
        main: '',
        survey: '',
        gallery: [],
      },
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      landApi.getById(Number(id)).then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as any, value);
        });
      });
    }
  }, [isEdit, id, setValue]);

  const createMutation = useMutation({
    mutationFn: landApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['land-properties'] });
      toast.success('土地情報を登録しました');
      navigate('/land');
    },
    onError: () => {
      toast.error('登録に失敗しました');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<LandInput>) => landApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['land-properties'] });
      toast.success('土地情報を更新しました');
      navigate('/land');
    },
    onError: () => {
      toast.error('更新に失敗しました');
    },
  });

  const onSubmit = (data: LandFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data as LandInput);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEdit ? '土地情報編集' : '土地情報登録'}
        </h2>
        <p className="text-gray-500 mt-2">土地の基本情報を入力してください</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">住所</Label>
                <Input id="address" {...register('address')} placeholder="例：東京都..." />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale_price">販売価格（円）</Label>
                <Input id="sale_price" type="number" {...register('sale_price', { valueAsNumber: true })} />
                {errors.sale_price && <p className="text-sm text-red-500">{errors.sale_price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="land_area">土地面積（㎡）</Label>
                <Input id="land_area" type="number" step="0.01" {...register('land_area', { valueAsNumber: true })} />
                {errors.land_area && <p className="text-sm text-red-500">{errors.land_area.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>詳細情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zoning">用途地域</Label>
                 <Select onValueChange={(value) => setValue('zoning', value)}>
                  <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="第一種低層住居専用地域">第一種低層住居専用地域</SelectItem>
                    <SelectItem value="第二種低層住居専用地域">第二種低層住居専用地域</SelectItem>
                    <SelectItem value="第一種中高層住居専用地域">第一種中高層住居専用地域</SelectItem>
                    <SelectItem value="第二種中高層住居専用地域">第二種中高層住居専用地域</SelectItem>
                    <SelectItem value="近隣商業地域">近隣商業地域</SelectItem>
                    <SelectItem value="商業地域">商業地域</SelectItem>
                    <SelectItem value="準工業地域">準工業地域</SelectItem>
                  </SelectContent>
                </Select>
                {errors.zoning && <p className="text-sm text-red-500">{errors.zoning.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="land_category">地目</Label>
                <Input id="land_category" {...register('land_category')} placeholder="例：宅地" />
                {errors.land_category && <p className="text-sm text-red-500">{errors.land_category.message}</p>}
              </div>

               <div className="space-y-2">
                <Label htmlFor="building_coverage">建ぺい率（%）</Label>
                <Input id="building_coverage" type="number" {...register('building_coverage', { valueAsNumber: true })} />
                {errors.building_coverage && <p className="text-sm text-red-500">{errors.building_coverage.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor_area_ratio">容積率（%）</Label>
                <Input id="floor_area_ratio" type="number" {...register('floor_area_ratio', { valueAsNumber: true })} />
                {errors.floor_area_ratio && <p className="text-sm text-red-500">{errors.floor_area_ratio.message}</p>}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="road_contact">接道状況</Label>
                <Input id="road_contact" {...register('road_contact')} placeholder="例：北側 4m 公道" />
                {errors.road_contact && <p className="text-sm text-red-500">{errors.road_contact.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 画像アップロード */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📷 サムネイル（必須）</CardTitle>
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
          
          <Card>
            <CardHeader>
              <CardTitle>📐 測量図・区画図（必須）</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploadField
                name="images.survey"
                value={watch('images.survey')}
                onChange={(url) => setValue('images.survey', url)}
                required
              />
              {errors.images?.survey && <p className="text-sm text-red-500">{errors.images.survey.message}</p>}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>🖼️ その他の画像（最大10枚）</CardTitle>
              <CardDescription>現地の様子や周辺環境など</CardDescription>
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
              <Select onValueChange={(value) => setValue('status', value as any)}>
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
          <Button type="button" variant="outline" onClick={() => navigate('/land')}>キャンセル</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '保存中...' : '保存'}</Button>
        </div>
      </form>
    </div>
  );
}
