"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send, Sparkles } from "lucide-react";
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
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

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

  const handleSuggestMessages = async () => {
    if (isSuggestLoading) return; // prevent multiple clicks

    setIsSuggestLoading(true);

    try {
      const response = await fetch("/api/suggest-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch suggestions");
      }

      setSuggestions(data.questions || []);
    } catch (error) {
      console.error("Suggestion error:", error);

      // optional fallback for UI
      setSuggestions([
        "What's a hobby you've recently started?",
        "What's something that always makes you smile?",
        "If you could travel anywhere tomorrow, where would you go?",
      ]);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    form.setValue("content", suggestion, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="mx-auto my-8 max-w-2xl px-4 sm:px-6 space-y-8">
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
              <Button type="submit" disabled={isLoading || !messageContent}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <Separator className="my-6" />

        <p className="text-center text-sm text-muted-foreground">
          Messages are completely anonymous. The recipient will never know who
          sent it.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {/* AI suggestions trigger + list */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Need inspiration? Let AI suggest some anonymous questions.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSuggestLoading}
              onClick={handleSuggestMessages}
            >
              {isSuggestLoading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-3 w-3" />
                  Suggest questions
                </>
              )}
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Tap a suggestion to use it as your message:
              </p>
              <div className="grid gap-2">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUseSuggestion(s)}
                    className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-xs sm:text-sm hover:bg-muted transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
