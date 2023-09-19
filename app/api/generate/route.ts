import { replicateClient } from '@/utils/ReplicateClient';
import { QrGenerateRequest, QrGenerateResponse } from '@/utils/service';
import { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

/**
 * Validates a request object.
 *
 * @param {QrGenerateRequest} request - The request object to be validated.
 * @throws {Error} Error message if URL or prompt is missing.
 */

const validateRequest = (request: QrGenerateRequest) => {
  if (!request.url) {
    throw new Error('URL is required');
  }
  if (!request.prompt) {
    throw new Error('Prompt is required');
  }
};

const ratelimit = new Ratelimit({
  redis: kv,
  // Allow 5 requests from the same IP in 1 day.
  // TODO: Change this back to 10
  limiter: Ratelimit.slidingWindow(100, '1 d'),
});

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as QrGenerateRequest;

  const ip = request.ip ?? '127.0.0.1';
  const { success, remaining } = await ratelimit.limit(ip);

  console.log('Remaining generations: ', remaining);

  if (!success) {
    return new Response('Too many requests. Please try again after 24h.', {
      status: 429,
    });
  }

  try {
    validateRequest(reqBody);
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 400 });
    }
  }

  const numVariants = reqBody.num_variants || 1;

  const startTime = performance.now();
  const requests: Promise<string>[] = [];
  for (let i = 0; i < numVariants; i++) {
    const promise = async () => {
      const response = replicateClient.generateQrCode({
        url: reqBody.url,
        prompt: reqBody.prompt,
        qr_conditioning_scale: 2,
        num_inference_steps: 30,
        guidance_scale: 5,
        negative_prompt:
          'Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, blurry',
      });
      return response;
    };
    requests.push(promise());
  }
  const imageURLs = await Promise.all(requests);

  const endTime = performance.now();
  const durationMS = endTime - startTime;

  const response: QrGenerateResponse = {
    image_urls: imageURLs,
    model_latency_ms: Math.round(durationMS),
  };
  return new Response(JSON.stringify(response), {
    status: 200,
  });
}
