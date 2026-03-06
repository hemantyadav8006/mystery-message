import VerificationEmail from "../../Emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";
import { getBaseUrl } from "@/constants/config";
import { sendEmail } from "@/utils/sendEmail";

export async function sendVerificationEmail({
  email,
  username,
  verifyCode,
}: {
  email: string;
  username: string;
  verifyCode: string;
}): Promise<ApiResponse> {
  try {
    await sendEmail({
      to: email,
      subject: "Mystery Message | True Feedback | Verification Code 😉",
      react: (
        <VerificationEmail
          username={username}
          otp={verifyCode}
          baseUrl={getBaseUrl()}
        />
      ),
    });

    return { success: true, message: "Verification Email sent successfully!" };
  } catch (emailError) {
    return {
      success: false,
      message: `Failed to send verification email ${emailError}`,
    };
  }
}
