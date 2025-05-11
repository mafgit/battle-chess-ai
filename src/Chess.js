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
    this.max_depth = 3;

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
        // For human vs human (teams 1 and 2)
        this.turn = (this.turn === 1) ? 2 : 1;
    } else {
        // For human vs AI (teams 1 and 0)
        // Keep human as team 1 (blue) and AI as team 0 (red)
        this.turn = (this.turn === 1) ? 0 : 1;
    }
}

  give_actions(x, y,board_copy=this.board, turn=this.turn) {
    let selected_unit = board_copy[x][y];
    // this.selected_x = x;
    // this.selected_y = y;

    let moves = [];
    let attacks = [];

    if (selected_unit.team === turn) {
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

  attack_unit(fromx, fromy, selected_x, selected_y) {
    // todo: synchronize score points and evaluation scores
    let { attack } = this.board[fromx][fromy];
    this.board[selected_x][selected_y].hp -= attack;

    this.increase_score(attack);

    if (this.board[selected_x][selected_y].hp <= 0) {
      
      this.board[selected_x][selected_y] = "";
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

  evaluate(chess, turn = this.turn) {
    // returns score for current player
    // todo: make the evaluation scores and their factors appropriate

    /*
    Unit Health: Higher health for the AI's units is good. Lower health for the opponent's units is good.
    Unit Types: Certain unit types (like Commanders or Siege Weapons) might have higher value.
    Checkpoints: Controlling checkpoints is a very important factor.
    Unit Position: Control of central areas or proximity to checkpoints might be valuable.
    // todo: include morale? (wrt distance from commander or death of commander)
    */

    let winning_score = 0;
    let hp_score = 0;
    let cost_score = 0;
    let checkpoint_ownership_score = 0;
    let checkpoint_proximity_score
     = 0;

    // score if winning position
    if (chess.game_over(chess.board) === turn) {
      winning_score += 10000;
    }

    // unit health score and unit cost score
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let unit = chess.board[i][j];

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
    for (let i = 0; i < chess.checkpoints.length; i++) {
      let [x, y, owner] = chess.checkpoints[i];
      
      let checkpoint_importance = 0;
      if (owner === this.turn) {
        checkpoint_importance = 1
        checkpoint_ownership_score += 1000;
      } else {
        if (owner === -1) { // no one is owner
          checkpoint_importance = 3
          checkpoint_ownership_score -= 1000;
        } else { // enemy is owner
          checkpoint_importance = 4
          checkpoint_ownership_score -= 1500;
        }
      }

      for (let p = 0; p < this.size; p++) {
        for (let q = 0; q < this.size; q++) {
          let unit = chess.board[p][q];

          if (unit instanceof Unit) {
            let unit_score = unit.hp + unit.get_cost();
            // console.log(unit_score);

            let dist = Math.max(Math.abs(x - p), Math.abs(y - q)) // chebychev's distance to capture diagonals too
            let dist_score = unit_score * checkpoint_importance / ((dist + 1) * (dist + 1));
            if (unit.team === this.turn) {
              // let dist_score = unit_score * Math.exp(-0.5 * dist);
              checkpoint_proximity_score += parseInt(
                dist_score + 0.5 * unit_score
              );
            } else {
              checkpoint_proximity_score -= parseInt(
                dist_score + 0.5 * unit_score
              );
            }
          }
        }
      }
    }
    // todo: ...
    let score =
      hp_score +
      cost_score +
      checkpoint_ownership_score +
      checkpoint_proximity_score;

    // if (this.turn === 0)
    //   console.log(
    //     "hp_score:",
    //     hp_score,
    //     "cost_score:",
    //     cost_score,
    //     "checkpoint_ownership_score:",
    //     checkpoint_ownership_score,
    //     "checkpoint_proximity_score:",
    //     checkpoint_proximity_score
    //   );

    return score;
  }

alpha_beta_pruning(board_copy, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
  if (depth === 0 || this.game_over(board_copy.board) !== -1) {
    return this.evaluate(board_copy, isMaximizing);
  }
  
  let bestScore = isMaximizing ? -Infinity : Infinity;
  let best_move = null;
  let current_team = isMaximizing ? 0 : 1;
  
  prune_loop:
  for (let i = 0; i < this.size; i++) {
    for (let j = 0; j < this.size; j++) {
      const unit = board_copy.board[i][j];
      if (!(unit instanceof Unit) || unit.team !== current_team) continue;
      
      const { moves, attacks } = this.give_actions(i, j, board_copy.board, current_team);
      
      // Try all valid moves
      for (let [x, y] of moves) {
        const newChess = this.create_chess_copy(board_copy.board);
        newChess.board[x][y] = newChess.board[i][j];
        newChess.board[i][j] = "";
        
        const score = this.alpha_beta_pruning(newChess, depth - 1, !isMaximizing, alpha, beta);
        
        if (isMaximizing) {
          if(depth == this.max_depth && score > bestScore)
            best_move = {from:{fromX: i, fromY: j}, to:{toX:x, toY:y}, isAttack:false}

          bestScore = Math.max(bestScore, score);
          alpha = Math.max(alpha, score);
        } else {
          bestScore = Math.min(bestScore, score);
          beta = Math.min(beta, score);
        }
        
        if (beta <= alpha) break prune_loop;
      }
      
      for (let [x, y] of attacks) {
        const newChess = this.create_chess_copy(board_copy.board);
        const attacker = newChess.board[i][j];
        const target = newChess.board[x][y];
        
        if (target instanceof Unit) {
          target.hp -= attacker.attack;
          if (target.hp <= 0) {
            newChess.board[x][y] = "";
          }
        }
        
        const score = this.alpha_beta_pruning(newChess, depth - 1, !isMaximizing, alpha, beta);
        
        if (isMaximizing) {
          if(depth == this.max_depth && score > bestScore)
            best_move = {from:{fromX: i, fromY: j}, to:{toX:x, toY:y}, isAttack:true}

          bestScore = Math.max(bestScore, score);
          alpha = Math.max(alpha, score);
        } else {
          bestScore = Math.min(bestScore, score);
          beta = Math.min(beta, score);
        }
        
        if (beta <= alpha) break prune_loop;
      }
    }
  }
  
  if(depth == this.max_depth) {
    return best_move;
  }
  return bestScore;
}

create_chess_copy(board) {
    // Create deep copy of checkpoints
    const checkpoints_copy = this.checkpoints.map(checkpoint => [...checkpoint]);
    
    // Create deep copy of board
    const board_copy = board.map((row) =>
      row.map((cell) => {
        if (cell instanceof Unit) {
          return Object.assign(
            Object.create(Object.getPrototypeOf(cell)),
            cell
          );
        } else {
          return cell;
        }
      })
    );

    // Create a new Chess instance for the copy
    const chess_copy = new Chess(this.size);
    chess_copy.board = board_copy;
    chess_copy.checkpoints = checkpoints_copy;
    chess_copy.turn = this.turn;
    chess_copy.vs_ai = this.vs_ai;
    chess_copy.score1 = this.score1;
    chess_copy.score2 = this.score2;
    chess_copy.max_depth = this.max_depth;

    return chess_copy;
}

move_ai_turn() {
  const chessCopy = this.create_chess_copy(this.board);
  let bestMove = this.alpha_beta_pruning(chessCopy, this.max_depth, true);
  if (!bestMove) return false;

  const {fromX, fromY} = bestMove.from;
  const {toX, toY} = bestMove.to;

  if (bestMove.isAttack) {
    return this.attack_unit(fromX, fromY, toX, toY); 
  } else {
    return this.move_unit(fromX, fromY, toX, toY);
  }
}

}
