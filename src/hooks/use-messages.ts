"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api, extractErrorMessage } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@/model/User.model";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchMessages = useCallback(
    async (showRefreshToast = false) => {
      if (!session?.user) return;
      setIsLoading(true);
      try {
        const response = await api.messages.getAll();
        if (response.success && "data" in response) {
          setMessages((response.data as Message[]) ?? []);
        }
        if (showRefreshToast) {
          toast({ title: "Messages refreshed", description: "Showing latest messages" });
        }
      } catch (error) {
        toast({ description: extractErrorMessage(error), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    },
    [session?.user, toast]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        const response = await api.messages.delete(messageId);
        if (response.success) {
          setMessages((prev) => prev.filter((m) => m._id.toString() !== messageId));
          toast({ title: "Message deleted" });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: extractErrorMessage(error),
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    fetchMessages,
    deleteMessage,
  };
}

export function useAcceptMessages() {
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchStatus = useCallback(async () => {
    if (!session?.user) return;
    setIsLoading(true);
    try {
      const response = await api.messages.getAcceptStatus();
      if (response.success && "data" in response) {
        const data = response.data as { isAcceptingMessages: boolean };
        setAcceptMessages(data.isAcceptingMessages);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, toast]);

  const toggleAccept = useCallback(async () => {
    try {
      const newValue = !acceptMessages;
      const response = await api.messages.updateAcceptStatus(newValue);
      if (response.success) {
        setAcceptMessages(newValue);
        toast({ title: response.message });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    }
  }, [acceptMessages, toast]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { acceptMessages, isLoading, toggleAccept };
}
