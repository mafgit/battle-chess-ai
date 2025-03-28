import { useEffect, useState } from "react";
import "./App.css";
import Chess from "./Chess";
import { Unit } from "./Units";

let size = window.innerWidth > 580 ? 16 : window.innerWidth > 400 ? 12 : 10;
const chess = new Chess(7);
function App() {
  const [moves, setMoves] = useState([]);
  const [attacks, setAttacks] = useState([]);
  // const [chess, setChess] = useState(new Chess(7));
  const [board, setBoard] = useState(chess.board);
  const [selected, setSelected] = useState(false);
  const [selectedX, setSelectedX] = useState(0);
  const [selectedY, setSelectedY] = useState(0);

  useEffect(() => {
    // chess.start(true);
    setBoard(chess.board);
  }, []);

  return (
    <div className="App container flex justify-center py-6 gap-12">
      <div className="flex flex-col justify-evenly left-div">
        <h1 className="text-4xl font-bold">⚔️ BattleChess</h1>

        <div className="flex flex-col gap-2">
          <div className="h-[1px] w-full bg-gray-300 my-4 rounded-full"></div>
          <h1 className="text-lg font-bold mb-2">Scores</h1>

          <div className="flex justify-between">
            <h1
              className={
                chess.turn === 1 ? "text-green-600 italic font-bold" : ""
              }
            >
              {chess.vs_ai ? "You" : "Player 1"}
              {chess.turn === 1 ? "*" : ""}
            </h1>
            <h1 className="font-bold bg-blue-400 rounded-sm text-white px-1">
              {chess.score1}
            </h1>
          </div>

          <div className="flex justify-between">
            <h1
              className={
                chess.turn !== 1 ? "text-green-600 italic font-bold" : ""
              }
            >
              {chess.vs_ai ? "AI" : "Player 2"}
              {chess.turn !== 1 ? "*" : ""}
            </h1>
            <h1 className="font-bold bg-red-400 rounded-sm text-white px-1">
              {chess.score2}
            </h1>
          </div>
          <div className="h-[1px] w-full bg-gray-300 my-4 rounded-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold mb-2">Menu</h1>
          <button
            className="px-4 py-2 bg-purple-400 text-white rounded-md"
            onClick={() => {
              chess.start(true);
              setBoard(chess.board);
              setMoves([]);
              setAttacks([]);
            }}
          >
            ✨ New Game vs AI
          </button>
          <button
            className="px-4 py-2 bg-green-400 text-black rounded-md"
            onClick={() => {
              chess.start(false);
              setBoard(chess.board);
              setMoves([]);
              setAttacks([]);
            }}
          >
            🤝 New Game vs Human
          </button>
          <button className="px-4 py-2 bg-yellow-300 rounded-md">
            📋 Game Rules
          </button>
        </div>
      </div>
      <div className="board flex flex-col flex-gap gap-[1px]">
        {board.map((row, i) => {
          return (
            <div className="flex gap-[1px]" key={i}>
              {row.map((unit, j) => {
                return (
                  <div
                    key={j}
                    onClick={() => {
                      setSelected(false);
                      if (selected) {
                        // if clicked on valid move
                        if (
                          moves.some((move) => move[0] === i && move[1] === j)
                        ) {
                          chess.move_unit(selectedX, selectedY, i, j);
                          setMoves([]);
                          setAttacks([]);
                          if (chess.vs_ai) chess.move_ai_turn();
                          return;
                        } else if (
                          attacks.some(
                            (attack) => attack[0] === i && attack[1] === j
                          )
                        ) {
                          // if clicked on valid attack
                          chess.attack_unit(selectedX, selectedY, i, j);
                          setMoves([]);
                          setAttacks([]);
                          return;
                        } else {
                          // if clicked elsewhere, hide moves
                          setMoves([]);
                          setAttacks([]);
                          setSelected(false);
                        }
                      }

                      if (unit instanceof Unit) {
                        setSelected(true);
                        setSelectedX(i)
                        setSelectedY(j)
                        let { moves, attacks } = chess.give_actions(i, j);
                        setMoves(moves);
                        setAttacks(attacks);
                      }
                    }}
                    className={
                      "unit hover:brightness-80 cursor-pointer transition duration-300 relative flex items-center justify-center bg-gray-300 w-[33px] h-[33px] min-w-[33px] min-h-[33px] rounded-md border-1 " +
                      (!(unit instanceof Unit)
                        ? "border-gray-400"
                        : unit.team === 1
                        ? "border-blue-400"
                        : "border-red-400")
                    }
                  >
                    {unit instanceof Unit ? (
                      <div>
                        <img
                          className={
                            "rounded-md z-0 " +
                            (unit.team === 1 ? "bg-blue-400" : "bg-red-400")
                          }
                          src={
                            unit.name +
                            (unit.name === "SiegeWeapon" ||
                            unit.name === "Commander"
                              ? ".webp"
                              : unit.name === "Archer" ||
                                unit.name === "Healer" ||
                                unit.name === "Knight" ||
                                unit.name === "Knight"
                              ? ".jpg"
                              : ".png")
                          }
                          alt={unit.name}
                        />

                        <div className="rounded-b-full w-full h-[4px] bg-red-400 z-50 absolute bottom-[-1px] left-0">
                          <div
                            className={`h-full bg-green-400 w-[${unit.hp}%] rounded-b-full`}
                          ></div>
                        </div>

                        {attacks.some(
                          (attack) => attack[0] === i && attack[1] === j
                        ) ? (
                          <img
                            src="attack.png"
                            className="opacity-60 absolute w-full h-full top-0 left-0"
                            alt=""
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    ) : unit == "O" ? (
                      "⛰️"
                    ) : (
                      ""
                    )}

                    {chess.checkpoints.some(
                      (checkpoint) => checkpoint[0] === i && checkpoint[1] === j
                    ) ? (
                      <div className="opacity-35 w-full h-full bg-gray-300 absolute top-0 left-0">
                        <p className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                          🚩
                        </p>
                      </div>
                    ) : (
                      ""
                    )}

                    {moves.some((move) => move[0] === i && move[1] === j) ? (
                      <img
                        src="move.png"
                        className="opacity-35 absolute w-[20px] h-[20px] top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
                        alt=""
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* <a href="https://www.flaticon.com/free-icons/knight" title="knight icons">
        Knight icons created by Leremy - Flaticon
      </a> */}
    </div>
  );
}

export default App;
