import apiClient from "../../clients/axiosInstance";
import type { FileResponseDto } from "../../types/dto";
import type { PublicFileService } from "./PublicFileService";

export const PublicFileServiceImpl: PublicFileService = {

  async uploadAnonymous(file: File | Blob, hours: number = 24, onProgress?: (percent: number) => void): Promise<FileResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<FileResponseDto>('/public/files/upload', formData, {
      params: { hours },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Axios progress tracking logic
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },


  async getFileMetadata(accessCode: string): Promise<FileResponseDto> {
    const response = await apiClient.get<FileResponseDto>(`/public/files/${accessCode}/meta`);
    return response.data;
  },


  async downloadFile(accessCode: string): Promise<Blob> {
    const response = await apiClient.get<Blob>(`/public/files/${accessCode}/download`, {
      responseType: 'blob', // Crucial for binary data
    });
    return response.data;
  },
};