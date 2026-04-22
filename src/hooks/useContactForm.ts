import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRateLimit } from '@/hooks/useRateLimit';
import DOMPurify from 'dompurify';

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  subject: z.string()
    .trim()
    .min(3, { message: "Subject must be at least 3 characters" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  message: z.string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" })
});

type FormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const CONTACT_RATE_LIMIT_KEY = 'contactFormSubmissions';

// Sanitize text inputs to prevent XSS
const sanitizeTextInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed in contact form
    ALLOWED_ATTR: []
  }).trim();
};

export const useContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Rate limiting: 3 submissions per hour
  const rateLimit = useRateLimit(CONTACT_RATE_LIMIT_KEY, {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    cooldownMs: 30 * 1000, // 30 second cooldown
  });

  const validateField = useCallback((name: keyof FormData, value: string) => {
    try {
      contactSchema.shape[name].parse(value);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name]: error.errors[0].message
        }));
      }
      return false;
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof FormData, value);
  }, [validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limit
    if (rateLimit.isLocked) {
      const remainingMsg = rateLimit.remainingMinutes > 0 
        ? `Try again in ${rateLimit.remainingMinutes} minute${rateLimit.remainingMinutes !== 1 ? 's' : ''}`
        : 'Please try again shortly';
      toast({
        title: 'Too many submissions',
        description: `For spam prevention, further submissions are temporarily disabled. ${remainingMsg}.`,
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Sanitize form data to prevent XSS
      const sanitizedData = {
        name: sanitizeTextInput(formData.name),
        email: formData.email, // Email validation handled by Zod
        subject: sanitizeTextInput(formData.subject),
        message: sanitizeTextInput(formData.message)
      };
      
      // Validate all fields
      const validatedData = contactSchema.parse(sanitizedData);
      
      // Save to database
      const { supabase } = await import('@/integrations/supabase/client');
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject,
          message: validatedData.message
        }]);

      if (dbError) {
        throw new Error('Failed to save submission');
      }

      // Record submission attempt
      rateLimit.recordAttempt();

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: validatedData
      });

      if (emailError) {
        // Don't fail the submission if email fails - message is still saved
      }
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        
        toast({
          title: "Validation error",
          description: "Please check the form fields and try again.",
          variant: "destructive",
        });
        
        // Record failed attempt
        rateLimit.recordAttempt();
      } else {
        toast({
          title: "Submission failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        
        // Record failed attempt
        rateLimit.recordAttempt();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, toast, rateLimit]);

  const resetForm = useCallback(() => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    // Rate limiting info
    isRateLimited: rateLimit.isLocked,
    rateLimitRemaining: rateLimit.maxAttempts - rateLimit.attempts,
    rateLimitAttempts: rateLimit.attempts,
  };
};
