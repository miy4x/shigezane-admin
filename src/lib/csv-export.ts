/**
 * CSVエクスポートユーティリティ
 */

/**
 * オブジェクトの配列をCSV文字列に変換
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) {
    return '';
  }

  // ヘッダー行
  const headers = columns.map((col) => col.label).join(',');

  // データ行
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        const value = item[col.key];
        // 値の処理
        if (value === null || value === undefined) {
          return '';
        }
        // Boolean値の変換
        if (typeof value === 'boolean') {
          return value ? 'あり' : 'なし';
        }
        // 配列の場合はカンマ区切りで結合
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`;
        }
        // オブジェクトの場合はJSON文字列化
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // 文字列の場合はエスケープ
        const strValue = String(value);
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      })
      .join(',');
  });

  return [headers, ...rows].join('\n');
}

/**
 * CSVファイルをダウンロード
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // BOM付きUTF-8でエンコード（Excelで文字化けしないように）
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 現在の日時をファイル名に使える形式で取得
 */
export function getTimestamp(): string {
  const now = new Date();
  return now
    .toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/[/:\s]/g, '-');
}
