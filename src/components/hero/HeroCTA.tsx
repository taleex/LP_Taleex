interface HeroCTAProps {
  onExploreClick: () => void;
  onContactClick: (e: React.MouseEvent) => void;
}

const HeroCTA = ({ onExploreClick, onContactClick }: HeroCTAProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
      <button
        onClick={onExploreClick}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Explore My Work
      </button>
      <a
        href="#contact"
        onClick={onContactClick}
        className="border-2 border-muted hover:border-primary theme-text hover:text-primary px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
      >
        Get In Touch
      </a>
    </div>
  );
};

export default HeroCTA;
