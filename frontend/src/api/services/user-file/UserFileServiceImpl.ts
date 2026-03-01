import apiClient from "../../clients/axiosInstance";
import type { FileResponseDto, PageFileResponseDto, UpdateFileSettingsDto } from "../../types/dto";
import type { UserFileService } from "./UserFileService";

export const UserFileServiceImpl: UserFileService = {

  async uploadToVault(file: File | Blob, maxDownloads: number, hours: number): Promise<FileResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<FileResponseDto>('/files/upload', formData, {
      params: { maxDownloads, hours },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async listAllFiles(page = 0, size = 20, sort?: string[]): Promise<PageFileResponseDto> {
    const response = await apiClient.get<PageFileResponseDto>('/files/', {
      params: {
        page,
        size,
        sort,
      },
    });
    return response.data;
  },

  async moveToPublicPool(accessCode: string): Promise<FileResponseDto> {
    const response = await apiClient.post<FileResponseDto>(`/files/${accessCode}/publish`);
    return response.data;
  },

  async updateSettings(accessCode: string, settings: UpdateFileSettingsDto): Promise<FileResponseDto> {
    const response = await apiClient.patch<FileResponseDto>(`/files/${accessCode}/settings`, settings);
    return response.data;
  },

  async deleteFile(accessCode: string): Promise<void> {
    await apiClient.delete(`/files/${accessCode}`);
  },
};