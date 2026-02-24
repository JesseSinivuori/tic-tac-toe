import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
	const darkMode = await req.json();
	const cookieStore = await cookies();

	if (darkMode) {
		cookieStore.delete("darkMode");
	} else {
		cookieStore.set("darkMode", "false");
	}

	return new NextResponse();
}
