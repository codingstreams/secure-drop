import apiClient from "../../clients/axiosInstance";
import type { SignupRequestDto, AuthResponse, AuthRequest, OtpRequest } from "../../types/dto";
import type { AuthService } from "./AuthService";

export const AuthServiceImpl: AuthService = {

  async signup(data: SignupRequestDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },


  async authenticate(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', null, {
      params: { refreshToken }
    });
    return response.data;
  },

  async initPasswordless(request: OtpRequest): Promise<void> {
    await apiClient.post('/auth/passwordless/init', request);
  },


  async getPasskeyRegistrationOptions(email: string): Promise<string> {
    const response = await apiClient.get<string>('/auth/passkey/register/options', {
      params: { email }
    });
    return response.data;
  },

  async verifyPasskeyRegistration(passkeyJson: string): Promise<void> {
    await apiClient.post('/auth/passkey/register/verify', passkeyJson, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
};