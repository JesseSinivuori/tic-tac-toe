import dbConnect from "@/app/lib/dbConnect";
import { createAndSaveUser } from "@/app/models/user/user.functions";
import { User } from "@/app/models/user/user.schema";
import { UserSchema } from "@/app/models/user/user.schema.zod";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, _res: Response) {
  try {
    const body = await req.json();
    const email = body.email;

    await dbConnect();
    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      const newUser: UserSchema = {
        email: email,
      };

      const returnedNewUser = await createAndSaveUser(newUser);

      return NextResponse.json(returnedNewUser, { status: 200 });
    } else {
      return NextResponse.json(existingUser, { status: 200 });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid user details.", details: error.errors },
        { status: 400 },
      );
    } else {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
}
