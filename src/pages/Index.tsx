import PageBackground from '@/components/layout/PageBackground';
import HomeContent from '@/components/home/HomeContent';
import StructuredData from '@/components/StructuredData';
import SkipToContent from '@/components/SkipToContent';
import { useScrollTracking } from '@/hooks/useScrollTracking';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useProfile } from '@/hooks/useProfile';
import { useSiteContent } from '@/hooks/useSiteContent';

interface IndexProps {
  isChatOpen?: boolean;
}

const Index = ({ isChatOpen }: IndexProps) => {
  const scrollY = useScrollTracking();
  const isDarkMode = useDarkMode();
  const { data: profile } = useProfile();
  const { data: seoSettings } = useSiteContent('seo');

  return (
    <>
      <StructuredData />
      <SkipToContent />
      <div className="min-h-screen overflow-x-hidden transition-colors duration-300 hero-gradient relative">
        <PageBackground />
        <main id="main-content">
          <HomeContent scrollY={scrollY} isChatOpen={isChatOpen} />
        </main>
      </div>
    </>
  );
};

export default Index;
