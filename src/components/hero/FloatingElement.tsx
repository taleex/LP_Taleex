interface FloatingElementProps {
  className?: string;
  style?: React.CSSProperties;
  color: string;
  size: 'small' | 'medium' | 'large';
}

const FloatingElement = ({ className = '', style = {}, color, size }: FloatingElementProps) => {
  const sizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-6 h-6'
  };

  return (
    <div className={`absolute animate-float ${className}`} style={style}>
      <div className={`${sizes[size]} ${color} rounded-full`}></div>
    </div>
  );
};

export default FloatingElement;
