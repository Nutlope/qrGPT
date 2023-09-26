export type QrCodeControlNetRequest = {
  url: string;
  prompt: string;
  scheduler?: string;
  image_resolution?: number;
  qr_conditioning_scale?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  negative_prompt?: string;
};

export type QrCodeControlNetResponse = [string];
