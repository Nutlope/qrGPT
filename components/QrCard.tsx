import { cn } from '@/utils/utils';
import React, { useState } from 'react';
import { Button } from './ui/button';

type QrCardProps = {
  containerClassName?: string;
  id: number;
  isLoading?: boolean;
  href: string;
  imageURL?: string;
};

export const QrCard: React.FC<QrCardProps> = ({
  containerClassName = '',
  id,
  isLoading = false,
  href,
  imageURL,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  if (isLoading) {
    return (
      <div
        className={cn(
          'animate-pulse bg-gray-200 aspect-square w-full rounded',
          containerClassName
        )}
        style={{
          animationDelay: `${id * 250}ms`,
        }}
      />
    );
  }

  if (!imageURL) {
    return (
      <div className={containerClassName}>
        <p>Image URL not provided</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        containerClassName,
        'flex flex-col justify-center relative h-auto items-center border border-gray-300 rounded p-2 shadow group'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative flex flex-col justify-center items-center gap-y-2">
        <div
          className={cn(
            'absolute w-[80%] h-[80%] border-4 border-red-500 border-dashed rounded left-[10%] top-[10%] z-10 flex flex-col items-center justify-center gap-y-4',
            isHovering ? 'opacity-100' : 'opacity-0'
          )}
        >
          <a href={imageURL} download target="_blank">
            <Button>Download Image</Button>
          </a>
          <a href={href} target="_blank">
            <Button>Open Link</Button>
          </a>
        </div>
        <img
          src={imageURL}
          className={cn(
            'w-full rounded',
            isHovering ? 'saturate-50 brightness-75' : ''
          )}
        />
        <p className="text-gray-400 text-sm italic">Option {id + 1}</p>
      </div>
    </div>
  );
};
