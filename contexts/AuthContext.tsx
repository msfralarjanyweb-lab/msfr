import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default credentials - يمكن تغييرها لاحقاً
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

// دالة بسيطة لمقارنة كلمات المرور (للاستخدام المؤقت)
// في الإنتاج، يجب استخدام bcrypt أو Supabase Auth
function simplePasswordCompare(inputPassword: string, storedPassword: string): boolean {
  // للتبسيط، نستخدم مقارنة مباشرة
  // في الإنتاج، يجب استخدام bcrypt.compare()
  return inputPassword === storedPassword;
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
        // التحقق من صحة الـ session في قاعدة البيانات
        const { data, error } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('session_token', sessionToken)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (data && !error) {
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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // البحث عن المستخدم في قاعدة البيانات
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !user) {
        // إذا لم يوجد المستخدم، نستخدم البيانات الافتراضية كـ fallback
        if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
          // إنشاء session مؤقت
          const sessionToken = generateSessionToken();
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24); // 24 ساعة

          localStorage.setItem('sessionToken', sessionToken);
          setIsAuthenticated(true);
          setIsLoading(false);
          return true;
        }
        setIsLoading(false);
        return false;
      }

      // مقارنة كلمة المرور
      // ملاحظة: في الإنتاج، يجب استخدام bcrypt.compare()
      // للتبسيط، نستخدم مقارنة مباشرة (يجب تحديثها لاستخدام bcrypt)
      const passwordMatch = simplePasswordCompare(password, user.password_hash) || 
                           (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD);

      if (passwordMatch) {
        // إنشاء session جديد
        const sessionToken = generateSessionToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 ساعة

        // حفظ الـ session في قاعدة البيانات
        await supabase
          .from('user_sessions')
          .insert({
            user_id: user.id,
            session_token: sessionToken,
            expires_at: expiresAt.toISOString(),
          });

        localStorage.setItem('sessionToken', sessionToken);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        // حذف الـ session من قاعدة البيانات
        await supabase
          .from('user_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sessionToken');
      setIsAuthenticated(false);
    }
  };

  // دالة لإنشاء session token عشوائي
  const generateSessionToken = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // التحقق من كلمة المرور الحالية
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

      // الحصول على معلومات المستخدم من الـ session
      const { data: sessionData, error: sessionError } = await supabase
        .from('user_sessions')
        .select('user_id')
        .eq('session_token', sessionToken)
        .single();

      let user = null;
      let userError = null;

      // إذا كان هناك user_id في session، احصل على بيانات المستخدم
      if (sessionData && sessionData.user_id) {
        const result = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionData.user_id)
          .single();
        user = result.data;
        userError = result.error;
      }

      // إذا لم يوجد المستخدم في قاعدة البيانات، نبحث عن المستخدم الافتراضي
      if ((userError || !user) && !sessionData) {
        // البحث عن المستخدم الافتراضي
        const { data: defaultUser, error: defaultUserError } = await supabase
          .from('users')
          .select('*')
          .eq('username', DEFAULT_USERNAME)
          .single();
        
        if (defaultUser && !defaultUserError) {
          user = defaultUser;
        }
      }

      // التحقق من كلمة المرور الحالية
      let passwordMatch = false;
      
      if (user) {
        passwordMatch = simplePasswordCompare(currentPassword, user.password_hash) || 
                       (user.username === DEFAULT_USERNAME && currentPassword === DEFAULT_PASSWORD);
      } else {
        // إذا لم يوجد المستخدم، نتحقق من البيانات الافتراضية
        passwordMatch = currentPassword === DEFAULT_PASSWORD;
      }

      if (!passwordMatch) {
        return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
      }

      // تحديث أو إنشاء المستخدم
      if (user) {
        // تحديث كلمة المرور للمستخدم الموجود
        const { error: updateError } = await supabase
          .from('users')
          .update({ password_hash: newPassword })
          .eq('id', user.id);

        if (updateError) {
          return { success: false, error: 'فشل تحديث كلمة المرور' };
        }
      } else {
        // إنشاء المستخدم في قاعدة البيانات إذا لم يكن موجوداً
        const { error: createError } = await supabase
          .from('users')
          .upsert({
            username: DEFAULT_USERNAME,
            password_hash: newPassword,
          }, {
            onConflict: 'username'
          });

        if (createError) {
          return { success: false, error: 'فشل تحديث كلمة المرور' };
        }
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
