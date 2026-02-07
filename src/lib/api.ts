import apiClient, { type ApiResponse } from '@/lib/api-client';
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
  getAll: () => apiClient.get<ApiResponse<RentalUnit[]>>('/getRentalUnits').then((res) => res.data.data),
  getById: (id: number) => apiClient.get<ApiResponse<RentalUnit>>(`/getRental/${id}`).then((res) => res.data.data),
  create: (data: RentalUnitInput) => apiClient.post<ApiResponse<RentalUnit>>('/createRental', data).then((res) => res.data.data),
  update: (id: number, data: Partial<RentalUnitInput>) =>
    apiClient.put<ApiResponse<RentalUnit>>(`/updateRental/${id}`, data).then((res) => res.data.data),
  delete: (id: number) => apiClient.delete<ApiResponse<void>>(`/deleteRental/${id}`).then((res) => res.data),
};

// ウィークリーAPI
export const weeklyApi = {
  getAll: () => apiClient.get<ApiResponse<WeeklyUnit[]>>('/getWeeklyUnits').then((res) => res.data.data),
  getById: (id: number) => apiClient.get<ApiResponse<WeeklyUnit>>(`/getWeekly/${id}`).then((res) => res.data.data),
  create: (data: WeeklyUnitInput) => apiClient.post<ApiResponse<WeeklyUnit>>('/createWeekly', data).then((res) => res.data.data),
  update: (id: number, data: Partial<WeeklyUnitInput>) =>
    apiClient.put<ApiResponse<WeeklyUnit>>(`/updateWeekly/${id}`, data).then((res) => res.data.data),
  delete: (id: number) => apiClient.delete<ApiResponse<void>>(`/deleteWeekly/${id}`).then((res) => res.data),
};

// 土地API
export const landApi = {
  getAll: () => apiClient.get<ApiResponse<LandProperty[]>>('/getLandProperties').then((res) => res.data.data),
  getById: (id: number) => apiClient.get<ApiResponse<LandProperty>>(`/getLand/${id}`).then((res) => res.data.data),
  create: (data: LandPropertyInput) => apiClient.post<ApiResponse<LandProperty>>('/createLand', data).then((res) => res.data.data),
  update: (id: number, data: Partial<LandPropertyInput>) =>
    apiClient.put<ApiResponse<LandProperty>>(`/updateLand/${id}`, data).then((res) => res.data.data),
  delete: (id: number) => apiClient.delete<ApiResponse<void>>(`/deleteLand/${id}`).then((res) => res.data),
};

// 住宅API
export const houseApi = {
  getAll: () => apiClient.get<ApiResponse<HouseProperty[]>>('/getHouseProperties').then((res) => res.data.data),
  getById: (id: number) => apiClient.get<ApiResponse<HouseProperty>>(`/getHouse/${id}`).then((res) => res.data.data),
  create: (data: HousePropertyInput) => apiClient.post<ApiResponse<HouseProperty>>('/createHouse', data).then((res) => res.data.data),
  update: (id: number, data: Partial<HousePropertyInput>) =>
    apiClient.put<ApiResponse<HouseProperty>>(`/updateHouse/${id}`, data).then((res) => res.data.data),
  delete: (id: number) => apiClient.delete<ApiResponse<void>>(`/deleteHouse/${id}`).then((res) => res.data),
};

// 駐車場API
export const parkingApi = {
  getAll: () => apiClient.get<ApiResponse<ParkingSpace[]>>('/getParkingSpaces').then((res) => res.data.data),
  getById: (id: number) => apiClient.get<ApiResponse<ParkingSpace>>(`/getParking/${id}`).then((res) => res.data.data),
  create: (data: ParkingSpaceInput) => apiClient.post<ApiResponse<ParkingSpace>>('/createParking', data).then((res) => res.data.data),
  update: (id: number, data: Partial<ParkingSpaceInput>) =>
    apiClient.put<ApiResponse<ParkingSpace>>(`/updateParking/${id}`, data).then((res) => res.data.data),
  delete: (id: number) => apiClient.delete<ApiResponse<void>>(`/deleteParking/${id}`).then((res) => res.data),
};

// 建物マスタAPI
export const buildingApi = {
  getAll: () => apiClient.get<ApiResponse<Building[]>>('/getBuildings').then((res) => res.data.data),
  create: (data: BuildingInput) => apiClient.post<ApiResponse<Building>>('/createBuilding', data).then((res) => res.data.data),
};

// 駐車場マスタAPI
export const parkingLotApi = {
  getAll: () => apiClient.get<ApiResponse<ParkingLot[]>>('/getParkingLots').then((res) => res.data.data),
  create: (data: ParkingLotInput) => apiClient.post<ApiResponse<ParkingLot>>('/createParkingLot', data).then((res) => res.data.data),
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
