import React, { useState } from 'react';
import { Tractor } from 'lucide-react';

interface MachineImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIconClassName?: string;
}

export const MachineImage: React.FC<MachineImageProps> = ({
  src,
  alt,
  className = 'w-24 h-24 rounded-2xl object-cover border border-stone-200 dark:border-stone-800 shrink-0',
  fallbackIconClassName = 'w-8 h-8 text-emerald-600 dark:text-emerald-400'
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div 
        role="img"
        aria-label={alt}
        className={`${className} bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-col items-center justify-center p-2 text-center select-none`}
      >
        <Tractor className={fallbackIconClassName} />
        <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1 font-medium">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
