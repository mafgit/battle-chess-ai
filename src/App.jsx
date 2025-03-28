import { useEffect, useState } from "react";
import "./App.css";

class Unit {
  hp;
  attack;
  range;
  team;
  name;
  movement;

  constructor(team) {
    this.hp = 100;
    this.attack = 50;
    this.range = 1;
    this.team = team; // 1 and 2 for players, 0 for AI
    this.name = "Unit";
    this.movement = 1;
  }
}

class Knight extends Unit {
  constructor(team) {
    super(team);
    this.attack = 70;
    this.range = 1;
    this.name = "Knight";
    this.movement = 2;
  }
}

class Archer extends Unit {
  constructor(team) {
    super(team);
    this.attack = 50;
    this.range = 2;
    this.name = "Archer";
  }
}

class Soldier extends Unit {
  constructor(team) {
    super(team);
    this.attack = 30;
    this.name = "Soldier";
  }
}

class SiegeWeapon extends Unit {
  constructor(team) {
    super(team);
    this.attack = 100;
    this.range = 2;
    this.name = "SiegeWeapon";
  }
}

class Healer extends Unit {
  constructor(team) {
    super(team);
    this.attack = 10;
    this.name = "Healer";
  }
}

class Commander extends Unit {
  constructor(team) {
    super(team);
    this.attack = 50;
    this.name = "Commander";
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Chess {
  size;
  board;
  turn;
  vs_ai;

  constructor(size) {
    this.size = size;
    this.board = [];
    this.turn = 1;
    this.vs_ai = true;

    for (let i = 0; i < size; i++) {
      this.board.push(new Array(size).fill(""));
    }
  }

  start(vs_ai) {
    this.vs_ai = vs_ai;
    this.turn = 1;
    this.board = [];

    for (let i = 0; i < this.size; i++) {
      this.board.push(new Array(this.size).fill(""));
    }

    // initialize armies
    this.board[0][0] = new SiegeWeapon(1, 0, 0);
    this.board[1][1] = new Healer(1, 1, 1);
    this.board[0][1] = new Archer(1, 0, 1);
    this.board[1][0] = new Archer(1, 1, 0);
    this.board[0][2] = new Knight(1, 0, 2);
    this.board[2][0] = new Knight(1, 2, 0);
    this.board[2][2] = new Commander(1, 2, 2);
    this.board[1][2] = new Soldier(1, 1, 2);
    this.board[2][1] = new Soldier(1, 2, 1);

    this.board[this.size - 1][this.size - 1] = new SiegeWeapon(
      vs_ai ? 0 : 2,
      this.size - 1,
      this.size - 1
    );
    this.board[this.size - 2][this.size - 2] = new Healer(
      vs_ai ? 0 : 2,
      this.size - 2,
      this.size - 2
    );
    this.board[this.size - 2][this.size - 1] = new Archer(
      vs_ai ? 0 : 2,
      this.size - 2,
      this.size - 1
    );
    this.board[this.size - 1][this.size - 2] = new Archer(
      vs_ai ? 0 : 2,
      this.size - 1,
      this.size - 2
    );
    this.board[this.size - 3][this.size - 1] = new Knight(
      vs_ai ? 0 : 2,
      this.size - 3,
      this.size - 1
    );
    this.board[this.size - 1][this.size - 3] = new Knight(
      vs_ai ? 0 : 2,
      this.size - 1,
      this.size - 3
    );
    this.board[this.size - 3][this.size - 3] = new Commander(
      vs_ai ? 0 : 2,
      this.size - 3,
      this.size - 3
    );
    this.board[this.size - 2][this.size - 3] = new Soldier(
      vs_ai ? 0 : 2,
      this.size - 2,
      this.size - 3
    );
    this.board[this.size - 3][this.size - 2] = new Soldier(
      vs_ai ? 0 : 2,
      this.size - 3,
      this.size - 2
    );

    // initialize checkpoints
    const num_checkpoints = 3;
    for (let i = 0; i < num_checkpoints; i++) {
      let x = 0;
      let y = 0;
      while (this.board[x][y] != "") {
        x = getRandomInt(0, this.size - 1);
        y = getRandomInt(0, this.size - 1);
      }

      this.board[x][y] = "C";
    }

    // initialize obstacles
    const num_obstacles = 8;
    for (let i = 0; i < num_obstacles; i++) {
      let x = 0;
      let y = 0;
      while (this.board[x][y] != "") {
        x = getRandomInt(0, this.size - 1);
        y = getRandomInt(0, this.size - 1);
      }

      this.board[x][y] = "O";
    }
  }

  change_turn() {
    if (!this.vs_ai) {
      if (this.turn === 1) {
        this.turn = 2;
      } else {
        this.turn = 1;
      }
    } else {
      if (this.turn === 1) {
        this.turn = 0;
      } else {
        this.turn = 1;
      }
    }
  }

  give_actions(x, y) {
    let selected_unit = this.board[x][y];
    this.selected_x = x;
    this.selected_y = y;

    let moves = [];
    let attacks = [];

    if (selected_unit.team === this.turn) {
      let arr = [0];
      for (let i = 1; i <= selected_unit.movement; i++) {
        arr.push(i);
        arr.push(-i);
      }

      let allowed = [
        [0, 1], // Right
        [0, -1], // Left
        [1, 0], // Down
        [-1, 0], // Up
        [1, 1], // Down-Right
        [1, -1], // Down-Left
        [-1, 1], // Up-Right
        [-1, -1], // Up-Left
      ];

      if (selected_unit.movement === 2) {
        allowed = [
          ...allowed,
          [0, 2], // 2 Right
          [0, -2], // 2 Left
          [2, 0], // 2 Down
          [-2, 0], // 2 Up
          [2, 2], // 2 Down-Right
          [2, -2], // 2 Down-Left
          [-2, 2], // 2 Up-Right
          [-2, -2], // 2 Up-Left
        ];
      }

      for (let [i, j] of allowed) {
        let new_x = x + i;
        let new_y = y + j;
        if (
          new_x >= 0 &&
          new_x < this.size &&
          new_y >= 0 &&
          new_y < this.size
        ) {
          if (
            this.board[new_x][new_y] === "" ||
            this.board[new_x][new_y] === "C"
          ) {
            moves.push([new_x, new_y]);
          } else if (this.board[new_x][new_y].team !== selected_unit.team) {
            attacks.push([new_x, new_y]);
          }
        }
      }
    }

    return { moves, attacks };
  }

  move_unit(i, j) {
    this.board[i][j] = this.board[this.selected_x][this.selected_y];
    this.board[this.selected_x][this.selected_y] = "";
    // fix: rewrite C in place of unit
    this.selected_x = null;
    this.selected_y = null;

    // todo: check for checkpoint, game over, etc
    // todo: update score
    this.change_turn();
  }

  attack_unit(i, j) {
    this.board[i][j].hp -= this.board[this.selected_x][this.selected_y].attack;

    if (this.board[i][j].hp <= 0) {
      this.board[i][j] = ""; // fix: rewrite C in place of unit
    }

    this.change_turn();
  }
}

let size = window.innerWidth > 580 ? 16 : window.innerWidth > 400 ? 12 : 10;
const chess = new Chess(7);
function App() {
  const [moves, setMoves] = useState([]);
  const [attacks, setAttacks] = useState([]);
  // const [chess, setChess] = useState(new Chess(7));
  const [board, setBoard] = useState(chess.board);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    chess.start(true);
    setBoard(chess.board);
  }, []);

