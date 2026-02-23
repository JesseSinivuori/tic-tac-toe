import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: NextRequest, _res: NextResponse) {
  const darkMode = await req.json();
  const cookieStore = await cookies();

  if (darkMode) {
    cookieStore.delete("darkMode");
  } else {
    cookieStore.set("darkMode", "false");
  }

  return new NextResponse();
}
