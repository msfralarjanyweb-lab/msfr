import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Reset: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all localStorage data (legacy support)
    localStorage.removeItem('siteData');
    localStorage.removeItem('articles');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('sessionToken');
    
    // Redirect to home after 1 second
    setTimeout(() => {
      navigate('/');
    }, 1000);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary mb-4">جاري إعادة تعيين البيانات...</h1>
        <p className="text-gray-600">سيتم إعادة توجيهك إلى الصفحة الرئيسية قريباً</p>
      </div>
    </div>
  );
};

export default Reset;
