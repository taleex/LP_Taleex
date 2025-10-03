import { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useExperiences } from '@/hooks/useExperiences';
import { useSkills } from '@/hooks/useSkills';

const StructuredData = () => {
  const { data: profile } = useProfile();
  const { data: experiences } = useExperiences();
  const { data: skillCategories } = useSkills();

  useEffect(() => {
    if (!profile || !experiences || !skillCategories) return;

    // Get all skills as a flat array
    const allSkills = skillCategories.flatMap(category => 
      category.skills.map(skill => skill.name)
    );

    // Person Schema
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": profile.name,
      "jobTitle": profile.title,
      "email": profile.email,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": profile.location
      },
      "image": profile.avatar,
      "url": window.location.origin,
      "sameAs": [
        "https://github.com",
        "https://linkedin.com"
      ],
      "knowsAbout": allSkills,
      "description": Array.isArray(profile.description) ? profile.description[0] : profile.description
    };

    // Professional Service Schema
    const professionalServiceSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": `${profile.name} - ${profile.title}`,
      "description": Array.isArray(profile.description) ? profile.description[0] : profile.description,
      "provider": {
        "@type": "Person",
        "name": profile.name
      },
      "areaServed": "Worldwide",
      "serviceType": "Web Development"
    };

    // Work Experience Schema
    const workExperienceSchemas = experiences.map(exp => ({
      "@context": "https://schema.org",
      "@type": "EmployeeRole",
      "roleName": exp.title,
      "startDate": exp.period.split(' - ')[0],
      "endDate": exp.period.split(' - ')[1] === 'Present' ? new Date().toISOString().split('T')[0] : exp.period.split(' - ')[1],
      "employmentType": exp.type.toUpperCase().replace('-', '_'),
      "description": exp.description,
      "skills": exp.technologies.join(', ')
    }));

    // Breadcrumb List Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Projects",
          "item": `${window.location.origin}/projects`
        }
      ]
    };

    // Combine all schemas
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        personSchema,
        professionalServiceSchema,
        breadcrumbSchema,
        ...workExperienceSchemas
      ]
    };

    // Add or update script tag
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    // Cleanup function
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [profile, experiences, skillCategories]);

  return null;
};

export default StructuredData;
