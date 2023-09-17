import { replicateClient } from "@/api/replicate/ReplicateClient";
import { QrGenerateRequest, QrGenerateResponse } from "@/models/service";
import { NextRequest } from "next/server";

/**
 * Validates a request object.
 *
 * @param {QrGenerateRequest} request - The request object to be validated.
 * @throws {Error} Error message if URL or prompt is missing.
 */
const validateRequest = (request: QrGenerateRequest) => {
  if (!request.url) {
    throw new Error("URL is required");
  }

  if (!request.prompt) {
    throw new Error("Prompt is required");
  }
};

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as QrGenerateRequest;

  // Validate the request.
  try {
    validateRequest(reqBody);
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 400 });
    }
  }

  const startTime = performance.now();
  const imageUrl = await replicateClient.generateQrCode({
    url: reqBody.url,
    prompt: reqBody.prompt,
  });
  const endTime = performance.now();

  const response: QrGenerateResponse = {
    image_url: imageUrl,
    model_latency_ms: Math.round(endTime - startTime),
  };
  return new Response(JSON.stringify(response), {
    status: 200,
  });
}
