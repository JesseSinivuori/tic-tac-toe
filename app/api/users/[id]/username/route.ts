import { isAuthorized } from "@/app/lib/authorize";
import dbConnect from "@/app/lib/dbConnect";
import { updateUsername } from "@/app/models/user/user.functions";
import { NextResponse } from "next/server";

//update username
export async function PATCH(
  req: Request,
  { params: { id } }: { params: { id: string } },
  _res: Response,
) {
  try {
    const { newUsername, email } = await req.json();

    await isAuthorized(email);

    await dbConnect();
    const user = await updateUsername(id, newUsername);

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    if (error.message === "Username is already taken.") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
