import axios, { AxiosError } from "axios";

interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorResponse;
    return data.message || "An unexpected error occurred";
  }
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

export const api = {
  messages: {
    async getAll() {
      const { data } = await apiClient.get<ApiResponse>("/get-messages");
      return data;
    },

    async send(username: string, content: string) {
      const { data } = await apiClient.post<ApiResponse>("/send-message", {
        username,
        content,
      });
      return data;
    },

    async delete(messageId: string) {
      const { data } = await apiClient.delete<ApiResponse>(
        `/delete-message/${messageId}`
      );
      return data;
    },

    async getAcceptStatus() {
      const { data } = await apiClient.get<ApiResponse<{ isAcceptingMessages: boolean }>>(
        "/accept-messages"
      );
      return data;
    },

    async updateAcceptStatus(acceptMessages: boolean) {
      const { data } = await apiClient.post<ApiResponse>("/accept-messages", {
        acceptMessages,
      });
      return data;
    },
  },

  users: {
    async checkUsername(username: string) {
      const { data } = await apiClient.get<ApiResponse>(
        `/check-username-unique?username=${encodeURIComponent(username)}`
      );
      return data;
    },

    async signUp(username: string, email: string, password: string) {
      const { data } = await apiClient.post<ApiResponse>("/sign-up", {
        username,
        email,
        password,
      });
      return data;
    },

    async verifyCode(username: string, otp: string) {
      const { data } = await apiClient.post<ApiResponse>("/verify-code", {
        username,
        otp,
      });
      return data;
    },
  },
};

export { extractErrorMessage };
export type { ApiResponse, ApiSuccessResponse, ApiErrorResponse };
