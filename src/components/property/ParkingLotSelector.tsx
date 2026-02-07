import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parkingLotSchema } from '@/lib/validations';
import { parkingLotApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { z } from 'zod';
import type { ParkingLotInput } from '@/types/property';
import { Plus } from 'lucide-react';
import { ImageUploadField } from '@/components/common/ImageUploadField';

type ParkingLotFormData = z.infer<typeof parkingLotSchema>;

interface ParkingLotSelectorProps {
  value?: number;
  onChange: (parkingLotId: number) => void;
  error?: string;
}

export function ParkingLotSelector({ value, onChange, error }: ParkingLotSelectorProps) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: parkingLots = [] } = useQuery({
    queryKey: ['parking-lots'],
    queryFn: parkingLotApi.getAll,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: newLotErrors, isSubmitting },
    setValue: setNewLotValue,
    watch: watchNewLot,
  } = useForm<ParkingLotFormData>({
    resolver: zodResolver(parkingLotSchema),
    defaultValues: {
      name: '',
      address: '',
      total_spaces: 1,
      images: {
        main: '',
        layout: '',
        gallery: [],
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: parkingLotApi.create,
    onSuccess: (newLot) => {
      queryClient.invalidateQueries({ queryKey: ['parking-lots'] });
      toast.success('駐車場を登録しました');
      setDialogOpen(false);
      reset();
      onChange(newLot.parking_lot_id);
      setMode('existing');
    },
    onError: () => {
      toast.error('駐車場の登録に失敗しました');
    },
  });

  const onSubmitNew = (data: ParkingLotFormData) => {
    if (data.images?.main?.startsWith('blob:')) {
      toast.error('画像のアップロードが完了していません');
      return;
    }
    createMutation.mutate(data as ParkingLotInput);
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        value={mode}
        onValueChange={(v) => setMode(v as 'existing' | 'new')}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="existing" id="pl-mode-existing" />
          <Label htmlFor="pl-mode-existing">既存の駐車場から選択</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="new" id="pl-mode-new" />
          <Label htmlFor="pl-mode-new">新しい駐車場を作成</Label>
        </div>
      </RadioGroup>

      {mode === 'existing' && (
        <div className="space-y-2">
          <Select
            value={value?.toString() || ''}
            onValueChange={(val) => onChange(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="駐車場を選択" />
            </SelectTrigger>
            <SelectContent>
              {parkingLots.map((lot) => (
                <SelectItem key={lot.parking_lot_id} value={lot.parking_lot_id.toString()}>
                  {lot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {mode === 'new' && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">新しい駐車場を登録して選択します</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  入力フォームを開く
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>新規駐車場登録</DialogTitle>
                  <DialogDescription>
                    駐車場の基本情報と図面を登録してください。
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitNew)} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">駐車場名</Label>
                    <Input id="name" {...register('name')} placeholder="例: 第1重実駐車場" />
                    {newLotErrors.name && (
                      <p className="text-sm text-red-500">{newLotErrors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">住所</Label>
                    <Input id="address" {...register('address')} placeholder="例: 東京都..." />
                    {newLotErrors.address && (
                      <p className="text-sm text-red-500">{newLotErrors.address.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_spaces">総区画数</Label>
                    <Input 
                      id="total_spaces" 
                      type="number" 
                      autoComplete="off"
                      {...register('total_spaces', { valueAsNumber: true })} 
                    />
                    {newLotErrors.total_spaces && (
                      <p className="text-sm text-red-500">{newLotErrors.total_spaces.message}</p>
                    )}
                  </div>
                  
                  {/* 画像アップロード(簡易版) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>サムネイル (必須)</Label>
                      <ImageUploadField
                        name="images.main"
                        value={watchNewLot('images.main')}
                        onChange={(url) => setNewLotValue('images.main', url)}
                        required
                      />
                      {newLotErrors.images?.main && (
                        <p className="text-sm text-red-500">{newLotErrors.images.main.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>区画図 (必須)</Label>
                      <ImageUploadField
                        name="images.layout"
                        value={watchNewLot('images.layout')}
                        onChange={(url) => setNewLotValue('images.layout', url)}
                        required
                      />
                      {newLotErrors.images?.layout && (
                        <p className="text-sm text-red-500">{newLotErrors.images.layout.message}</p>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? '登録中...' : '登録して選択'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-gray-500">
            ※登録完了後、自動的に選択されます。
          </p>
        </div>
      )}
    </div>
  );
}
