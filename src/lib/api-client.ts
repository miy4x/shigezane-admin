import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://shigezane-admin-functions.azurewebsites.net/api';

// APIレスポンスの型定義
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30秒タイムアウト（Azure Functionsのコールドスタート対応）
});

apiClient.interceptors.request.use(
  (config) => {
    // TODO: 認証トークンの追加
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    const url = error.config?.url || '';
    
    // 建物・駐車場マスタAPIのエラーは無視（これらのAPIは現在未実装）
    if (url.includes('getBuildings') || url.includes('getParkingLots') || 
        url.includes('buildings') || url.includes('parking-lots')) {
      console.warn('Building/ParkingLot master API not implemented yet:', url);
      return Promise.reject(error);
    }
    
    // エラーメッセージの表示
    if (error.response) {
      if (error.response.status === 404) {
        toast.error('指定されたリソースが見つかりません');
      } else if (error.response.status === 500) {
        const message = error.response.data?.error || 'サーバーエラーが発生しました';
        toast.error(message);
      }
    } else if (error.request) {
      // リクエストは送信されたがレスポンスがない（タイムアウト等）
      // タイムアウトエラーのみ表示（頻繁に表示されないように）
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error('サーバーに接続できません。時間をおいて再度お試しください。');
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;