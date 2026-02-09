import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface LandSearchFilters {
  keyword?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  zoning?: string;
}

interface LandSearchFormProps {
  onFilterChange: (filters: LandSearchFilters) => void;
}

export function LandSearchForm({ onFilterChange }: LandSearchFormProps) {
  const [filters, setFilters] = useState<LandSearchFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleFilterChange = (key: keyof LandSearchFilters, value: any) => {
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
            placeholder="住所など"
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
              <SelectItem value="成約済">成約済</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>用途地域</Label>
          <Input
            placeholder="第一種住居地域など"
            value={filters.zoning || ''}
            onChange={(e) => handleFilterChange('zoning', e.target.value)}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 pb-3 border-t pt-3">
          <div>
            <Label>価格（下限）</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <div>
            <Label>価格（上限）</Label>
            <Input
              type="number"
              placeholder="999999999"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <div>
            <Label>面積（下限）㎡</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minArea || ''}
              onChange={(e) => handleFilterChange('minArea', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>

          <div>
            <Label>面積（上限）㎡</Label>
            <Input
              type="number"
              placeholder="99999"
              value={filters.maxArea || ''}
              onChange={(e) => handleFilterChange('maxArea', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
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
