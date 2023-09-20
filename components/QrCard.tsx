import Image from 'next/image';

type QrCardProps = {
  id: number;
  imageURL?: string;
  time: string;
};

export const QrCard: React.FC<QrCardProps> = ({ imageURL, time }) => {
  if (!imageURL) {
    return (
      <div>
        <p>Image URL not provided</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center relative h-auto items-center">
      <div className="relative flex flex-col justify-center items-center gap-y-2 max-w-[410px] border border-gray-300 rounded shadow group p-2 mx-auto">
        <Image
          src={imageURL}
          className="rounded "
          alt="qr code"
          width={380}
          height={380}
        />
        <p className="text-gray-400 text-sm italic">
          QR code took {time} seconds to generate.
        </p>
      </div>
    </div>
  );
};
