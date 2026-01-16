interface HeroCTAProps {
  onExploreClick: () => void;
  onContactClick: (e: React.MouseEvent) => void;
}

const HeroCTA = ({ onExploreClick, onContactClick }: HeroCTAProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
      <button
        onClick={onExploreClick}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl"
        style={{ transition: 'background-color 0.3s, box-shadow 0.3s, transform 0.3s' }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Explore My Work
      </button>
      <a
        href="#contact"
        onClick={onContactClick}
        className="border-2 border-muted hover:border-primary theme-text hover:text-primary px-8 py-4 rounded-full text-lg font-medium"
        style={{ transition: 'border-color 0.3s, color 0.3s, transform 0.3s' }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Get In Touch
      </a>
    </div>
  );
};

export default HeroCTA;
