import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export interface RentalSearchFilters {
  keyword?: string;
  status?: string;
  minRent?: number;
  maxRent?: number;
  roomLayout?: string;
  buildingId?: number;
  petsAllowed?: boolean;
  instrumentsAllowed?: boolean;
  parkingAvailable?: boolean;
}

interface RentalSearchFormProps {
  onFilterChange: (filters: RentalSearchFilters) => void;
  buildings?: Array<{ building_id: number; name: string }>;
}

export function RentalSearchForm({ onFilterChange, buildings = [] }: RentalSearchFormProps) {
  const [filters, setFilters] = useState<RentalSearchFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleFilterChange = (key: keyof RentalSearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-4">
      <div 
        className="flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        <Search className="h-5 w-5 text-gray-500" />
        <h3 className="font-semibold">検索フィルター</h3>
        <span className="ml-auto text-sm text-gray-500">
          {isFormVisible ? '▲' : '▼'}
        </span>
      </div>

      {isFormVisible && (
        <div className="p-4 pt-0 border-t">

      <div className="flex items-center gap-2 mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '詳細を閉じる' : '詳細検索'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <Label>キーワード</Label>
          <Input
            placeholder="建物名、住所など"
            value={filters.keyword || ''}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
          />
        </div>

        <div>
          <Label>ステータス</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="準備中">準備中</SelectItem>
              <SelectItem value="募集中">募集中</SelectItem>
              <SelectItem value="入居中">入居中</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>建物</Label>
          <Select
            value={filters.buildingId?.toString() || 'all'}
            onValueChange={(value) => handleFilterChange('buildingId', value === 'all' ? undefined : parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {buildings.map((building) => (
                <SelectItem key={building.building_id} value={building.building_id.toString()}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 pb-3 border-t pt-3">
          <div>
            <Label>家賃（下限）</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minRent || ''}
              onChange={(e) => handleFilterChange('minRent', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <div>
            <Label>家賃（上限）</Label>
            <Input
              type="number"
              placeholder="999999"
              value={filters.maxRent || ''}
              onChange={(e) => handleFilterChange('maxRent', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <div>
            <Label>間取り</Label>
            <Input
              placeholder="1K, 1DK, 2LDK など"
              value={filters.roomLayout || ''}
              onChange={(e) => handleFilterChange('roomLayout', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="petsAllowed"
              checked={filters.petsAllowed || false}
              onCheckedChange={(checked) => handleFilterChange('petsAllowed', checked || undefined)}
            />
            <label htmlFor="petsAllowed" className="text-sm cursor-pointer">
              ペット可のみ
            </label>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="instrumentsAllowed"
              checked={filters.instrumentsAllowed || false}
              onCheckedChange={(checked) => handleFilterChange('instrumentsAllowed', checked || undefined)}
            />
            <label htmlFor="instrumentsAllowed" className="text-sm cursor-pointer">
              楽器可のみ
            </label>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="parkingAvailable"
              checked={filters.parkingAvailable || false}
              onCheckedChange={(checked) => handleFilterChange('parkingAvailable', checked || undefined)}
            />
            <label htmlFor="parkingAvailable" className="text-sm cursor-pointer">
              駐車場ありのみ
            </label>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleReset} variant="outline" className="flex-1">
          <X className="h-4 w-4 mr-2" />
          クリア
        </Button>
      </div>
        </div>
      )}
    </div>
  );
}
