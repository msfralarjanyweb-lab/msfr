import React from 'react';

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: 'left' | 'center' | 'right';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  subtitle, 
  title, 
  description, 
  light = false,
  align = 'center'
}) => {
  const alignClass = align === 'left' ? 'text-right' : align === 'right' ? 'text-left' : 'text-center';
  
  return (
    <div className={`mb-12 ${alignClass} max-w-3xl mx-auto`}>
      <span className={`uppercase tracking-widest text-xs font-bold text-primary mb-3 block`}>
        {subtitle}
      </span>
      <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${light ? 'text-white' : 'text-secondary'}`}>
        {title}
      </h2>
      {description && (
        <p className={`${light ? 'text-gray-300' : 'text-medium'} text-lg leading-relaxed`}>
          {description}
        </p>
      )}
      {align === 'center' && (
        <div className={`h-1 w-20 bg-primary mx-auto mt-6`}></div>
      )}
      {align === 'left' && (
        <div className={`h-1 w-20 bg-primary ml-auto mr-0 mt-6`}></div>
      )}
    </div>
  );
};

export default SectionHeading;