import { Send, Loader2 } from 'lucide-react';
import { useContactForm } from '@/hooks/useContactForm';

const ContactForm = () => {
  const { formData, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useContactForm();

  return (
    <div className="animate-slide-in-right">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block theme-text font-medium mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`w-full bg-muted/10 theme-border border rounded-lg px-4 py-3 theme-text placeholder:theme-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.name ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
              }`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block theme-text font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`w-full bg-muted/10 theme-border border rounded-lg px-4 py-3 theme-text placeholder:theme-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block theme-text font-medium mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`w-full bg-muted/10 theme-border border rounded-lg px-4 py-3 theme-text placeholder:theme-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.subject ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
            }`}
            placeholder="Project inquiry"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-destructive">{errors.subject}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block theme-text font-medium mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            rows={6}
            className={`w-full max-h-[150px] bg-muted/10 theme-border border rounded-lg px-4 py-3 theme-text placeholder:theme-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-vertical disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.message ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
            }`}
            placeholder="Tell me about your project..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-destructive">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={20} />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
