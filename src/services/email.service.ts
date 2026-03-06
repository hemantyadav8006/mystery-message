import { sendEmail } from "@/utils/sendEmail";
import VerificationEmail from "../../Emails/VerificationEmails";
import { getBaseUrl } from "@/constants/config";

interface SendVerificationEmailParams {
  email: string;
  username: string;
  verifyCode: string;
}

export const emailService = {
  async sendVerificationEmail({
    email,
    username,
    verifyCode,
  }: SendVerificationEmailParams): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await sendEmail({
        to: email,
        subject: "Mystery Message | True Feedback | Verification Code 😉",
        react: VerificationEmail({
          username,
          otp: verifyCode,
          baseUrl: getBaseUrl(),
        }),
      });
      return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
      console.error("[Email] Failed to send verification email:", error);
      return { success: false, message: "Failed to send verification email" };
    }
  },
};
