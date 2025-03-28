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
  max_depth;

  constructor(size) {
    this.size = size;
    this.board = [];
    this.turn = -1;
    this.vs_ai = true;
    this.checkpoints = [];
    this.score1 = 0;
    this.score2 = 0;
    this.max_depth = 2;

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
    // this.selected_x = x;
    // this.selected_y = y;

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
          } else if (this.board[new_x][new_y] instanceof Unit && this.board[new_x][new_y].team !== selected_unit.team) {
            attacks.push([new_x, new_y]);
          }
        }
      }
    }

    return { moves, attacks };
  }

  move_unit(selected_x, selected_y, i, j) {
    this.board[i][j] = this.board[selected_x][selected_y];
    this.board[selected_x][selected_y] = "";
    // this.selected_x = null;
    // this.selected_y = null;

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

    let winner = this.game_over(this.board);
    if (winner !== -1) {
      return winner
    }
    // todo: update color of checkpoint when captured?
    this.change_turn();
    return -1
  }

  attack_unit(selected_x, selected_y, i, j) {
    // todo: synchronize score points and evaluation scores
    let { attack } = this.board[selected_x][selected_y];
    this.board[i][j].hp -= attack;

    this.increase_score(attack / 10);

    if (this.board[i][j].hp <= 0) {
      this.increase_score(this.board[i][j].get_cost());
      this.board[i][j] = "";
    }

    let winner = this.game_over(this.board);
    if (winner !== -1) {
      return winner
    }

    this.change_turn();
    return -1
  }

  increase_score(points) {
    if (this.turn === 1) {
      this.score1 += points;
    } else {
      this.score2 += points;
    }
  }

  game_over(board) {
    // check 1: or all checkpoints captured by one army
    // check 2: if all units of one army are dead
    // todo: or max score reached like 1000?

    // check 1:
    let checkpoints_owned_by_team1 = 0;
    let checkpoints_owned_by_team2 = 0;

    for (let i = 0; i < this.checkpoints.length; i++) {
      let [x, y, owner] = this.checkpoints[i];
      if (owner === 1) {
        checkpoints_owned_by_team1++;
      } else if (owner === 2 || owner === 0) {
        checkpoints_owned_by_team2++;
      }
    }

    if (checkpoints_owned_by_team1 === this.checkpoints.length) {
      return 1;
    } else if (checkpoints_owned_by_team2 === this.checkpoints.length) {
      return this.vs_ai ? 0 : 2;
    }

    // check 2:
    let team1_alive = false;
    let team2_alive = false;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let unit = board[i][j];
        if (unit instanceof Unit) {
          if (unit.team === 1) {
            team1_alive = true;
          } else if (unit.team === 2 || unit.team === 0) {
            team2_alive = true;
          }
        }

        if (team1_alive && team2_alive) {
          break;
        }
      }

      if (team1_alive && team2_alive) {
        break;
      }
    }

    if (team1_alive && !team2_alive) {
      return 1;
    } else if (team2_alive && !team1_alive) {
      return this.vs_ai ? 0 : 2;
    }

    return -1;
  }

  evaluate(board) {
    // returns score for current player
    // todo: make the evaluation scores and their factors appropriate

    /*
    Unit Health: Higher health for the AI's units is good. Lower health for the opponent's units is good.
    Unit Types: Certain unit types (like Commanders or Siege Weapons) might have higher value.
    Checkpoints: Controlling checkpoints is a very important factor.
    Unit Position: Control of central areas or proximity to checkpoints might be valuable.
    // todo: include morale? (wrt distance from commander or death of commander)
    */

    let score = 0;
    let hp_score = 0;
    let cost_score = 0;
    let checkpoint_ownership_score = 0;
    let checkpoint_proximity_score = 0;

    // score if winning position
    if (this.game_over(board) === this.turn) {
      score += 10000;
    }

    // unit health score and unit cost score
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let unit = board[i][j];

        if (unit instanceof Unit) {
          if (unit.team === this.turn) {
            hp_score += unit.hp;
            cost_score += unit.get_cost();
          } else {
            hp_score -= unit.hp;
            cost_score -= unit.get_cost();
          }
        }
      }
      // todo: incorporate below loops in this loop
    }

    // checkpoint ownership score
    // and checkpoint proximity score
    for (let i = 0; i < this.checkpoints.length; i++) {
      let [x, y, owner] = this.checkpoints[i];
      if (owner === this.turn) {
        checkpoint_ownership_score += 1000;
      } else if (owner !== -1) {
        checkpoint_ownership_score -= 1000;
      }

      for (let p = 0; p < this.size; p++) {
        for (let q = 0; q < this.size; q++) {
          let unit = board[p][q];

          if (unit instanceof Unit) {
            let unit_score = unit.hp + unit.get_cost();
            // console.log(unit_score);

            if (unit.team === this.turn) {
              let dist = Math.abs(x - p) + Math.abs(y - q);
              // todo: better dist function (to capture accurate moves like diagonals)
              let dist_score = unit_score / (5 * (dist + 1));
              checkpoint_proximity_score += parseInt(
                dist_score + 0.5 * unit_score
              );
            } else {
              // todo: subtract?
            }
          }
        }
      }
    }
    // todo: ...
    score +=
      hp_score +
      cost_score +
      checkpoint_ownership_score +
      checkpoint_proximity_score;

    if (this.turn === 0)
      console.log(
        "hp_score:",
        hp_score,
        "cost_score:",
        cost_score,
        "checkpoint_ownership_score:",
        checkpoint_ownership_score,
        "checkpoint_proximity_score:",
        checkpoint_proximity_score
      );

    return score;
  }

  minimax(board_copy, depth, maximizingPlayer) {
    if (depth === 0 || this.game_over(board_copy) !== -1) {
      return this.evaluate(board_copy);
    }

    if (maximizingPlayer) {
      // AI's turn (maximize)
      let best_score = -Infinity;

      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (this.board[i][j] instanceof Unit) {
            let { moves, attacks } = this.give_actions(i, j);
            // console.log('depth ', depth, ', unit' + [i, j], "moves", moves);

            for (let move of moves) {
              const board_copy_copy = this.create_board_copy(board_copy);

              let [x, y] = move;

              // move unit
              board_copy_copy[x][y] = board_copy_copy[i][j];
              board_copy_copy[i][j] = "";

              //
              let score = this.minimax(board_copy_copy, depth - 1, false);
              if (score > best_score) {
                best_score = score;
              }

              // undo move
              board_copy_copy[i][j] = board_copy_copy[x][y];
              board_copy_copy[x][y] = "";
            }
          }
        }
      }

      return best_score;
    } else {
      // minimize
      let best_score = Infinity;

      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (this.board[i][j] instanceof Unit) {
            let { moves, attacks } = this.give_actions(i, j);
            for (let move of moves) {
              const board_copy_copy = this.create_board_copy(board_copy);
              let [x, y] = move;

              // move unit
              board_copy_copy[x][y] = board_copy_copy[i][j];
              board_copy_copy[i][j] = "";

              //
              let score = this.minimax(board_copy_copy, depth - 1, true);
              if (score < best_score) {
                best_score = score;
              }

              // undo move
              board_copy_copy[i][j] = board_copy_copy[x][y];
              board_copy_copy[x][y] = "";
            }
          }
        }
      }

      return best_score;
    }
  }

  create_board_copy(board) {
    return board.map((row) =>
      row.map((cell) => {
        if (cell instanceof Unit) {
          // deep copy for unit instances (to preserve methods)
          return Object.assign(
            Object.create(Object.getPrototypeOf(cell)),
            cell
          );
        } else {
          return cell;
        }
      })
    );
  }

  move_ai_turn() {
    let best_action = [null, null];
    let best_score = -Infinity;
    let selected_x = null;
    let selected_y = null;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] instanceof Unit) {
          let { moves, attacks } = this.give_actions(i, j);
          // console.log('unit' + [i, j], "moves", moves);
          for (let move of moves) {
            const board_copy = this.create_board_copy(this.board);

            let [x, y] = move;

            // move unit
            board_copy[x][y] = board_copy[i][j];
            board_copy[i][j] = "";

            //
            let score = this.minimax(
              board_copy,
              this.max_depth,
              this.turn === 0
            );
            // if ((score > best_score && this.turn === 0) || (score < best_score && this.turn === 1)) {
            //   // maximize score if AI's turn
            //   // otherwise minimize score
            //   best_score = score;
            //   best_action = [i, j];
            // }

            if (score > best_score) {
              // this.selected_x = i;
              // this.selected_y = j;
              selected_x = i;
              selected_y = j;
              best_score = score;
              best_action[0] = x;
              best_action[1] = y;
            }

            // undo move
            board_copy[i][j] = board_copy[x][y];
            board_copy[x][y] = "";
          }

          // todo: do same for attacks
        }
      }
    }

    // console.log([this.selected_x, this.selected_y], best_action);
    // console.log([selected_x, selected_y], best_action);

    this.move_unit(selected_x, selected_y, best_action[0], best_action[1]);
  }
}
