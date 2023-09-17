import { cn } from "@/lib/utils";
import { FetchLifecycleType } from "@/models/service";
import React from "react";

type QrCardProps = {
  containerClassName?: string;
  id: number;
  state: FetchLifecycleType;
};
export const QrCard: React.FC<QrCardProps> = ({
  containerClassName = "",
  id,
  state: { request, isLoading, error, response },
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          "animate-pulse bg-gray-200 aspect-square w-full",
          containerClassName
        )}
      />
    );
  }

  if (error) {
    return (
      <div className={containerClassName}>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (response) {
    return (
      <div
        className={cn(
          containerClassName,
          "flex flex-col justify-center items-center gap-y-2"
        )}
      >
        <img src={response.image_url} className="w-full" />
        <p className="text-gray-400 text-sm italic">
          Option {id + 1} ({(response.model_latency_ms / 1000).toFixed(2)}s)
        </p>
      </div>
    );
  }

  return <div className={containerClassName}>{request.prompt}</div>;
};
