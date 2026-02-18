"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface MessageCardProps {
  message: {
    _id: string;
    content: string;
    createdAt: Date;
  };
  onDelete: (messageId: string) => Promise<void>;
}

export function MessageCard({ message, onDelete }: MessageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(message._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="group relative flex flex-col justify-between transition-shadow hover:shadow-md">
      <CardContent className="pt-5 pb-2 pr-12">
        <p className="text-sm leading-relaxed text-foreground break-words">
          {message.content}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pb-3 pt-0">
        <time
          className="text-xs text-muted-foreground"
          dateTime={new Date(message.createdAt).toISOString()}
        >
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </time>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              aria-label="Delete message"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this message?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
