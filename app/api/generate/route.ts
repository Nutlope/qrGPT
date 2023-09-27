import { replicateClient } from '@/utils/ReplicateClient';
import { QrGenerateRequest, QrGenerateResponse } from '@/utils/service';
import { NextRequest } from 'next/server';
// import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { put } from '@vercel/blob';
import { generateWifiStr, nanoid } from '@/utils/utils';

import { createCanvas, loadImage } from 'canvas';

// with color changing
export const addTextToImg = async (props: {
  imgUrl: string;
  wifiName: string;
  wifiPassword: string;
}): Promise<string> => {
  const { imgUrl, wifiName, wifiPassword } = props;
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');

  // Load the image
  const image = await loadImage(imgUrl);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Calculate the average brightness of the image
  let totalBrightness = 0;
  for (let i = 0; i < imageData.length; i += 4) {
    // 4 channels: Red, Green, Blue, and Alpha
    const red = imageData[i];
    const green = imageData[i + 1];
    const blue = imageData[i + 2];
    totalBrightness += 0.299 * red + 0.587 * green + 0.114 * blue; // Standard luminance calculation
  }

  const averageBrightness = totalBrightness / (canvas.width * canvas.height);

  // Choose text color based on average brightness
  ctx.font = 'bold 25px Arial';
  ctx.fillStyle = averageBrightness < 128 ? 'white' : 'black'; // If the average brightness is less than 128, choose white, else choose black.
  ctx.textAlign = 'center';
  ctx.fillText(
    `u: ${wifiName} p: ${wifiPassword}`,
    canvas.width / 2,
    canvas.height - 20,
  );

  return canvas.toDataURL();
};

/**
 * Validates a request object.
 *
 * @param {QrGenerateRequest} request - The request object to be validated.
 * @throws {Error} Error message if URL or prompt is missing.
 */

const validateRequest = (request: QrGenerateRequest) => {
  if (!request.wifi_name) {
    throw new Error('wifi name is required');
  }
  if (!request.wifi_password) {
    throw new Error('wifi password is required');
  }
  if (!request.prompt) {
    throw new Error('Prompt is required');
  }
};

// const ratelimit = new Ratelimit({
//   redis: kv,
//   // Allow 20 requests from the same IP in 1 day.
//   limiter: Ratelimit.slidingWindow(20, '1 d'),
// });

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as QrGenerateRequest;

  // const ip = request.ip ?? '127.0.0.1';
  // const { success } = await ratelimit.limit(ip);

  // if (!success && process.env.NODE_ENV !== 'development') {
  //   return new Response('Too many requests. Please try again after 24h.', {
  //     status: 429,
  //   });
  // }

  try {
    validateRequest(reqBody);
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 400 });
    }
  }

  // adding a few more digits here to make it really hard to guess
  const id = nanoid(12);

  const startTime = performance.now();

  // has equal chance of being true or false
  // const randomBool = Math.random() < 0.5 ? true : false;

  // WFI:S:NETWORK;T:WPA;P:PASSWORD;H:;;
  let imageUrl = await replicateClient.generateQrCode({
    url: generateWifiStr({
      wifi_name: reqBody.wifi_name,
      wifi_password: reqBody.wifi_password,
    }),
    scheduler: 'HeunDiscrete',
    // scheduler: randomBool === true ? 'HeunDiscrete' : 'PNDM',
    prompt: reqBody.prompt,
    qr_conditioning_scale: 2,
    image_resolution: 768,
    num_inference_steps: 30,
    guidance_scale: 9,
    negative_prompt:
      'Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, ugly, disfigured, low quality, blurry, nsfw',
  });

  const endTime = performance.now();
  const durationMS = endTime - startTime;

  const now = Date.now();
  const canvasImg = await addTextToImg({
    imgUrl: imageUrl,
    wifiName: reqBody.wifi_name,
    wifiPassword: reqBody.wifi_password,
  });
  console.log('canvas time', Date.now() - now);
  // console.log('canvasImg', canvasImg);

  // convert output to a blob object
  const file = await fetch(canvasImg).then((res) => res.blob());

  // upload & store in Vercel Blob
  const { url } = await put(`${id}.png`, file, { access: 'public' });

  await kv.hset(id, {
    prompt: reqBody.prompt,
    image: url,
    wifi_name: reqBody.wifi_name,
    wifi_password: reqBody.wifi_password,
    model_latency: Math.round(durationMS),
  });

  const response: QrGenerateResponse = {
    image_url: url,
    model_latency_ms: Math.round(durationMS),
    id: id,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
  });
}
