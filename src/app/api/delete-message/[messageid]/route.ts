import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { userModel } from "@/model/User.model";

interface RouteContext {
  params: Promise<{ messageid: string }>;
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { messageid } = await context.params;

  await dbConnect();

  const session = await getServerSession(authOptions);
  const _user = session?.user;
  if (!session || !_user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const updateResult = await userModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        {
          message: "Message not found or already deleted",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Message deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Error deleting message: ${error}`,
        success: false,
      },
      { status: 500 }
    );
  }
}
