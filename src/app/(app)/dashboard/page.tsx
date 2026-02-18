"use client";

import { MessageCard } from "@/components/component/MessageCards";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMessages, useAcceptMessages } from "@/hooks/use-messages";
import { Loader2, RefreshCcw, Copy, Check, Link as LinkIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useMemo, useCallback } from "react";
import { MessageListSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";

function UserDashboard() {
  const { data: session, status } = useSession();
  const { messages, isLoading, fetchMessages, deleteMessage } = useMessages();
  const { acceptMessages, isLoading: isSwitchLoading, toggleAccept } = useAcceptMessages();
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const profileUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/u/${session?.user?.username}`;
  }, [session?.user?.username]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    toast({ title: "Link copied!", description: "Profile URL copied to clipboard." });
    setTimeout(() => setIsCopied(false), 3000);
  }, [profileUrl, toast]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <MessageListSkeleton />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your anonymous messages and settings.
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">
            Your Public Profile Link
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            aria-label="Profile URL"
          />
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            {isCopied ? (
              <><Check className="mr-1 h-4 w-4" /> Copied</>
            ) : (
              <><Copy className="mr-1 h-4 w-4" /> Copy</>
            )}
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Switch
          checked={acceptMessages}
          onCheckedChange={toggleAccept}
          disabled={isSwitchLoading}
          aria-label="Accept messages toggle"
        />
        <span className="text-sm font-medium text-foreground">
          Accept Messages:{" "}
          <span className={acceptMessages ? "text-green-600" : "text-muted-foreground"}>
            {acceptMessages ? "On" : "Off"}
          </span>
        </span>
      </div>

      <Separator className="mb-6" />

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Messages ({messages.length})
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
          aria-label="Refresh messages"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {isLoading ? (
        <MessageListSkeleton />
      ) : messages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={{ ...message, _id: message._id.toString() }}
              onDelete={deleteMessage}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

export default UserDashboard;
