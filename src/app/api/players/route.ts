import { NextResponse } from 'next/server'
import dbConnect from "@/db/dbConnect";
import User from "@/db/models/User";

export const revalidate = 0

export async function GET(req: Request, res: NextResponse) {
  await dbConnect();
  const users = await User.find({});
  return NextResponse.json(users);
}
