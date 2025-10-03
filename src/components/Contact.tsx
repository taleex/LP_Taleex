import ContactInfo from './contact/ContactInfo';
import ContactForm from './contact/ContactForm';
import { useContactInfo } from '@/hooks/useContactInfo';
import { usePageSection } from '@/hooks/usePageSections';

const Contact = () => {
  const { data } = useContactInfo();
  const { data: contactSection } = usePageSection('contact');
  
  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">{contactSection?.title || "Let's Work Together"}</span>
          </h2>
          <p className="text-xl theme-text-muted max-w-3xl mx-auto">
            {contactSection?.subtitle || "Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your ideas to life."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactInfo contactInfo={data?.contactInfo} socialLinks={data?.socialLinks} />
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;
