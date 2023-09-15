import OpenAI from "openai";
import { Board } from "../components/HomeClient";
import { Player } from "./gameLogic/usePlayer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatCompletion = async (player: Player, board: Board) => {
  const newBoard = { ...board, board: [...board.board] };
  const emptyIndices = newBoard.board
    .map((val, idx) => (val === "E" ? idx : -1))
    .filter((idx) => idx !== -1);

  const generateRandomMarkIndex = () =>
    Math.floor(Math.random() * newBoard.board.length);
  let randomMarkIndex = generateRandomMarkIndex();

  while (!emptyIndices.includes(randomMarkIndex)) {
    randomMarkIndex = generateRandomMarkIndex();
    if (emptyIndices.length === 0) return;
  }
  newBoard.board[randomMarkIndex] = player.opponent;

  const exampleResponseBoard = newBoard.board.join(",");

  const res = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You're a tic-tac-toe move generator. Your mark is "${
          player.opponent
        }". Your opponent is "${
          player.player
        }" The current board is ${board.board.join(
          ","
        )}. "E" means empty. Replace an "E" with your mark "${
          player.opponent
        }" to make your turn. You respond with a edited a comma seperated list of the board, with the correct length of ${
          board.size
        } elements. Example response(this is just an example): ${exampleResponseBoard}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const message = res.choices[0].message.content;

  return message;
};
