export class Unit {
  hp;
  attack;
  range;
  team;
  name;
  movement;
  max_hp

  constructor(team) {
    this.hp = 100; // todo: implement max hp and healer
    this.max_hp = this.hp;
    this.attack = 50;
    this.range = 1;
    this.team = team; // 1 and 2 for players, 0 for AI
    this.name = "Unit";
    this.movement = 1;
  }

  get_cost() {
    return this.attack / 10 + this.max_hp / 10 + (this.range * 10) + (this.movement * 10);
  }
}

export class Knight extends Unit {
  constructor(team) {
    super(team);
    this.attack = 70;
    this.range = 1;
    this.name = "Knight";
    this.movement = 2;
  }
}

export class Archer extends Unit {
  constructor(team) {
    super(team);
    this.attack = 50;
    this.range = 2;
    this.name = "Archer";
  }
}

export class Soldier extends Unit {
  constructor(team) {
    super(team);
    this.attack = 30;
    this.name = "Soldier";
  }
}

export class SiegeWeapon extends Unit {
  constructor(team) {
    super(team);
    this.attack = 100;
    this.range = 2;
    this.name = "SiegeWeapon";
  }
}

export class Healer extends Unit {
  constructor(team) {
    super(team);
    this.attack = 10;
    this.name = "Healer";
  }
}

export class Commander extends Unit {
  constructor(team) {
    super(team);
    this.attack = 50;
    this.name = "Commander";
  }
}
