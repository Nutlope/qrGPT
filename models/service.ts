export interface QrGenerateRequest {
  /**
   * URL that the QR code will point to.
   */
  url: string;

  /**
   * Accompanying text prompt that will decide the style or theme of the code.
   */
  prompt: string;
}
