import { NextResponse } from "next/server";
import { isAuthorized } from "@/app/lib/authorize";
import dbConnect from "@/app/lib/dbConnect";
import { getUserById } from "@/app/models/user/user.functions";

//get user by id
export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
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
