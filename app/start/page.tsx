'use client';

import { NextPage } from 'next';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { QrGenerateRequest, QrGenerateResponse } from '@/utils/service';
import { QrCard } from '@/components/QrCard';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import LoadingDots from '@/components/ui/loadingdots';

const generateFormSchema = z.object({
  url: z.string(),
  prompt: z.string().max(160),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

const NUM_PARALLEL_REQUESTS = 1;

const GeneratePage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<QrGenerateResponse | null>(null);
  const [submittedURL, setSubmittedURL] = useState<string | null>(null);

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    mode: 'onChange',
  });

  const handleSubmit = useCallback(async (values: GenerateFormValues) => {
    setIsLoading(true);
    setResponse(null);
    setSubmittedURL(values.url);

    try {
      const request: QrGenerateRequest = {
        url: values.url,
        prompt: values.prompt,
        num_variants: NUM_PARALLEL_REQUESTS,
      };
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      // Handle API errors.
      if (!response.ok || response.status !== 200) {
        const text = await response.text();
        throw new Error(`Failed to generate QR code: ${text}`);
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-10">
        <div className="col-span-1">
          <h1 className="text-3xl font-bold mb-10">Generate a QR Code</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="roomgpt.io" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is what your QR code will link to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A city view with clouds"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is what the image in your QR code will look like.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <LoadingDots color="white" /> : 'Generate'}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </Form>
        </div>
        <div className="col-span-1">
          {submittedURL && (
            <>
              <h1 className="text-3xl font-bold mb-10">Your QR Code</h1>
              <div className="grid grid-cols-1 gap-4">
                {response ? (
                  response.image_urls.map((imageURL, idx) => (
                    <QrCard
                      key={`${imageURL}-${idx}`}
                      id={idx}
                      imageURL={imageURL}
                      time={(response.model_latency_ms / 1000).toFixed(2)}
                    />
                  ))
                ) : (
                  <div className="animate-pulse bg-gray-200 aspect-square rounded w-[552px] h-[580px]" />
                )}
                <div className="flex justify-center gap-5">
                  <Button>Download</Button>
                  <Button variant="outline">✨ Regenerate</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
