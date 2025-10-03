import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

interface HomeContentProps {
  scrollY: number;
  isChatOpen?: boolean;
}

const HomeContent = ({ scrollY, isChatOpen }: HomeContentProps) => {
  return (
    <>
      <Header className={isChatOpen ? 'md:block hidden' : ''} />
      <Hero scrollY={scrollY} />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
};

export default HomeContent;
