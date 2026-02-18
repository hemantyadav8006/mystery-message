"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { useParams } from "next/navigation";
import { messageSchema } from "@/Schemas/message.schema";
import { Textarea } from "@/components/ui/textarea";
import { api, extractErrorMessage } from "@/lib/api-client";

type MessageFormValues = z.infer<typeof messageSchema>;

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { toast } = useToast();

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const messageContent = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: MessageFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.messages.send(username, data.content);
      toast({ title: response.message });
      form.reset({ content: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-8 max-w-2xl px-4 sm:px-6">
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Send Anonymous Message
        </h1>
        <p className="mt-1 text-sm text-muted-foreground mb-6">
          to <span className="font-medium text-foreground">@{username}</span>
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <span className="text-xs text-muted-foreground">
                      {messageContent?.length ?? 0}/300
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="mr-2 h-4 w-4" /> Send Message</>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <Separator className="my-6" />

        <p className="text-center text-sm text-muted-foreground">
          Messages are completely anonymous. The recipient will never know who sent it.
        </p>
      </div>
    </div>
  );
}
