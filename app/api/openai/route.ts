import { NextResponse } from "next/server";
import { chatCompletion } from "@/app/lib/chatgpt";

export async function POST(req: Request, res: NextResponse) {
  const { currentPlayer, board, size } = await req.json();

  const response = await chatCompletion(currentPlayer, board, size);

  return NextResponse.json(response, { status: 200 });
}