  return (
    <div className="App container flex justify-center py-6 gap-12">
      <div className="flex flex-col justify-evenly left-div">
        <h1 className="text-4xl font-bold">⚔️ BattleChess</h1>

        <div className="flex flex-col gap-2">
          <div className="h-[1px] w-full bg-gray-300 mb-2 rounded-full"></div>
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
              0
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
              0
            </h1>
          </div>
          <div className="h-[1px] w-full bg-gray-300 mt-2 rounded-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold mb-2">Menu</h1>
          <button
            className="px-4 py-2 bg-purple-400 text-white rounded-md"
            onClick={() => {
              chess.start(true);
              setBoard(chess.board)
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
              setBoard(chess.board)
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
                          chess.move_unit(i, j);
                          setMoves([]);
                          setAttacks([]);
                          return;
                        } else if (
                          attacks.some(
                            (attack) => attack[0] === i && attack[1] === j
                          )
                        ) {
                          chess.attack_unit(i, j);
                          setMoves([]);
                          setAttacks([]);
                          return;
                        } else {
                          // hide moves
                          setMoves([]);
                          setAttacks([]);
                        }
                      }

                      if (unit instanceof Unit) {
                        let { moves, attacks } = chess.give_actions(i, j);
                        setMoves(moves);
                        setAttacks(attacks);
                        setSelected(true);
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
                    ) : unit == "C" ? (
                      <>
                        <p>🚩</p>
                        {moves.some(
                          (move) => move[0] === i && move[1] === j
                        ) ? (
                          <img
                            src="move.png"
                            className="opacity-35 absolute w-full h-full top-0 left-0"
                            alt=""
                          />
                        ) : (
                          ""
                        )}
                      </>
                    ) : moves.some((move) => move[0] === i && move[1] === j) ? (
                      <img
                        src="move.png"
                        className="opacity-35 absolute w-full h-full top-0 left-0"
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
