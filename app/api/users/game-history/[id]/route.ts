import { NextResponse } from "next/server";
import { URL } from "url";
import { getUserWithGameHistory } from "@/app/models/user/user.functions";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const searchParams = new URL(req.url).searchParams;
		const page = Number(searchParams.get("page"));
		const limit = Number(searchParams.get("limit"));
		const limitWithMax = limit <= 10 ? limit : 10;

		const userWithPagination = await getUserWithGameHistory(
			id,
			page,
			limitWithMax,
		);

		return NextResponse.json(userWithPagination, { status: 200 });
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error }, { status: 500 });
	}
}
