import apiClient from '@/lib/api-client';
import type {
  RentalUnit,
  RentalUnitInput,
  WeeklyUnit,
  WeeklyUnitInput,
  LandProperty,
  LandPropertyInput,
  HouseProperty,
  HousePropertyInput,
  ParkingSpace,
  ParkingSpaceInput,
  Building,
  BuildingInput,
  ParkingLot,
  ParkingLotInput,
} from '@/types/property';

// 賃貸API
export const rentalApi = {
  getAll: () => apiClient.get<RentalUnit[]>('/getrentalunits').then((res) => res.data),
  getById: (id: number) => apiClient.get<RentalUnit>(`/api/admin/rental/${id}`).then((res) => res.data),
  create: (data: RentalUnitInput) => apiClient.post<RentalUnit>('/api/admin/rental', data).then((res) => res.data),
  update: (id: number, data: Partial<RentalUnitInput>) =>
    apiClient.put<RentalUnit>(`/api/admin/rental/${id}`, data).then((res) => res.data),
  delete: (id: number) => apiClient.delete(`/api/admin/rental/${id}`).then((res) => res.data),
};

// ウィークリーAPI
export const weeklyApi = {
  getAll: () => apiClient.get<WeeklyUnit[]>('/getweeklyunits').then((res) => res.data),
  getById: (id: number) => apiClient.get<WeeklyUnit>(`/api/admin/weekly/${id}`).then((res) => res.data),
  create: (data: WeeklyUnitInput) => apiClient.post<WeeklyUnit>('/api/admin/weekly', data).then((res) => res.data),
  update: (id: number, data: Partial<WeeklyUnitInput>) =>
    apiClient.put<WeeklyUnit>(`/api/admin/weekly/${id}`, data).then((res) => res.data),
  delete: (id: number) => apiClient.delete(`/api/admin/weekly/${id}`).then((res) => res.data),
};

// 土地API
export const landApi = {
  getAll: () => apiClient.get<LandProperty[]>('/getlandproperties').then((res) => res.data),
  getById: (id: number) => apiClient.get<LandProperty>(`/api/admin/land/${id}`).then((res) => res.data),
  create: (data: LandPropertyInput) => apiClient.post<LandProperty>('/api/admin/land', data).then((res) => res.data),
  update: (id: number, data: Partial<LandPropertyInput>) =>
    apiClient.put<LandProperty>(`/api/admin/land/${id}`, data).then((res) => res.data),
  delete: (id: number) => apiClient.delete(`/api/admin/land/${id}`).then((res) => res.data),
};

// 住宅API
export const houseApi = {
  getAll: () => apiClient.get<HouseProperty[]>('/gethouseproperties').then((res) => res.data),
  getById: (id: number) => apiClient.get<HouseProperty>(`/api/admin/house/${id}`).then((res) => res.data),
  create: (data: HousePropertyInput) => apiClient.post<HouseProperty>('/api/admin/house', data).then((res) => res.data),
  update: (id: number, data: Partial<HousePropertyInput>) =>
    apiClient.put<HouseProperty>(`/api/admin/house/${id}`, data).then((res) => res.data),
  delete: (id: number) => apiClient.delete(`/api/admin/house/${id}`).then((res) => res.data),
};

// 駐車場API
export const parkingApi = {
  getAll: () => apiClient.get<ParkingSpace[]>('/getparkingspaces').then((res) => res.data),
  getById: (id: number) => apiClient.get<ParkingSpace>(`/api/admin/parking/${id}`).then((res) => res.data),
  create: (data: ParkingSpaceInput) => apiClient.post<ParkingSpace>('/api/admin/parking', data).then((res) => res.data),
  update: (id: number, data: Partial<ParkingSpaceInput>) =>
    apiClient.put<ParkingSpace>(`/api/admin/parking/${id}`, data).then((res) => res.data),
  delete: (id: number) => apiClient.delete(`/api/admin/parking/${id}`).then((res) => res.data),
};

// 建物マスタAPI
export const buildingApi = {
  getAll: () => apiClient.get<Building[]>('/api/admin/buildings').then((res) => res.data),
  create: (data: BuildingInput) => apiClient.post<Building>('/api/admin/buildings', data).then((res) => res.data),
};

// 駐車場マスタAPI
export const parkingLotApi = {
  getAll: () => apiClient.get<ParkingLot[]>('/api/admin/parking-lots').then((res) => res.data),
  create: (data: ParkingLotInput) => apiClient.post<ParkingLot>('/api/admin/parking-lots', data).then((res) => res.data),
};

// 画像アップロードAPI（ダミー）
export const uploadApi = {
  getSasToken: () =>
    apiClient.post<{ sasToken: string; url: string }>('/api/admin/upload/sas-token').then((res) => res.data),
  uploadImage: async (file: File): Promise<string> => {
    // TODO: 本番環境ではBlob Storageへアップロード
    // 現在はダミーURLを返す
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://placeholder.co/600x400/5AB9CE/white?text=${file.name}`);
      }, 500);
    });
  },
};
