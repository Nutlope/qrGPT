export interface QrGenerateRequest {
  wifi_name: string;
  wifi_password: string;
  prompt: string;
  qr_conditioning_scale?: number;
  num_inference_steps?: number;
  encryption: string;
}

export interface QrGenerateResponse {
  image_url: string;
  download_url: string;
  model_latency_ms: number;

  /**
   * Unique ID of the QR code.
   * This ID can be used to retrieve the QR code image from the API.
   */
  id: string;
}
