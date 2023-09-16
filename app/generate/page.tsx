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

const generateFormSchema = z.object({
  url: z.string().url(),
  prompt: z.string().max(160).min(4),
});

type GenerateFormValues = z.infer<typeof generateFormSchema>;

const defaultValues: Partial<GenerateFormValues> = {
  url: "https://qrgpt.ai",
  prompt: "",
};

const GeneratePage: NextPage = () => {
  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateFormSchema),
    defaultValues,
    mode: "onChange",
  });

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <div className="max-w-3xl w-full">
        <h1>Generate a QR Code</h1>
        <Form {...form}>
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
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>
    </div>
  );
};

export default GeneratePage;
