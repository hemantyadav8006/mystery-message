import dbConnect from "@/lib/dbConnect";
import { userModel } from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, otp } = await request.json();

    const user = await userModel.findOne({
      username: username,
      isVerified: false,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found or already verified",
        },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === otp;
    const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account Verified Successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code is expiried, please signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid Verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error verifing user",
      },
      { status: 500 }
    );
  }
}
