import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; kind?: 'invalid_credentials' | 'permission' | 'unknown'; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isPermissionError(e: any): boolean {
  const code = typeof e?.code === 'string' ? e.code : '';
  const message = typeof e?.message === 'string' ? e.message.toLowerCase() : '';
  return (
    code === '42501' || // insufficient_privilege
    message.includes('row level security') ||
    message.includes('rls') ||
    message.includes('permission denied') ||
    message.includes('not authorized')
  );
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // التحقق من حالة تسجيل الدخول عند تحميل التطبيق
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // التحقق من وجود session token في localStorage
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        // IMPORTANT: With RLS enabled, the frontend must NOT query `user_sessions` directly.
        // Validate via SECURITY DEFINER RPC.
        const { data, error } = await supabase.rpc('validate_session', { p_session_token: sessionToken });
        const row = Array.isArray(data) ? data[0] : (data as any);
        const isValid = row?.is_valid === true;

        if (!error && isValid) {
          setIsAuthenticated(true);
        } else {
          // Session غير صالحة أو منتهية
          localStorage.removeItem('sessionToken');
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; kind?: 'invalid_credentials' | 'permission' | 'unknown'; error?: string }> => {
    try {
      setIsLoading(true);
      
      // IMPORTANT: With RLS enabled, the frontend must NOT read from `users` or write to `user_sessions`.
      // Use the SECURITY DEFINER login RPC.
      const { data, error } = await supabase.rpc('login_with_password', {
        p_username: username,
        p_password: password,
      });

      if (error) {
        const msg = typeof (error as any)?.message === 'string' ? (error as any).message : '';
        if (msg.includes('invalid_credentials')) {
          return { success: false, kind: 'invalid_credentials' };
        }
        if (isPermissionError(error)) {
          return {
            success: false,
            kind: 'permission',
            error: 'Database permissions are misconfigured (RLS).',
          };
        }
        return { success: false, kind: 'unknown', error: error.message };
      }

      const row = Array.isArray(data) ? data[0] : (data as any);
      const sessionToken = row?.session_token as string | undefined;

      if (!sessionToken) {
        return { success: false, kind: 'unknown', error: 'Login RPC did not return a session token.' };
      }

      localStorage.setItem('sessionToken', sessionToken);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      if (isPermissionError(error)) {
        return {
          success: false,
          kind: 'permission',
          error: 'Database permissions are misconfigured (RLS).',
        };
      }
      return { success: false, kind: 'unknown', error: 'Unexpected login error' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        // IMPORTANT: With RLS enabled, do not delete directly from `user_sessions`.
        await supabase.rpc('logout_session', { p_session_token: sessionToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sessionToken');
      setIsAuthenticated(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        return { success: false, error: 'يجب تسجيل الدخول أولاً' };
      }

      // التحقق من طول كلمة المرور الجديدة
      if (newPassword.length < 6) {
        return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
      }

      // التحقق من أن كلمة المرور الجديدة مختلفة
      if (currentPassword === newPassword) {
        return { success: false, error: 'كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية' };
      }

      // IMPORTANT: With RLS enabled, change password via SECURITY DEFINER RPC.
      const { error } = await supabase.rpc('change_password_with_session', {
        p_session_token: sessionToken,
        p_current_password: currentPassword,
        p_new_password: newPassword,
      });

      if (error) {
        const msg = typeof (error as any)?.message === 'string' ? (error as any).message : '';
        if (msg.includes('invalid_current_password')) {
          return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
        }
        if (msg.includes('password_too_short')) {
          return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
        }
        if (msg.includes('invalid_session')) {
          return { success: false, error: 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.' };
        }
        return { success: false, error: 'فشل تحديث كلمة المرور' };
      }

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'حدث خطأ أثناء تحديث كلمة المرور' };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
