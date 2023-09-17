"use client";

import { NextPage } from "next";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import _ from "lodash";
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
import { FetchLifecycleType } from "@/models/service";
import { QrCard } from "@/components/QrCard/QrCard";

const generateFormSchema = z.object({
  url: z.string().url(),
  prompt: z.string().max(160).min(4),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

const defaultValues: Partial<GenerateFormValues> = {
  url: "https://qrgpt.ai",
  prompt: "a sleek, modern computer circuit with muted colors",
};

const NUM_PARALLEL_REQUESTS = 4;

const GeneratePage: NextPage = () => {
  const [fetchStates, setFetchStates] = useState<FetchLifecycleType[]>([]);

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = useCallback((values: GenerateFormValues) => {
    // Generate N parallel requests.
    const newStates: FetchLifecycleType[] = [];
    for (let i = 0; i < NUM_PARALLEL_REQUESTS; i++) {
      newStates.push({
        isLoading: true,
        error: null,
        request: {
          url: values.url,

          // TODO (@kevinhou): Add some prompt randomization to promote variance.
          prompt: values.prompt,
        },
        response: null,
      });
    }
    setFetchStates(newStates);

    // Make parallel requests and handle loading, error states independently.
    newStates.forEach((state, idx) => {
      fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify(state.request),
      })
        .then(async (response) => {
          // Handle API errors.
          if (!response.ok || response.status !== 200) {
            const text = await response.text();
            throw new Error(`Failed to generate QR code: ${text}`);
          }

          const data = await response.json();
          setFetchStates((prev) => {
            const newStatuses = [...prev];
            newStatuses[idx] = {
              ...prev[idx],
              isLoading: true,
              response: data,
            };
            return newStatuses;
          });
        })
        .catch((e) => {
          setFetchStates((prev) => {
            const newStatuses = [...prev];
            if (e instanceof Error) {
              newStatuses[idx] = {
                ...prev[idx],
                error: e,
              };
            }
            return newStatuses;
          });
        })
        .finally(() => {
          setFetchStates((prev) => {
            const newStatuses = [...prev];
            newStatuses[idx] = {
              ...prev[idx],
              isLoading: false,
            };
            return newStatuses;
          });
        });
    });
  }, []);

  const isLoading = _.findIndex(fetchStates, (state) => state.isLoading) !== -1;

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
            </div>
          </form>
        </Form>

        {fetchStates.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl mb-4">
              {isLoading
                ? "Generating..."
                : `Generated ${fetchStates.length} QR Codes`}
            </h3>
            <div className="grid grid-cols-4 gap-8">
              {fetchStates.map((state, idx) => (
                <QrCard
                  key={`${state.request.prompt}-${idx}`}
                  id={idx}
                  state={state}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratePage;
