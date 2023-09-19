export type QrCodeControlNetRequest = {
  url: string;
  prompt: string;
  qr_conditioning_scale?: number;
  num_inference_steps?: number;
};

export type QrCodeControlNetResponse = [string];
