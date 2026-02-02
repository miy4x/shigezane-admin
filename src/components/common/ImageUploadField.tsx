import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageUploadFieldProps {
  name: string;
  value?: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export function ImageUploadField({ name, value, onChange, required }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  // 画像アップロード処理（現状はダミー）
  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      // 1. 画像圧縮
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      
      // 注意: mock環境などでWebWorkerが動かない場合は圧縮をスキップするなどのハンドリングが必要
      // 今回は圧縮を試みる
      let fileToUpload = file;
      try {
        fileToUpload = await imageCompression(file, options);
      } catch (e) {
        console.warn('Image compression failed, using original file', e);
      }

      // 2. アップロード (ダミー実装)
      // 本番ではここでAzure Blob StorageなどにアップロードしてURLを取得
      // const formData = new FormData();
      // formData.append('file', fileToUpload);
      // const res = await uploadApi.upload(formData);
      
      // ダミーラグ
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // ダミーURL生成
      const dummyUrl = URL.createObjectURL(fileToUpload);
      
      onChange(dummyUrl);
      toast.success('画像をアップロードしました');
    } catch (error) {
      console.error(error);
      toast.error('画像のアップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  if (value) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-gray-100">
        <img src={value} alt="Preview" className="w-full h-full object-contain" />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => onChange('')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="file"
        id={name}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={uploading}
      />
      <label
        htmlFor={name}
        className={`
          flex flex-col items-center justify-center w-full aspect-video
          border-2 border-dashed rounded-lg cursor-pointer
          transition-colors
          ${uploading ? 'bg-gray-100 border-gray-300' : 'hover:bg-gray-50 border-gray-300 hover:border-[#5AB9CE]'}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <div className="animate-pulse flex flex-col items-center">
              <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
              <p className="text-sm text-gray-500">アップロード中...</p>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">クリックしてアップロード</span>
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WebP (最大 10MB)
              </p>
              {required && <span className="text-red-500 text-xs mt-1">* 必須</span>}
            </>
          )}
        </div>
      </label>
    </div>
  );
}

interface MultiImageUploadFieldProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function MultiImageUploadField({ value = [], onChange, maxFiles = 10 }: MultiImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList) => {
    if (value.length + files.length > maxFiles) {
      toast.error(`画像は最大${maxFiles}枚までです`);
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 圧縮等の処理は単体と同じ（省略）
        const dummyUrl = URL.createObjectURL(file); // 本来はアップロード後のURL
        newUrls.push(dummyUrl);
      }
      
      onChange([...value, ...newUrls]);
    } catch (error) {
      toast.error('アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newValues = [...value];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-gray-100">
            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => removeImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {value.length < maxFiles && (
          <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 border-gray-300 hover:border-[#5AB9CE]">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
              disabled={uploading}
            />
            <PlusIcon />
          </label>
        )}
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
