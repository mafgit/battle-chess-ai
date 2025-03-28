import {
  Unit,
  Knight,
  Archer,
  Soldier,
  Healer,
  Commander,
  SiegeWeapon,
} from "./Units";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Chess {
  size;
  board;
  turn;
  vs_ai;
  checkpoints;
  score1;
  score2;

  constructor(size) {
    this.size = size;
    this.board = [];
    this.turn = 1;
    this.vs_ai = true;
    this.checkpoints = [];
    this.score1 = 0;
    this.score2 = 0;

    for (let i = 0; i < size; i++) {
      this.board.push(new Array(size).fill(""));
    }
  }

  start(vs_ai) {
    this.vs_ai = vs_ai;
    this.turn = 1;
    this.board = [];
    this.checkpoints = [];
    this.score1 = 0;
    this.score2 = 0;

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
      this.checkpoints.push([x, y, -1]);
    }

    // initialize obstacles
    const num_obstacles =
      this.size === 16 ? 20 : this.size === 12 ? 17 : this.size === 10 ? 12 : 8;

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
    this.selected_x = null;
    this.selected_y = null;

    for (let index = 0; index < this.checkpoints.length; index++) {
      let [x, y, owner] = this.checkpoints[index];
      if (x === i && y === j) {
        if (owner !== this.turn) {
          this.increase_score(50);
          this.checkpoints[index][2] = this.turn;
        }

        break;
      }
    }

    // todo: check for game over, etc
    // todo: update color of checkpoint when captured
    this.change_turn();
  }

  attack_unit(i, j) {
    let { attack } = this.board[this.selected_x][this.selected_y];
    this.board[i][j].hp -= attack;

    this.increase_score(attack / 10);

    if (this.board[i][j].hp <= 0) {
      this.increase_score(this.board[i][j].get_cost());
      this.board[i][j] = "";
    }

    this.change_turn();
  }

  increase_score(points) {
    if (this.turn === 1) {
      this.score1 += points;
    } else {
      this.score2 += points;
    }
  }

  evaluate() {
    /*
    Unit Health: Higher health for the AI's units is good. Lower health for the opponent's units is good.
    Unit Position: Control of central areas or proximity to checkpoints might be valuable.
    Unit Types: Certain unit types (like Commanders or Siege Weapons) might have higher value.
    Checkpoints: Controlling checkpoints is a very important factor.
    Distance to enemy commander: try to minimize the distance between the AI units and the enemy commander.
    */

    let score = 0;
    // todo: ...

    return score
  }
}
