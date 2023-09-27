import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: NextRequest, _res: NextResponse) {
  const darkMode = await req.json();

  if (darkMode) {
    cookies().delete("darkMode");
  } else {
    cookies().set("darkMode", "false");
  }

  return new NextResponse();
}
