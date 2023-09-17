import { FetchLifecycleType } from "@/models/service";
import React from "react";

type QrCardProps = {
  state: FetchLifecycleType;
};
export const QrCard: React.FC<QrCardProps> = ({
  state: { request, isLoading, error, response },
}) => {
  if (isLoading) {
    return (
      <div className="col-span-1">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-1">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (response) {
    return (
      <div className="col-span-1">
        <p>
          Generation took {(response.model_latency_ms / 1000).toFixed(2)}{" "}
          seconds.
        </p>
        <img src={response.image_url} className="w-full" />
      </div>
    );
  }

  return <div className="col-span-1">{request.prompt}</div>;
};
