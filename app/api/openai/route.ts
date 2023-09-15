import { NextResponse } from "next/server";
import { chatCompletion } from "@/app/lib/chatgpt";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit/dist";
import { kv } from "@vercel/kv";

const ratelimit =
  process.env.NODE_ENV === "production"
    ? new Ratelimit({
        redis: kv,
        // 6 requests from the same IP in 3 seconds
        limiter: Ratelimit.slidingWindow(6, "3 s"),
      })
    : null;

export async function POST(req: NextRequest, res: NextResponse) {
  // You could alternatively limit based on user ID or similar
  const ip = req.ip ?? "127.0.0.1";
  let headers = new Headers();

  if (process.env.NODE_ENV === "production") {
    const { limit, reset, remaining } = await ratelimit!.limit(ip);

    if (!remaining) {
      return NextResponse.json("Too many requests.", { status: 429 });
    }

    headers.set("X-RateLimit-Limit", limit.toString());
    headers.set("X-RateLimit-Remaining", remaining.toString());
    headers.set("X-RateLimit-Reset", reset.toString());
  }

  const { player, board } = await req.json();

  const response = await chatCompletion(player, board);
  return NextResponse.json(response, { status: 200, headers: headers });
}
