import type { SignupRequestDto, AuthResponse, AuthRequest, OtpRequest } from "../../types/dto";

export interface AuthService {

  signup(data: SignupRequestDto): Promise<AuthResponse>;

  authenticate(credentials: AuthRequest): Promise<AuthResponse>;

  refreshToken(token: string): Promise<AuthResponse>;

  initPasswordless(request: OtpRequest): Promise<void>;

  getPasskeyRegistrationOptions(email: string): Promise<string>;

  verifyPasskeyRegistration(passkeyJson: string): Promise<void>;

  logout(): Promise<void>;
}