import OpenAI from "openai";
import { CurrentPlayerProps } from "@/app/page";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatCompletion = async (
  currentPlayer: CurrentPlayerProps,
  board: string[],
  size: number
) => {
  const res = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Recommend me tic-tac-toe moves. My mark is "${
          currentPlayer.mark
        }". The board is ${board.join(",")}. The board is ${
          board.length
        } elements long. The board is a ${size} * ${size} grid. Replace an "E" with your mark "${
          currentPlayer.mark
        }" and respond with the new board as a comma seperated list, which needs to have exactly ${
          board.length
        } elements.
      Now add a new "${currentPlayer.mark}" in place of one "E": ${board.join(
          ","
        )}. Respond ONLY with the list.`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const message = res.choices[0].message.content;

  return message;
};
