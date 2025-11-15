import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiService from '../../api/apiService';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        window.location.href = window.location.origin;
        return;
      }

      try {
        await apiService.get(`/auth/verify-email?token=${token}`);
        window.location.href = window.location.origin;
      } catch (error) {
        window.location.href = window.location.origin;
      }
    };

    verifyEmail();
  }, [searchParams]);

  return null;
};

export default VerifyEmail;

