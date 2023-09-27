import dbConnect from "@/app/lib/dbConnect";
import { getUserWithGameHistory } from "@/app/models/user/user.functions";
import { NextResponse } from "next/server";
import { URL } from "url";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } },
  _res: Response,
) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const page = Number(searchParams.get("page"));
    const limit = Number(searchParams.get("limit"));
    const limitWithMax = limit <= 10 ? limit : 10;

    await dbConnect();
    const userWithPagination = await getUserWithGameHistory(
      id,
      page,
      limitWithMax,
    );

    return NextResponse.json(userWithPagination, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
