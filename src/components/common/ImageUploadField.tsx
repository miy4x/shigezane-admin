import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadImage, deleteImage } from '@/lib/upload';

interface ImageUploadFieldProps {
  name: string;
  value?: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export function ImageUploadField({ name, value, onChange, required }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      // Determine size based on name
      // images.main -> 1920, images.floorplan -> 1200
      const isFloorplan = name.includes('floorplan');
      const maxWidth = isFloorplan ? 1200 : 1920;

      // 古い画像を削除
      if (value) {
        // deleteImage handles blob: check internally to ignore it
        await deleteImage(value);
      }

      const url = await uploadImage(file, 1, maxWidth);
      
      onChange(url);
      toast.success('画像をアップロードしました');
    } catch (error) {
      console.error(error);
      toast.error('画像のアップロードに失敗しました');
    } finally {
      // Clear input value to allow re-selection of same file if needed/failed? 
      // Actually standard file input behavior.
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (value) {
      try {
        setUploading(true);
        await deleteImage(value);
        onChange('');
        toast.success('画像を削除しました');
      } catch (error) {
        console.error(error);
        toast.error('画像の削除に失敗しました');
      } finally {
        setUploading(false);
      }
    }
  };

  if (value) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
        <img
          src={value}
          alt="Uploaded image"
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
            <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={handleDelete}
                disabled={uploading}
            >
                {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <X className="h-4 w-4" />
                )}
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type="file"
        id={`upload-${name}`}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label
        htmlFor={`upload-${name}`}
        className={`flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? (
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
            <div className="rounded-full bg-background p-3 shadow-sm">
              <Upload className="h-6 w-6" />
            </div>
            <div className="text-sm">
              <span className="font-semibold text-primary">クリックしてアップロード</span>
            </div>
            <p className="text-xs">JPEG, PNG, WebP (最大10MB)</p>
          </div>
        )}
      </label>
      {required && !value && (
         <p className="mt-2 text-xs text-destructive">画像は必須です</p>
      )}
    </div>
  );
}

interface MultiImageUploadFieldProps {
  name: string;
  value?: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function MultiImageUploadField({ name, value = [], onChange, maxFiles = 10 }: MultiImageUploadFieldProps) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        
        if (value.length + files.length > maxFiles) {
            toast.error(`画像は最大${maxFiles}枚までです`);
            return;
        }

        try {
            setUploading(true);
            // Default max size for gallery, maybe 1920?
            const uploadPromises = files.map(file => uploadImage(file, 1, 1920));
            const newUrls = await Promise.all(uploadPromises);
            onChange([...value, ...newUrls]);
            toast.success(`${newUrls.length}枚の画像をアップロードしました`);
        } catch (error) {
            console.error(error);
            toast.error('画像のアップロードに失敗しました');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleRemove = async (index: number) => {
        const urlToRemove = value[index];
        
        try {
           setUploading(true);
           await deleteImage(urlToRemove);
           
           const newUrls = [...value];
           newUrls.splice(index, 1);
           onChange(newUrls);
           toast.success('画像を削除しました');
        } catch(e) {
            console.error(e);
            toast.error('画像の削除に失敗しました');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {value.map((url, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                        <img src={url} alt={`Gallery ${index}`} className="h-full w-full object-cover" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => handleRemove(index)}
                            disabled={uploading}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
                
                {value.length < maxFiles && (
                    <div className="relative aspect-video w-full">
                        <input
                            type="file"
                            multiple
                            id={`upload-${name}`}
                            className="hidden"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        <label
                           htmlFor={`upload-${name}`}
                           className={`flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            ) : (
                                <Upload className="h-6 w-6 text-muted-foreground" />
                            )}
                        </label>
                    </div>
                )}
             </div>
        </div>
    );
}
