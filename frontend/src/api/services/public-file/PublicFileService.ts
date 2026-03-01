import type { FileResponseDto } from "../../types/dto";

export interface PublicFileService {

  uploadAnonymous(file: File | Blob, hours?: number, onProgress?: (percent: number) => void): Promise<FileResponseDto>;

  getFileMetadata(accessCode: string): Promise<FileResponseDto>;

  downloadFile(accessCode: string): Promise<Blob>;
}