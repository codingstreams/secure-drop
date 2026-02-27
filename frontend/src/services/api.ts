import axios from 'axios';
import { API_CONFIG } from './config';

export interface UploadResponse {
    downloadUrl: string;
    accessCode: string;
    fileName: string;
    expiresAt: string;
}

export interface DownloadResponse {
    resource: string;
    contentType: string;
    originalFileName: string;
}

export interface FileAPI {
    uploadFile(file: File, onProgress: (percent: number) => void): Promise<UploadResponse>;
    downloadFile(code: string): Promise<void>;
}

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 2. Type the function parameters and return types
export const uploadFile = async (
    file: File,
    onProgress: (percent: number) => void
): Promise<UploadResponse> => {
    console.log(API_CONFIG.BASE_URL);

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadResponse>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percent);
            }
        },
    });

    return response.data;
};


export const downloadFile = async (code: string): Promise<void> => {
    // 1. Request the file as a BLOB (Binary Large Object)
    const response = await api.get(`/download/${code}`, {
        responseType: 'blob',
    });

    console.log(response)

    // 2. Extract filename from headers (e.g., "attachment; filename=\"image.png\"")
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'downloaded-file';

    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
            filename = filenameMatch[1];
        }
    }

    // 3. Create a temporary download URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // 4. Trigger the download manually
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // Set the filename
    document.body.appendChild(link);
    link.click();

    // 5. Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
};

export default api;