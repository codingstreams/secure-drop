import { createContext, useState, useEffect, useContext } from "react";
import apiClient from "../api/clients/axiosInstance";
import type { UserSummary, AuthRequest, SignupRequestDto, AuthResponse } from "../api/types/dto";
import { AuthServiceImpl } from "../api/services/auth/AuthServiceImpl";


interface AuthContextType {
  user: UserSummary | null;
  isAuthenticated: boolean;
  login: (credentials: AuthRequest) => Promise<void>;
  signup: (data: SignupRequestDto) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleAuthSuccess = (response: AuthResponse) => {
    const { accessToken, refreshToken, user: userData } = response;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    if (userData) localStorage.setItem('user', JSON.stringify(userData));

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    if (userData) setUser(userData);
  };

  const login = async (credentials: AuthRequest) => {
    try {
      const response = await AuthServiceImpl.authenticate(credentials);
      handleAuthSuccess(response);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const signup = async (data: SignupRequestDto): Promise<AuthResponse> => {
    try {
      const response = await AuthServiceImpl.signup(data);
      // Optional: Auto-login after signup
      handleAuthSuccess(response);
      return response;
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthServiceImpl.logout();
    } finally {
      // Clear storage and state regardless of server-side success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};