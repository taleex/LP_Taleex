import { 
  SiTypescript, SiJavascript, SiPython, SiReact, SiNodedotjs, 
  SiPostgresql, SiMongodb, SiNextdotjs, SiTailwindcss, SiFigma,
  SiGit, SiDocker, SiAmazon, SiRedux, SiGraphql, SiExpress,
  SiHtml5, SiCss3, SiLinux, SiPhp, SiVuedotjs, SiSharp
} from 'react-icons/si';

export const skillCategories = [
  {
    title: "Frontend Development",
    skills: [
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Vue.js", icon: SiVuedotjs },
      { name: "TypeScript", icon: SiTypescript },
      { name: "JavaScript", icon: SiJavascript },
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss3 },
      { name: "Tailwind", icon: SiTailwindcss },
      { name: "Redux", icon: SiRedux },
    ]
  },
  {
    title: "Backend & Databases",
    skills: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express", icon: SiExpress },
      { name: "Python", icon: SiPython },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "GraphQL", icon: SiGraphql },
      { name: "PHP", icon: SiPhp },
      { name: "C#", icon: SiSharp },
    ]
  },
  {
    title: "Tools & DevOps",
    skills: [
      { name: "Git", icon: SiGit },
      { name: "Docker", icon: SiDocker },
      { name: "AWS", icon: SiAmazon },
      { name: "Linux", icon: SiLinux },
      { name: "Figma", icon: SiFigma },
    ]
  }
];
