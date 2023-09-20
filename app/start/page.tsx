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
import downloadQrCode from '@/utils/downloadQrCode';

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

  function SuggestionBox({ suggestion }: { suggestion: string }) {
    return (
      <button
        onClick={() => form.setValue('prompt', suggestion)}
        disabled={isLoading}
        className={`border p-2 rounded-2xl ${
          !isLoading ? 'cursor-pointer' : 'cursor-not-allowed'
        } hover:bg-gray-100 transition`}
      >
        {suggestion}
      </button>
    );
  }

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
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 sm:mb-28 mb-0">
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
                      <FormDescription className="">
                        This is what the image in your QR code will look like.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="my-2">
                  <p className="text-sm font-medium mb-3">Prompt suggestions</p>
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 text-center text-gray-500 text-sm">
                    <SuggestionBox suggestion="A city view with clouds" />
                    <SuggestionBox suggestion="A beautiful glacier" />
                    <SuggestionBox suggestion="A forest overlooking a mountain" />
                    <SuggestionBox suggestion="A saharan desert" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center
                 max-w-[200px] mx-auto w-full"
                >
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
              <h1 className="text-3xl font-bold sm:mb-5 mb-5 mt-5 sm:mt-0 sm:text-center text-left">
                Your QR Code
              </h1>
              <div className="grid grid-cols-1 gap-4">
                {response ? (
                  <QrCard
                    imageURL={response.image_urls[0]}
                    time={(response.model_latency_ms / 1000).toFixed(2)}
                  />
                ) : (
                  <div className="animate-pulse bg-gray-400 aspect-square rounded max-w-[510px] max-h-[510px]" />
                )}
                {response && (
                  <div className="flex justify-center gap-5 mt-[7px]">
                    <Button
                      onClick={() =>
                        downloadQrCode(response?.image_urls[0]!, 'qrCode')
                      }
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={form.handleSubmit(handleSubmit)}
                    >
                      ✨ Regenerate
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
