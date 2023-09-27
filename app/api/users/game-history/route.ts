import { isAuthorized } from "@/app/lib/authorize";
import dbConnect from "@/app/lib/dbConnect";
import { addGameHistory } from "@/app/models/user/user.functions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, _res: Response) {
  try {
    const body = await req.json();
    const { gameResult, userEmail } = body;

    if (!gameResult) {
      return NextResponse.json(
        { error: "gameResult is missing." },
        { status: 400 },
      );
    }
    await isAuthorized(userEmail);

    await dbConnect();
    await addGameHistory(gameResult);

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid game details.", details: error.errors },
        { status: 400 },
      );
    } else {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
}
