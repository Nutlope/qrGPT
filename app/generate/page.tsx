"use client";

import { NextPage } from "next";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { QrGenerateRequest, QrGenerateResponse } from "@/models/service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const generateFormSchema = z.object({
  url: z.string().url(),
  prompt: z.string().max(160).min(4),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

const defaultValues: Partial<GenerateFormValues> = {
  url: "https://qrgpt.ai",
  prompt: "a sleek, modern computer circuit with muted colors",
};

const GeneratePage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [generateResponse, setGenerateResponse] =
    useState<QrGenerateResponse | null>(null);

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = useCallback(async (values: GenerateFormValues) => {
    setIsLoading(true);
    try {
      const req: QrGenerateRequest = {
        url: values.url,
        prompt: values.prompt,
      };
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(req),
      });

      // Handle API errors.
      if (!response.ok || response.status !== 200) {
        const text = await response.text();
        throw new Error(`Failed to generate QR code: ${text}`);
      }

      const data = await response.json();
      setGenerateResponse(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <div className="max-w-3xl w-full">
        <h1>Generate a QR Code</h1>
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
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is what the QR code will link to.
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
                        placeholder="Enter a prompt"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is what the image will look like.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                Generate
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

        {generateResponse && (
          <div>
            <h3>Success!</h3>
            <p>
              Generation took{" "}
              {(generateResponse.model_latency_ms / 1000).toFixed(2)} seconds.
            </p>
            <img src={generateResponse.image_url} className="w-40" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratePage;
