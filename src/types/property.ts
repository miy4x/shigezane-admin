// 画像構造
export interface PropertyImages {
  main: string;
  floorplan?: string;
  survey?: string;
  layout?: string;
  gallery?: string[];
}

// 建物マスタ
export interface Building {
  building_id: number;
  name: string;
  address: string;
  building_age: number;
  structure: '木造' | '鉄骨' | 'RC' | 'SRC';
  total_floors: number;
  created_at?: string;
  updated_at?: string;
}

// 賃貸部屋
export interface RentalUnit {
  unit_id: number;
  building_id: number;
  building_name?: string;
  building_address?: string;
  unit_number: string;
  floor: number;
  room_layout: string;
  area: number;
  monthly_rent: number;
  management_fee: number;
  deposit: number;
  key_money: number;
  parking_fee?: number;
  parking_available: boolean;
  main_direction?: string;
  pets_allowed: boolean;
  musical_instruments_allowed: boolean;
  status: '準備中' | '募集中' | '入居中';
  images: PropertyImages;
  unit_features?: string[];
  remarks?: string;
  created_at?: string;
  updated_at?: string;
}

// ウィークリー部屋
export interface WeeklyUnit {
  weekly_unit_id: number;
  building_id: number;
  building_name?: string;
  building_address?: string;
  unit_number: string;
  floor: number;
  room_layout: string;
  area: number;
  daily_rate: number;
  weekly_rate: number;
  monthly_rate: number;
  management_fee: number;
  parking_fee?: number;
  parking_available: boolean;
  main_direction?: string;
  pets_allowed: boolean;
  musical_instruments_allowed: boolean;
  status: '準備中' | '募集中' | '入居中';
  images: PropertyImages;
  unit_features?: string[];
  remarks?: string;
  created_at?: string;
  updated_at?: string;
}

// 土地
export interface LandProperty {
  land_id: number;
  address: string;
  sale_price: number;
  land_area: number;
  zoning: string;
  building_coverage: number;
  floor_area_ratio: number;
  road_contact: string;
  land_category: string;
  status: '準備中' | '募集中' | '成約済';
  images: PropertyImages;
  land_details?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// 住宅
export interface HouseProperty {
  house_id: number;
  property_type: '戸建' | '中古マンション';
  address: string;
  sale_price: number;
  land_area: number;
  building_area: number;
  room_layout: string;
  building_age: number;
  structure: string;
  floor: number;
  status: '準備中' | '募集中' | '成約済';
  images: PropertyImages;
  house_details?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// 駐車場マスタ
export interface ParkingLot {
  parking_lot_id: number;
  name: string;
  address: string;
  total_spaces: number;
  images: PropertyImages;
  lot_features?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// 駐車スペース
export interface ParkingSpace {
  parking_space_id: number;
  parking_lot_id: number;
  parking_lot_name?: string;
  parking_lot_address?: string;
  space_number: string;
  monthly_fee: number;
  vehicle_size: string;
  status: '準備中' | '募集中' | '契約中';
  created_at?: string;
  updated_at?: string;
}

// フォーム入力用型
export type RentalUnitInput = Omit<RentalUnit, 'unit_id' | 'created_at' | 'updated_at' | 'building_name' | 'building_address'>;
export type WeeklyUnitInput = Omit<WeeklyUnit, 'weekly_unit_id' | 'created_at' | 'updated_at' | 'building_name' | 'building_address'>;
export type LandPropertyInput = Omit<LandProperty, 'land_id' | 'created_at' | 'updated_at'>;
export type HousePropertyInput = Omit<HouseProperty, 'house_id' | 'created_at' | 'updated_at'>;
export type ParkingSpaceInput = Omit<ParkingSpace, 'parking_space_id' | 'created_at' | 'updated_at' | 'parking_lot_name' | 'parking_lot_address'>;
export type BuildingInput = Omit<Building, 'building_id' | 'created_at' | 'updated_at'>;
export type ParkingLotInput = Omit<ParkingLot, 'parking_lot_id' | 'created_at' | 'updated_at'>;
