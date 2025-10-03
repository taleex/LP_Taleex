import { useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Code2, Briefcase, FolderKanban, Mail, Sun, Moon, X } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Skills', href: '#skills', icon: Code2 },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Projects', href: '#projects', icon: FolderKanban },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useDarkMode();

  const scrollToSection = (href: string) => {
    // Close sidebar after selection on mobile
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Sidebar className="border-r border-border/50 z-50 bg-background">
      <SidebarHeader className="border-b border-border/50 p-6 bg-background">
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
            className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity duration-300 flex-1 text-left"
          >
            <span className="text-primary">Tal</span>
            <span className="text-[#FFFFFA]">eex</span>
          </button>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg transition-all duration-200 text-[#FFFFFA] hover:text-primary hover:bg-primary/10"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-background">
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="text-xs font-semibold px-3 mb-2 text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={() => scrollToSection(item.href)}
                    tooltip={item.name}
                    className="transition-all duration-200 hover:bg-primary/10 hover:text-primary rounded-lg px-3 py-2.5 text-sm font-medium text-[#FFFFFA]"
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="px-3 py-4 mt-auto border-t border-border/50">
          <SidebarGroupLabel className="text-xs font-semibold px-3 mb-2 text-muted-foreground uppercase tracking-wider">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={toggleTheme}
                  tooltip={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  className="transition-all duration-200 hover:bg-primary/10 hover:text-primary rounded-lg px-3 py-2.5 text-sm font-medium text-[#FFFFFA]"
                >
                  {isDarkMode ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
