import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // ウィンドウフォーカス時に再取得しない
      refetchOnMount: true, // マウント時に再取得
      refetchOnReconnect: true, // 再接続時に再取得
      retry: 1, // 失敗時に1回のみリトライ（エラーを早く諦める）
      retryDelay: 1000, // 1秒後にリトライ
      staleTime: 10 * 60 * 1000, // 10分（データが頻繁に変わらないので長め）
      gcTime: 15 * 60 * 1000, // 15分（キャッシュ保持時間）
    },
    mutations: {
      retry: 0, // ミューテーションはリトライしない
    }
  }
});
