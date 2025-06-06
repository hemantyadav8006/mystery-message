"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import axios, { AxiosError } from "axios";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/model/User.model";
import { useToast } from "@/hooks/use-toast";
import { Schema } from "mongoose";
import { Loader2 } from "lucide-react";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: Schema.Types.ObjectId) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({ title: response.data.message });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-between rounded-lg shadow-lg border-[1px] h-[100px] p-3">
      <button
        onClick={() => setShowConfirm(true)}
        className="absolute text-[22px] text-red-500 hover:text-red-600 p-2 rounded top-1 right-1"
      >
        <RiDeleteBin5Line className="drop-shadow-[0_0_4px_rgba(255,0,0,1)]" />
      </button>

      <p className="font-semibold dark:text-gray-400 overflow-auto">
        {message.content}
      </p>
      <div className="text-sm text-gray-600">
        {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              Are you absolutely sure?
            </h3>
            <p className="text-md mb-4 text-gray-800 dark:text-gray-200">
              This action cannot be undone. This will permanently delete this
              message.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
