import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildingSchema } from '@/lib/validations';
import { buildingApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { z } from 'zod';
import type { BuildingInput } from '@/types/property';
import { Plus } from 'lucide-react';

type BuildingFormData = z.infer<typeof buildingSchema>;

interface BuildingSelectorProps {
  value?: number;
  onChange: (buildingId: number) => void;
  error?: string;
}

export function BuildingSelector({ value, onChange, error }: BuildingSelectorProps) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: buildings = [], isError } = useQuery({
    queryKey: ['buildings'],
    queryFn: buildingApi.getAll,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // 新規作成用のフォーム
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: newBuildingErrors, isSubmitting },
    setValue: setNewBuildingValue,
  } = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: '',
      address: '',
      building_age: 0,
      structure: 'RC',
      total_floors: 1,
    }
  });

  const createMutation = useMutation({
    mutationFn: buildingApi.create,
    onSuccess: (newBuilding) => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success('建物を登録しました');
      setDialogOpen(false);
      reset();
      // 新しく作成された建物を自動選択
      onChange(newBuilding.building_id);
      setMode('existing');
    },
    onError: () => {
      toast.error('建物の登録に失敗しました');
    },
  });

  const onSubmitNew = (data: BuildingFormData) => {
    createMutation.mutate(data as BuildingInput);
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        value={mode}
        onValueChange={(v) => setMode(v as 'existing' | 'new')}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="existing" id="mode-existing" />
          <Label htmlFor="mode-existing">既存の建物から選択</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="new" id="mode-new" />
          <Label htmlFor="mode-new">新しい建物を作成</Label>
        </div>
      </RadioGroup>

      {mode === 'existing' && (
        <div className="space-y-2">
          <Select
            value={value?.toString() || ''}
            onValueChange={(val) => onChange(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="建物を選択" />
            </SelectTrigger>
            <SelectContent>
              {buildings.map((building) => (
                <SelectItem key={building.building_id} value={building.building_id.toString()}>
                  {building.name}
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
            <p className="text-sm text-gray-600">新しい建物を登録して選択します</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  入力フォームを開く
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>新規建物登録</DialogTitle>
                  <DialogDescription>
                    建物の基本情報を入力してください。
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitNew)} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">建物名</Label>
                    <Input id="name" {...register('name')} placeholder="例: メゾン重実" />
                    {newBuildingErrors.name && (
                      <p className="text-sm text-red-500">{newBuildingErrors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">住所</Label>
                    <Input id="address" {...register('address')} placeholder="例: 東京都..." />
                    {newBuildingErrors.address && (
                      <p className="text-sm text-red-500">{newBuildingErrors.address.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="building_age">築年数</Label>
                      <Input 
                        id="building_age" 
                        type="number" 
                        autoComplete="off"
                        {...register('building_age', { valueAsNumber: true })} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total_floors">総階数</Label>
                      <Input 
                        id="total_floors" 
                        type="number" 
                        autoComplete="off"
                        {...register('total_floors', { valueAsNumber: true })} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="structure">構造</Label>
                    <Select onValueChange={(val) => setNewBuildingValue('structure', val as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="構造を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RC">RC(鉄筋コンクリート)</SelectItem>
                        <SelectItem value="SRC">SRC(鉄骨鉄筋コンクリート)</SelectItem>
                        <SelectItem value="鉄骨">鉄骨</SelectItem>
                        <SelectItem value="木造">木造</SelectItem>
                      </SelectContent>
                    </Select>
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
