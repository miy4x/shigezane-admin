import { BlobServiceClient } from "@azure/storage-blob";
import imageCompression from "browser-image-compression";
import { apiClient } from "./api-client";

interface SasTokenResponse {
  sasToken: string;
  accountName: string;
  containerName: string;
  expiresOn: string;
}

export const uploadImage = async (
  file: File, 
  maxSize: number = 1, 
  maxWidthOrHeight: number = 1920
): Promise<string> => {
  // 1. Resize/Compress
  const options = {
    maxSizeMB: maxSize,
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
    fileType: "image/jpeg",
    initialQuality: 0.85
  };

  try {
    const compressedFile = await imageCompression(file, options);
    
    // 2. Get SAS Token
    const sasResponse = await apiClient.post<{ success: boolean; data: SasTokenResponse }>('/upload/sas-token');
    
    // Check for nested data structure depending on how axios and backend returns
    // apiClient returns the response object, so data property has the body.
    // The backend returns { success: true, data: { ... } }
    // So sasResponse.data is { success: true, data: ... }
    
    if (!sasResponse.data.success) {
       throw new Error("Failed to get SAS token");
    }
    const { sasToken, accountName, containerName } = sasResponse.data.data;

    // 3. Upload using BlobServiceClient
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Generate filename: image_{timestamp}_{random}.{ext}
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    // Force extension to jpg/jpeg as we compress to jpeg, or keep original?
    // browser-image-compression might change type to image/jpeg if fileType is set.
    const ext = 'jpg'; 
    const fileName = `image_${timestamp}_${random}.${ext}`;

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    
    await blockBlobClient.uploadData(compressedFile, {
        blobHTTPHeaders: {
            blobContentType: compressedFile.type
        }
    });

    // 4. Return Blob URL (without SAS)
    const urlObj = new URL(blockBlobClient.url);
    urlObj.search = '';
    return urlObj.toString();

  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
    // If it's a blob: URL (local preview), ignore
    if (imageUrl.startsWith('blob:')) return;

    try {
        await apiClient.delete(`/images?url=${encodeURIComponent(imageUrl)}`);
    } catch (error) {
        console.error("Delete error:", error);
        throw error;
    }
}
