import { cn } from "@/lib/utils";
import React from "react";

type QrCardProps = {
  containerClassName?: string;
  id: number;
  isLoading?: boolean;
  imageURL?: string;
};

export const QrCard: React.FC<QrCardProps> = ({
  containerClassName = "",
  id,
  isLoading = false,
  imageURL,
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          "animate-pulse bg-gray-200 aspect-square w-full rounded",
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
        "flex flex-col justify-center items-center gap-y-2"
      )}
    >
      <img src={imageURL} className="w-full" />
      <p className="text-gray-400 text-sm italic">Option {id + 1}</p>
    </div>
  );
};
