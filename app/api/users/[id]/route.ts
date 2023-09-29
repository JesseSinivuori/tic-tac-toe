import { isAuthorized } from "@/app/lib/authorize";
import dbConnect from "@/app/lib/dbConnect";
import { getUserById } from "@/app/models/user/user.functions";
import { NextResponse } from "next/server";

//get user by id
export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } },
  _res: Response,
) {
  try {
    const body = await req.json();
    const userEmail = body.userEmail;

    await isAuthorized(userEmail);

    await dbConnect();
    const user = await getUserById(id);

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
