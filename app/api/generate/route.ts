import { QrGenerateRequest } from "@/models/service";
import { ENV_KEY, getEnv } from "@/utils/env";
import { NextRequest } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: getEnv(ENV_KEY.REPLICATE_API_TOKEN) ?? "NA",
});

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

export async function GET(request: NextRequest) {
  const reqBody = (await request.json()) as QrGenerateRequest;

  // Validate the request.
  try {
    validateRequest(reqBody);
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 400 });
    }
  }

  const output = await replicate.run(
    "zylim0702/qr_code_controlnet:628e604e13cf63d8ec58bd4d238474e8986b054bc5e1326e50995fdbc851c557",
    {
      input: {
        url: reqBody.url,
        prompt: reqBody.prompt,
      },
    }
  );

  console.log(output);
}
