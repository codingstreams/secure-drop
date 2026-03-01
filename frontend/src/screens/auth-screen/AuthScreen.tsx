import React, { useState } from 'react';
import { Ghost, Lock, Mail, User, ArrowRight, Loader2 } from 'lucide-react';
import { AuthInput } from './AuthInput';
import { SocialAuth } from './SocialAuth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { AuthRequest, SignupRequestDto } from '../../api/types/dto';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const credentials: AuthRequest = {
          identifier: formData.email,
          password: formData.password
        };
        await login(credentials);
        navigate('/vault');
      } else {

        const signupData: SignupRequestDto = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        };
        await signup(signupData);
        navigate('/vault');
      }
    } catch (err: any) {

      const message = err.response?.data?.message || err.message || "Access Denied: Invalid Credentials";
      setError(message.toUpperCase());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-6 bg-bg-main pt-12 md:pt-20">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">

        <header className="flex flex-col items-center mb-8">
          <div className="p-3 bg-bg-card rounded-2xl shadow-neo-flat text-accent-blue mb-4">
            <Ghost className={`w-8 h-8 ${isSubmitting ? 'animate-pulse' : ''}`} />
          </div>
          <h1 className="text-xl font-black tracking-[0.3em] text-text-main text-glow uppercase">
            SECURE<span className="text-text-muted font-light">DROP</span>
          </h1>
        </header>

        <div className="bg-bg-card p-6 md:p-8 rounded-3xl shadow-neo-flat border border-border-color">

          {/* Tab Switcher */}
          <div className="flex p-1 bg-bg-main rounded-xl mb-8 shadow-neo-pressed">
            {[
              { id: 'login', label: 'Access', active: isLogin },
              { id: 'signup', label: 'Onboard', active: !isLogin }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setIsLogin(tab.id === 'login');
                  setError("");
                }}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${tab.active ? 'bg-bg-card text-accent-blue shadow-sm' : 'text-text-muted'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono text-center uppercase tracking-wider animate-in shake duration-300">
              [Error]: {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleFormSubmit}>
            {!isLogin && (
              <AuthInput
                label="Full_Name"
                icon={User}
                placeholder="John Doe"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            )}

            <AuthInput
              label="Identity_Email"
              icon={Mail}
              placeholder="name@domain.com"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <AuthInput
              label="Secret_Cipher"
              icon={Lock}
              placeholder="••••••••"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-bg-main hover:bg-bg-card rounded-xl shadow-neo-flat active:shadow-neo-pressed flex items-center justify-center gap-3 group transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-accent-blue" />
              ) : (
                <>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-main group-hover:text-accent-blue">
                    {isLogin ? 'Authorize_Session' : 'Create_Identity'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 group-hover:text-accent-blue transition-all" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border-color opacity-20"></span></div>
            <div className="relative flex justify-center text-[8px] uppercase tracking-widest text-text-muted">
              <span className="bg-bg-card px-2">Secure Link Gateway</span>
            </div>
          </div>

          <SocialAuth />
        </div>

        <footer className="mt-8 text-center text-[8px] font-mono text-text-muted uppercase tracking-[0.3em] opacity-40">
          TLS_ENCRYPTED // {isSubmitting ? 'PROCESSING_PROTOCOL' : isLogin ? 'WAITING_FOR_CREDS' : 'IDENTITY_PENDING'}
        </footer>
      </div>
    </div>
  );
};

export default AuthScreen;