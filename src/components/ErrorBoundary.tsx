import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const SupabaseErrorHandler = ({ children }: ErrorBoundaryProps) => {
  const navigate = useNavigate();
  const { reset } = useQueryErrorResetBoundary();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Check if error is related to Supabase
      if (event.error?.message?.includes('supabase') || 
          event.error?.message?.includes('database') ||
          event.error?.code === 'PGRST') {
        reset();
        navigate('/service-unavailable');
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [navigate, reset]);

  return <>{children}</>;
};
