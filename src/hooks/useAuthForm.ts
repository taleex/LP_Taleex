import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, LoginFormData } from '@/lib/auth-validation';

const REMEMBERED_EMAIL_KEY = 'rememberedEmail';

export const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      }
    };
    checkUser();
  }, [navigate]);

  const validateForm = (): boolean => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error: any) {
      const formErrors: Partial<Record<keyof LoginFormData, string>> = {};
      error.errors?.forEach((err: any) => {
        if (err.path) {
          formErrors[err.path[0] as keyof LoginFormData] = err.message;
        }
      });
      setErrors(formErrors);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please check your input and try again',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
        
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });
        navigate('/admin');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    loading,
    errors,
    handleLogin,
  };
};
