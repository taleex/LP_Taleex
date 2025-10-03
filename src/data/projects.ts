import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    category: "Professional",
    description: "A full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product management, shopping cart, and payment processing.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "JWT", "Material-UI"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true
  },
  {
    title: "Task Management App",
    category: "Personal",
    description: "A productivity application built with React and Firebase. Features real-time updates, drag-and-drop functionality, team collaboration, and progress tracking.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    technologies: ["React", "Firebase", "Tailwind CSS", "React Beautiful DnD"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true
  },
  {
    title: "Weather Dashboard",
    category: "Personal",
    description: "A responsive weather application with real-time data, geolocation support, and interactive charts. Built with React and integrates multiple weather APIs.",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
    technologies: ["React", "Chart.js", "OpenWeather API", "CSS Modules"],
    github: "https://github.com",
    live: "https://example.com",
    featured: false
  },
  {
    title: "Component Library",
    category: "Open Source",
    description: "A comprehensive React component library with TypeScript support, Storybook documentation, and automated testing. Used by 500+ developers.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    technologies: ["React", "TypeScript", "Storybook", "Jest", "Rollup"],
    github: "https://github.com",
    featured: true
  },
  {
    title: "Real Estate Platform",
    category: "Professional",
    description: "A modern real estate platform with property listings, virtual tours, and advanced search filters. Built with Next.js and integrated with mapping services.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    technologies: ["Next.js", "PostgreSQL", "Mapbox", "Prisma", "Tailwind CSS"],
    github: "https://github.com",
    live: "https://example.com",
    featured: false
  },
  {
    title: "Social Media Dashboard",
    category: "Personal",
    description: "A comprehensive dashboard for managing multiple social media accounts. Features analytics, post scheduling, and engagement tracking across platforms.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    technologies: ["Vue.js", "Express.js", "Redis", "Chart.js", "Socket.io"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true
  }
];
