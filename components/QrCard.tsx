import { cn } from '@/utils/utils';

type QrCardProps = {
  containerClassName?: string;
  id: number;
  isLoading?: boolean;
  imageURL?: string;
  time: string;
};

export const QrCard: React.FC<QrCardProps> = ({
  containerClassName = '',
  id,
  isLoading = false,
  imageURL,
  time,
}) => {
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
    >
      <div className="relative flex flex-col justify-center items-center gap-y-2">
        <img src={imageURL} className="w-full rounded" />
        <p className="text-gray-400 text-sm italic">
          QR code took {time} seconds to generate.
        </p>
      </div>
    </div>
  );
};
