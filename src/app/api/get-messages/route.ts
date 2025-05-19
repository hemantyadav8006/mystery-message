import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { userModel } from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user; // already logged in user

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await userModel.aggregate([
      { $match: { _id: userId } }, // matching document with id
      { $unwind: "$messages" }, // flating the array to turn them in different objects
      { $sort: { "messages.createdAt": -1 } }, // sorting the douments according to the createdAt
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // grouping the document
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Messages not found!",
        },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      message: "User found with messages data",
      data: user[0].messages,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "An unexpected error occured" + error,
      },
      { status: 500 }
    );
  }
}
