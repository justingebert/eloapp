import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import User from "@/db/models/User";

export const revalidate = 0

export async function GET(req: Request, res: NextResponse) {
  await dbConnect();
  const users = await User.find({});
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { username } = await req.json();

  try {
      const user = new User({ username });
      await user.save();
      return NextResponse.json(user, { status: 201 });
  } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}