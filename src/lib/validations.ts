import { z } from 'zod';

// 画像バリデーション
const imageSchema = z.object({
  main: z.string().url('サムネイルは必須です'),
  floorplan: z.string().url('間取り図は必須です').optional(),
  survey: z.string().url('測量図は必須です').optional(),
  layout: z.string().url('区画図は必須です').optional(),
  gallery: z.array(z.string().url()).max(10, '画像は最大10枚までです').optional()
});

// 建物スキーマ
export const buildingSchema = z.object({
  name: z.string().min(1, '建物名を入力してください'),
  address: z.string().min(1, '住所を入力してください'),
  building_age: z.number().min(0, '築年数は0以上で入力してください').max(100),
  structure: z.enum(['木造', '鉄骨', 'RC', 'SRC'], {
    errorMap: () => ({ message: '構造を選択してください' })
  }),
  total_floors: z.number().min(1, '総階数は1以上で入力してください').max(100)
});

// 賃貸スキーマ
export const rentalSchema = z.object({
  building_id: z.number().min(1, '建物を選択してください'),
  unit_number: z.string().min(1, '部屋番号を入力してください'),
  floor: z.number().min(1, '階数は1以上で入力してください').max(50),
  room_layout: z.string().min(1, '間取りを選択してください'),
  area: z.number().min(1, '面積は1以上で入力してください').max(1000),
  monthly_rent: z.number().min(0, '家賃は0以上で入力してください').max(10000000),
  management_fee: z.number().min(0, '管理費は0以上で入力してください').max(100000),
  deposit: z.number().min(0, '敷金は0以上で入力してください'),
  key_money: z.number().min(0, '礼金は0以上で入力してください'),
  parking_available: z.boolean(),
  parking_fee: z.number().min(0).optional(),
  main_direction: z.string().optional(),
  pets_allowed: z.boolean(),
  musical_instruments_allowed: z.boolean(),
  status: z.enum(['準備中', '募集中', '入居中'], {
    errorMap: () => ({ message: 'ステータスを選択してください' })
  }),
  images: imageSchema.extend({
    floorplan: z.string().url('間取り図は必須です')
  }),
  unit_features: z.array(z.string()).optional()
});

// ウィークリースキーマ
export const weeklySchema = z.object({
  building_id: z.number().min(1, '建物を選択してください'),
  unit_number: z.string().min(1, '部屋番号を入力してください'),
  floor: z.number().min(1, '階数は1以上で入力してください').max(50),
  room_layout: z.string().min(1, '間取りを選択してください'),
  area: z.number().min(1, '面積は1以上で入力してください').max(1000),
  daily_rate: z.number().min(0, '日額は0以上で入力してください').max(1000000),
  weekly_rate: z.number().min(0, '週額は0以上で入力してください').max(1000000),
  monthly_rate: z.number().min(0, '月額は0以上で入力してください').max(1000000),
  management_fee: z.number().min(0, '管理費は0以上で入力してください').max(100000),
  parking_available: z.boolean(),
  parking_fee: z.number().min(0).optional(),
  main_direction: z.string().optional(),
  pets_allowed: z.boolean(),
  musical_instruments_allowed: z.boolean(),
  status: z.enum(['準備中', '募集中', '入居中'], {
    errorMap: () => ({ message: 'ステータスを選択してください' })
  }),
  images: imageSchema.extend({
    floorplan: z.string().url('間取り図は必須です')
  }),
  unit_features: z.array(z.string()).optional()
});

// 土地スキーマ
export const landSchema = z.object({
  address: z.string().min(1, '住所を入力してください'),
  sale_price: z.number().min(0, '販売価格は0以上で入力してください').max(10000000000),
  land_area: z.number().min(1, '土地面積は1以上で入力してください').max(100000),
  zoning: z.string().min(1, '用途地域を入力してください'),
  building_coverage: z.number().min(0, '建ぺい率は0以上で入力してください').max(100),
  floor_area_ratio: z.number().min(0, '容積率は0以上で入力してください').max(1000),
  road_contact: z.string().min(1, '接道を入力してください'),
  land_category: z.string().min(1, '地目を入力してください'),
  status: z.enum(['準備中', '募集中', '成約済'], {
    errorMap: () => ({ message: 'ステータスを選択してください' })
  }),
  images: imageSchema.extend({
    survey: z.string().url('測量図は必須です')
  }),
  land_details: z.record(z.any()).optional()
});

// 住宅スキーマ
export const houseSchema = z.object({
  property_type: z.enum(['戸建', '中古マンション'], {
    errorMap: () => ({ message: '物件タイプを選択してください' })
  }),
  address: z.string().min(1, '住所を入力してください'),
  sale_price: z.number().min(0, '販売価格は0以上で入力してください').max(10000000000),
  land_area: z.number().min(1, '土地面積は1以上で入力してください').max(100000),
  building_area: z.number().min(1, '建物面積は1以上で入力してください').max(10000),
  room_layout: z.string().min(1, '間取りを入力してください'),
  building_age: z.number().min(0, '築年数は0以上で入力してください').max(100),
  structure: z.string().min(1, '構造を入力してください'),
  floor: z.number().min(1).max(100),
  status: z.enum(['準備中', '募集中', '成約済'], {
    errorMap: () => ({ message: 'ステータスを選択してください' })
  }),
  images: imageSchema.extend({
    floorplan: z.string().url('間取り図は必須です')
  }),
  house_details: z.record(z.any()).optional()
});

// 駐車場マスタスキーマ
export const parkingLotSchema = z.object({
  name: z.string().min(1, '駐車場名を入力してください'),
  address: z.string().min(1, '住所を入力してください'),
  total_spaces: z.number().min(1, '総区画数は1以上で入力してください').max(1000),
  images: imageSchema.extend({
    layout: z.string().url('区画図は必須です')
  }),
  lot_features: z.record(z.any()).optional()
});

// 駐車スペーススキーマ
export const parkingSpaceSchema = z.object({
  parking_lot_id: z.number().min(1, '駐車場を選択してください'),
  space_number: z.string().min(1, '区画番号を入力してください'),
  monthly_fee: z.number().min(0, '月額料金は0以上で入力してください').max(100000),
  vehicle_size: z.string().min(1, '車両サイズを入力してください'),
  status: z.enum(['準備中', '募集中', '契約中'], {
    errorMap: () => ({ message: 'ステータスを選択してください' })
  })
});
