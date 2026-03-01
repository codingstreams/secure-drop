import type { FileResponseDto, PageFileResponseDto, UpdateFileSettingsDto } from "../../types/dto";

export interface UserFileService {

  uploadToVault(
    file: File | Blob,
    maxDownloads: number,
    hours: number
  ): Promise<FileResponseDto>;

  listAllFiles(
    page?: number,
    size?: number,
    sort?: string[]
  ): Promise<PageFileResponseDto>;

  moveToPublicPool(accessCode: string): Promise<FileResponseDto>;

  updateSettings(
    accessCode: string,
    settings: UpdateFileSettingsDto
  ): Promise<FileResponseDto>;

  deleteFile(accessCode: string): Promise<void>;
}