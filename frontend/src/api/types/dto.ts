export const StorageMode = {
  PUBLIC_POOL: 'PUBLIC_POOL',
  PRIVATE_VAULT: 'PRIVATE_VAULT'
} as const;

export type StorageMode = typeof StorageMode[keyof typeof StorageMode];

export interface FileResponseDto {
  accessCode: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  mode: StorageMode;
  shareUrl: string;
  expiresAt: string; // ISO Date String
  maxDownloads: number;
  currentDownloads: number;
  ownerId: string;
}

export interface UserSummary {
  username?: string;
  email?: string;
  publicKey?: string;
  roles?: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: string; // ISO Date-Time String
  user?: UserSummary;
}

/**
 * Request Payloads
 */
export interface SignupRequestDto {
  fullName?: string;
  email?: string;
  password?: string;
  publicKey?: string;
}

export interface AuthRequest {
  identifier?: string;
  password?: string;
  otpCode?: string;
  passkeyData?: PasskeyAuthData;
  oauthProvider?: string;
  providerToken?: string;
}

export interface PasskeyAuthData {
  id?: string;
  rawId?: string;
  clientDataJSON?: string;
  authenticatorData?: string;
  signature?: string;
  userHandle?: string;
}

export interface OtpRequest {
  identifier?: string;
  channel?: string;
}

export interface UpdateFileSettingsDto {
  mode?: StorageMode;
  expiresInHours?: number;
  maxDownloads?: number;
}

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableObject {
  offset: number;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  sort: SortObject;
  unpaged: boolean;
}

export interface PageFileResponseDto {
  totalElements: number;
  totalPages: number;
  size: number;
  content: FileResponseDto[];
  number: number;
  numberOfElements: number;
  pageable: PageableObject;
  sort: SortObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}