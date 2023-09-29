import { isAuthorized } from "@/app/lib/authorize";
import { getUserByEmail } from "@/app/models/user/user.functions";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { email } }: { params: { email: string } },
  res: Response,
) {
  try {
    const decodedEmail = decodeURIComponent(email);

    await isAuthorized(decodedEmail);

    const user = await getUserByEmail(decodedEmail);

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json("Internal server error.", { status: 500 });
  }
}
