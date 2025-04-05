import Chess from "./Chess";
import { Unit } from "./Units";

const copyBoard = (board) => {
  return board.map((row) =>
    row.map((cell) => {
      if (cell !== "" && cell !== "O") return new Unit(cell.team, true, cell);
      else return cell;
    })
  ); // adding marker
};

self.onmessage = (e) => {
  const { board, size, vs_ai, turn, score1, score2, checkpoints, max_depth } =
    e.data;
  const chess = new Chess(
    size,
    true,
    copyBoard(board),
    vs_ai,
    turn,
    score1,
    score2,
    checkpoints,
    max_depth
  ); // create chess instance again
  let w = chess.move_ai_turn();
  self.postMessage({
    w,
    board: chess.board,
    turn: chess.turn,
    score1: chess.score1,
    score2: chess.score2,
    checkpoints: chess.checkpoints,
  });
};
