import { getResend } from "@/lib/resend";
import VerificationEmail from "../../Emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";
import { getBaseUrl } from "@/constants/config";

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
    await getResend().emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message | True Feedback | Verification Code 😉",
      react: VerificationEmail({
        username,
        otp: verifyCode,
        baseUrl: getBaseUrl(),
      }),
    });
    return { success: true, message: "Verification Email send Successfully!" };
  } catch (emailError) {
    return {
      success: false,
      message: `Failed to send verification email ${emailError}`,
    };
  }
}
