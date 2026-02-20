import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";
import { emailService } from "./email.service";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
  AppError,
} from "@/lib/errors";
import {
  BCRYPT_SALT_ROUNDS,
  VERIFICATION_CODE_EXPIRY_HOURS,
} from "@/constants/config";
import type { SignUpInput, VerifyCodeInput } from "@/Schemas/user.schema";

function generateVerifyCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getCodeExpiryDate(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + VERIFICATION_CODE_EXPIRY_HOURS);
  return expiry;
}

export const userService = {
  async signUp(data: SignUpInput) {
    const { username, email, password } = data;

    const existingVerifiedUser = await userRepository.findVerifiedByUsername(username);
    if (existingVerifiedUser) {
      throw new ConflictError("Username is already taken");
    }

    const verifyCode = generateVerifyCode();
    const verifyCodeExpires = getCodeExpiryDate();
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const existingUserByEmail = await userRepository.findByEmail(email);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        throw new ConflictError("A user already exists with this email");
      }

      await userRepository.updateVerificationCode(
        existingUserByEmail._id.toString(),
        hashedPassword,
        verifyCode,
        verifyCodeExpires
      );
    } else {
      await userRepository.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires,
      });
    }

    const emailResult = await emailService.sendVerificationEmail({
      username,
      email,
      verifyCode,
    });

    if (!emailResult.success) {
      throw new AppError(emailResult.message, 500);
    }

    return { message: "User registered successfully. Please verify your email." };
  },

  async verifyCode(data: VerifyCodeInput) {
    const { username, otp } = data;

    const user = await userRepository.findUnverifiedByUsername(username);
    if (!user) {
      throw new NotFoundError("User not found or already verified");
    }

    if (user.verifyCodeExpires == null || user.verifyCode == null) {
      throw new NotFoundError("User not found or already verified");
    }

    const isCodeExpired = new Date(user.verifyCodeExpires) <= new Date();
    if (isCodeExpired) {
      throw new ValidationError(
        "Verification code has expired. Please sign up again to get a new code."
      );
    }

    const isCodeValid = user.verifyCode === otp;
    if (!isCodeValid) {
      throw new ValidationError("Invalid verification code");
    }

    await userRepository.markAsVerified(user._id.toString());
    return { message: "Account verified successfully" };
  },

  async checkUsernameUnique(username: string) {
    const existingUser = await userRepository.findVerifiedByUsername(username);
    if (existingUser) {
      throw new ConflictError("Username is already taken");
    }
    return { message: "Username is available" };
  },
};
