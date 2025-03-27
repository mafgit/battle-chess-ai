import { useState } from "react";
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

  constructor(size = 16, vs_ai) {
    this.size = size;
    this.board = [];
    for (let i = 0; i < size; i++) {
      this.board.push(new Array(size).fill(""));
    }
    this.turn = 1;
    this.vs_ai = vs_ai;

    // initialize armies
    this.board[0][0] = new SiegeWeapon(1);
    this.board[1][1] = new Healer(1);
    this.board[0][1] = new Archer(1);
    this.board[1][0] = new Archer(1);
    this.board[0][2] = new Knight(1);
    this.board[2][0] = new Knight(1);
    this.board[2][2] = new Commander(1);
    this.board[1][2] = new Soldier(1);
    this.board[2][1] = new Soldier(1);

    this.board[size - 1][size - 1] = new SiegeWeapon(vs_ai ? 0 : 2);
    this.board[size - 2][size - 2] = new Healer(vs_ai ? 0 : 2);
    this.board[size - 2][size - 1] = new Archer(vs_ai ? 0 : 2);
    this.board[size - 1][size - 2] = new Archer(vs_ai ? 0 : 2);
    this.board[size - 3][size - 1] = new Knight(vs_ai ? 0 : 2);
    this.board[size - 1][size - 3] = new Knight(vs_ai ? 0 : 2);
    this.board[size - 3][size - 3] = new Commander(vs_ai ? 0 : 2);
    this.board[size - 2][size - 3] = new Soldier(vs_ai ? 0 : 2);
    this.board[size - 3][size - 2] = new Soldier(vs_ai ? 0 : 2);

    // initialize checkpoints
    const num_checkpoints = 3;
    for (let i = 0; i < num_checkpoints; i++) {
      let x = 0;
      let y = 0;
      while (this.board[x][y] != "") {
        x = getRandomInt(0, size - 1);
        y = getRandomInt(0, size - 1);
      }

      this.board[x][y] = "C";
    }

    // initialize obstacles
    const num_obstacles = 8;
    for (let i = 0; i < num_obstacles; i++) {
      let x = 0;
      let y = 0;
      while (this.board[x][y] != "") {
        x = getRandomInt(0, size - 1);
        y = getRandomInt(0, size - 1);
      }

      this.board[x][y] = "O";
    }
  }
}

function change_turn() {
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

function App() {
  let chess = new Chess(16, true);

  return (
    <div className="App container flex justify-center py-6 gap-12">
      <div className="flex flex-col justify-evenly">
        <h1 className="text-4xl font-bold">BattleChess</h1>

        <div className="flex flex-col gap-2">
          <div className="h-[1px] w-full bg-gray-300 mb-2 rounded-full"></div>
          <h1 className="text-lg font-bold mb-2">Scores</h1>

          <div className="flex justify-between">
            <h1>Player 1</h1>
            <h1 className="font-bold bg-blue-400 rounded-sm text-white px-1">
              400
            </h1>
          </div>

          <div className="flex justify-between">
            <h1>AI</h1>
            <h1 className="font-bold bg-red-400 rounded-sm text-white px-1">
              400
            </h1>
          </div>
          <div className="h-[1px] w-full bg-gray-300 mt-2 rounded-full"></div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-bold mb-2">Menu</h1>
          <button className="px-4 py-2 bg-purple-400 text-white rounded-md">
            New Game vs AI
          </button>
          <button className="px-4 py-2 bg-yellow-400 rounded-md">
            New Game vs Human
          </button>
        </div>
      </div>
      <div className="">
        {chess.board.map((row, i) => {
          return (
            <div className="flex" key={i}>
              {row.map((unit, j) => {
                return (
                  <div
                    key={j}
                    className={
                      "flex items-center justify-center bg-gray-300 w-[30px] h-[30px] rounded-md border-1 " +
                      (!(unit instanceof Unit)
                        ? "border-gray-400"
                        : unit.team === 1
                        ? "border-red-400"
                        : "border-blue-400")
                    }
                  >
                    {unit instanceof Unit ? (
                      <img
                        className={
                          "rounded-md hover:brightness-80 cursor-pointer transition duration-300 " +
                          (unit.team === 1 ? "bg-red-400" : "bg-blue-400")
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
                    ) : unit == "O" ? (
                      "⛰️"
                    ) : unit == "C" ? (
                      "🚩"
                    ) : (
                      unit
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
