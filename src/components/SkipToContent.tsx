const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/50"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
