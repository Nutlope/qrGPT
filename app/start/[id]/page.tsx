import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Body from '@/components/Body';

async function getAllKv(id: string) {
  const data = await kv.hgetall<{
    prompt: string;
    image?: string;
    website_url?: string;
    model_latency?: string;
  }>(id);

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata | undefined> {
  const data = await getAllKv(params.id);
  if (!data) {
    return;
  }

  const title = `QrGPT: ${data.prompt}`;
  const description = `A QR code generated from qrGPT.io linking to: ${data.website_url}`;
  const image = data.image || 'https://qrGPT.io/og-image.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@nutlope',
    },
  };
}

export default async function Results({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const data = await getAllKv(params.id);
  if (!data) {
    notFound();
  }
  return (
    <Body
      prompt={data.prompt}
      imageUrl={data.image}
      redirectUrl={data.website_url}
      modelLatency={Number(data.model_latency)}
      id={params.id}
    />
  );
}
