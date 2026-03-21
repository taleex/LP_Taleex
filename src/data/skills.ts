import { 
  FaReact, FaNode, FaDatabase, FaDocker, FaGitAlt, FaPython,
  FaHtml5, FaCss3Alt, FaLinux, FaPhp, FaAws
} from 'react-icons/fa';
import { 
  SiTypescript, SiJavascript, SiNextdotjs, SiTailwindcss, SiFigma,
  SiPostgresql, SiMongodb, SiRedux, SiGraphql, SiExpress, SiVuedotjs
} from 'react-icons/si';

export const skillCategories = [
  {
    title: "Frontend Development",
    skills: [
      { name: "React", icon: FaReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Vue.js", icon: SiVuedotjs },
      { name: "TypeScript", icon: SiTypescript },
      { name: "JavaScript", icon: SiJavascript },
      { name: "HTML5", icon: FaHtml5 },
      { name: "CSS3", icon: FaCss3Alt },
      { name: "Tailwind", icon: SiTailwindcss },
      { name: "Redux", icon: SiRedux },
    ]
  },
  {
    title: "Backend & Databases",
    skills: [
      { name: "Node.js", icon: FaNode },
      { name: "Express", icon: SiExpress },
      { name: "Python", icon: FaPython },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "GraphQL", icon: SiGraphql },
      { name: "PHP", icon: FaPhp },
      { name: "C#", icon: FaDatabase },
    ]
  },
  {
    title: "Tools & DevOps",
    skills: [
      { name: "Git", icon: FaGitAlt },
      { name: "Docker", icon: FaDocker },
      { name: "AWS", icon: FaAws },
      { name: "Linux", icon: FaLinux },
      { name: "Figma", icon: SiFigma },
    ]
  }
];
