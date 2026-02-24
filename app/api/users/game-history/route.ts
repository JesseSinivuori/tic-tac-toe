import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isAuthorized } from "@/app/lib/authorize";
import { addGameHistory } from "@/app/models/user/user.functions";

export async function POST(req: Request) {
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
