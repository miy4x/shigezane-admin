import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parkingSpaceSchema } from '@/lib/validations';
import { parkingApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { z } from 'zod';
import { ParkingLotSelector } from '@/components/property/ParkingLotSelector';
import type { ParkingSpaceInput } from '@/types/property';

type ParkingFormData = z.infer<typeof parkingSpaceSchema>;

export default function ParkingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ParkingFormData>({
    resolver: zodResolver(parkingSpaceSchema),
    defaultValues: {
      parking_lot_id: 0,
      space_number: '',
      monthly_fee: 0,
      vehicle_size: '普通車',
      status: '準備中',
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      parkingApi.getById(Number(id)).then((data) => {
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as any, value);
        });
      });
    }
  }, [isEdit, id, setValue]);

  const createMutation = useMutation({
    mutationFn: parkingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-spaces'] });
      toast.success('駐車場区画を登録しました');
      navigate('/parking');
    },
    onError: () => {
      toast.error('登録に失敗しました');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<ParkingSpaceInput>) => parkingApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-spaces'] });
      toast.success('駐車場区画を更新しました');
      navigate('/parking');
    },
    onError: () => {
      toast.error('更新に失敗しました');
    },
  });

  const onSubmit = (data: ParkingFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data as ParkingSpaceInput);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isEdit ? '駐車場区画編集' : '駐車場区画登録'}
        </h2>
        <p className="text-gray-500 mt-2">区画の詳細情報を入力してください</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>駐車場情報</CardTitle>
            <CardDescription>対象の駐車場を選択するか、新規作成してください</CardDescription>
          </CardHeader>
          <CardContent>
            <ParkingLotSelector
              value={watch('parking_lot_id')}
              onChange={(id) => setValue('parking_lot_id', id)}
              error={errors.parking_lot_id?.message}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>区画詳細</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="space_number">区画番号</Label>
                <Input id="space_number" {...register('space_number')} placeholder="例: No.1" />
                {errors.space_number && <p className="text-sm text-red-500">{errors.space_number.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly_fee">月額料金（円）</Label>
                <Input id="monthly_fee" type="number" {...register('monthly_fee', { valueAsNumber: true })} />
                {errors.monthly_fee && <p className="text-sm text-red-500">{errors.monthly_fee.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_size">車両サイズ</Label>
                <Select onValueChange={(value) => setValue('vehicle_size', value)} value={watch('vehicle_size')}>
                  <SelectTrigger><SelectValue placeholder="サイズを選択" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="軽自動車">軽自動車</SelectItem>
                    <SelectItem value="小型車">小型車</SelectItem>
                    <SelectItem value="普通車">普通車</SelectItem>
                    <SelectItem value="大型車">大型車</SelectItem>
                    <SelectItem value="ハイルーフ">ハイルーフ</SelectItem>
                  </SelectContent>
                </Select>
                {errors.vehicle_size && <p className="text-sm text-red-500">{errors.vehicle_size.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">契約ステータス</Label>
                 <Select onValueChange={(value) => setValue('status', value as any)} value={watch('status')}>
                  <SelectTrigger><SelectValue placeholder="ステータスを選択" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="準備中">準備中</SelectItem>
                    <SelectItem value="募集中">募集中</SelectItem>
                    <SelectItem value="契約中">契約中</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/parking')}>キャンセル</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '保存中...' : '保存'}</Button>
        </div>
      </form>
    </div>
  );
}
