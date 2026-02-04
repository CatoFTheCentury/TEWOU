import * as TEWOU from 'TEWOU'

var game: GrawlSnakeGame;
var deadScreen: DeadScreen;
const squaresize = 32;
const boardsize = 20;
const refreshrate = 150;

class GrawlSnakeGame extends TEWOU.ActionGame {
  gamefolder = "arbre";
  fileextensions = ['gani', 'png', 'ini'];
  score: number = 0;

  snakeHeadIdle: Array<any> = [];
  snakeHeadWalk: Array<any> = [];
  snakeBodyIdle: Array<any> = [];
  snakeBodyWalk: Array<any> = [];
  appleanim: Array<any> = [];

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, squaresize * boardsize, squaresize * boardsize);
    canvas.style.border = "3px solid #00ff00";
    canvas.style.position = "absolute";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    this.score = 0;
  }

  public async load(): Promise<void> {
    await super.load();
    this.snakeHeadIdle = this.parseGani("_assets/arbre/idle.gani");
    this.snakeHeadWalk = this.parseGani("_assets/arbre/walk.gani");
    this.snakeBodyIdle = this.parseGani("_assets/arbre/idle.gani");
    this.snakeBodyWalk = this.parseGani("_assets/arbre/walk.gani");
    this.appleanim = this.parseGani("_assets/arbre/idle.gani");
  }
}

class Apple extends TEWOU.Fauna {
  gridx: number;
  gridy: number;

  constructor() {
    let newpos = {
      x: Math.floor(Math.random() * boardsize),
      y: Math.floor(Math.random() * boardsize)
    };

    let freespot = false;
    while (!freespot) {
      freespot = true;
      for (let p of Snake.parts) {
        if (newpos.x == p.gridx && newpos.y == p.gridy) {
          newpos = {
            x: Math.floor(Math.random() * boardsize),
            y: Math.floor(Math.random() * boardsize)
          };
          freespot = false;
        }
      }
    }

    super(new TEWOU.Frame(game.glContext, game.shadercontext, [game.appleanim[2]]));

    this.gridx = newpos.x;
    this.gridy = newpos.y;
    this.pos.x = newpos.x * squaresize;
    this.pos.y = newpos.y * squaresize;
    this.hitbox = { x: 0, y: 0, w: squaresize, h: squaresize };

    game.addAsCollision(this,
      TEWOU.CollideLayers.npc,
      TEWOU.CollideLayers.npc,
      TEWOU.CollideTypes.none
    );

    game.registerEntity(this);
  }

  react(owner: any, str: string, arr: any[]): boolean {
    if (owner.ate) {
      owner.ate();
      new Apple();
      this.destroy();
    }
    return true;
  }
}

class Snake extends TEWOU.Player {
  static length = 4;
  static startpos = Math.floor(boardsize / 2);
  static parts: SnakePart[] = [];
  static headpos: { x: number; y: number };

  nextdir = 3;
  lastdir = 3;

  constructor() {
    super(game.newRectangle({ x: 0, y: 0, w: 1, h: 1 }, { r: 0, g: 0, b: 0, a: 0 }));

    Snake.headpos = { x: Snake.startpos, y: Snake.startpos };
    Snake.parts = [];

    for (let i = 0; i < Snake.length; i++) {
      const isHead = i === Snake.length - 1;
      Snake.parts.push(new SnakePart(Snake.startpos - i, Snake.startpos, isHead ? 'head' : 'body', 3));
    }

    this.addTimeout([refreshrate], {
      triggered: (timeout) => {
        this.advance();
      }
    });

    this.registerKey('w', { keydown: () => { if (this.lastdir != 2) this.nextdir = 0; } });
    this.registerKey('ArrowUp', { keydown: () => { if (this.lastdir != 2) this.nextdir = 0; } });
    this.registerKey('a', { keydown: () => { if (this.lastdir != 3) this.nextdir = 1; } });
    this.registerKey('ArrowLeft', { keydown: () => { if (this.lastdir != 3) this.nextdir = 1; } });
    this.registerKey('s', { keydown: () => { if (this.lastdir != 0) this.nextdir = 2; } });
    this.registerKey('ArrowDown', { keydown: () => { if (this.lastdir != 0) this.nextdir = 2; } });
    this.registerKey('d', { keydown: () => { if (this.lastdir != 1) this.nextdir = 3; } });
    this.registerKey('ArrowRight', { keydown: () => { if (this.lastdir != 1) this.nextdir = 3; } });
  }

  advance() {
    const newHead = { x: Snake.headpos.x, y: Snake.headpos.y };

    if (this.nextdir == 0) newHead.y -= 1;
    if (this.nextdir == 1) newHead.x -= 1;
    if (this.nextdir == 2) newHead.y += 1;
    if (this.nextdir == 3) newHead.x += 1;

    this.lastdir = this.nextdir;

    if (newHead.x >= boardsize || newHead.y >= boardsize || newHead.x < 0 || newHead.y < 0) {
      deadScreen.dies();
      this.destroy();
      return;
    }

    const oldHead = Snake.parts[Snake.parts.length - 1];
    const newHeadPart = new SnakePart(newHead.x, newHead.y, 'head', this.nextdir);

    if (oldHead) {
      newHeadPart.startX = oldHead.targetX;
      newHeadPart.startY = oldHead.targetY;
      newHeadPart.pos.x = oldHead.targetX;
      newHeadPart.pos.y = oldHead.targetY;
      newHeadPart.moveProgress = 0;
    }

    Snake.headpos = newHead;
    Snake.parts.push(newHeadPart);

    if (Snake.parts.length > 1) {
      Snake.parts[Snake.parts.length - 2].updateType('body');
    }

    // Make all body parts follow the part in front of them
    for (let i = Snake.parts.length - 2; i >= 0; i--) {
      const currentPart = Snake.parts[i];
      const nextPart = Snake.parts[i + 1];

      currentPart.startX = currentPart.targetX;
      currentPart.startY = currentPart.targetY;
      currentPart.targetX = nextPart.startX;
      currentPart.targetY = nextPart.startY;
      currentPart.gridx = Math.round(currentPart.targetX / squaresize);
      currentPart.gridy = Math.round(currentPart.targetY / squaresize);
      currentPart.moveProgress = 0;
    }

    if (Snake.parts.length > Snake.length) {
      const removed = Snake.parts.shift();
      if (removed) removed.destroy();
    }
  }
}

class SnakePart extends TEWOU.Fauna {
  gridx: number;
  gridy: number;
  partType: string;
  direction: number;
  idleAnim: Array<any>;
  walkAnim: Array<any>;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  moveProgress: number = 1;
  moveSpeed: number = 0.15;

  constructor(gridx: number, gridy: number, partType: string = 'body', direction: number = 3) {
    let idleAnim, walkAnim;
    if (partType === 'head') {
      idleAnim = game.snakeHeadIdle;
      walkAnim = game.snakeHeadWalk;
    } else {
      idleAnim = game.snakeBodyIdle;
      walkAnim = game.snakeBodyWalk;
    }

    super(new TEWOU.Frame(game.glContext, game.shadercontext, [walkAnim[direction]]));

    this.partType = partType;
    this.direction = direction;
    this.idleAnim = idleAnim;
    this.walkAnim = walkAnim;
    this.gridx = gridx;
    this.gridy = gridy;
    this.targetX = gridx * squaresize;
    this.targetY = gridy * squaresize;
    this.startX = gridx * squaresize;
    this.startY = gridy * squaresize;
    this.pos.x = gridx * squaresize;
    this.pos.y = gridy * squaresize;
    this.hitbox = { x: 0, y: 0, w: squaresize, h: squaresize };

    game.addAsCollision(this,
      TEWOU.CollideLayers.npc,
      TEWOU.CollideLayers.npc,
      TEWOU.CollideTypes.none
    );

    if (partType === 'head') {
      game.addCapture({
        collideswith: TEWOU.CollideLayers.npc,
        type: TEWOU.CollideTypes.none,
        hitbox: { x: 0, y: 0, w: squaresize, h: squaresize },
        owner: this,
        oncollision: (owner: any, target: any) => {
          if (target.react) {
            target.react(owner, "", []);
          }
        }
      });
    }

    game.registerEntity(this);
  }

  updateType(newType: string) {
    if (newType !== this.partType) {
      if (newType === 'head') {
        this.idleAnim = game.snakeHeadIdle;
        this.walkAnim = game.snakeHeadWalk;
      } else {
        this.idleAnim = game.snakeBodyIdle;
        this.walkAnim = game.snakeBodyWalk;
      }
      this.partType = newType;
    }
    if (this.myFrame && this.walkAnim && this.walkAnim[this.direction]) {
      this.myFrame.frame = [this.walkAnim[this.direction]];
    }
  }

  update() {
    super.update();

    if (this.moveProgress < 1) {
      this.moveProgress += this.moveSpeed;
      if (this.moveProgress > 1) this.moveProgress = 1;

      const t = this.easeInOutQuad(this.moveProgress);
      this.pos.x = this.startX + (this.targetX - this.startX) * t;
      this.pos.y = this.startY + (this.targetY - this.startY) * t;
    }
  }

  easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  setDirection(dir: number) {
    this.direction = dir;
    if (this.myFrame && this.walkAnim && this.walkAnim[dir]) {
      this.myFrame.frame = [this.walkAnim[dir]];
    }
  }

  ate() {
    Snake.length += 1;
    game.score += 10;
  }

  react(owner: any, str: string, arr: any[]) {
    if (this !== owner && this.partType !== 'head') {
      deadScreen.dies();
    }
  }
}

class DeadScreen extends TEWOU.Fauna {
  constructor() {
    super(game.newRectangle(
      { x: 0, y: 0, w: boardsize * squaresize, h: boardsize * squaresize },
      { r: 100, g: 0, b: 0, a: 200 }
    ));
    this.myFrame.rprops.hidden = true;
    game.registerEntity(this);
  }

  dies() {
    this.myFrame.rprops.hidden = false;
  }
}

game = new GrawlSnakeGame(document.getElementById('canvas') as HTMLCanvasElement);
TEWOU.Engine.start(game).then(() => {
  const player = new Snake();
  game.registerEntity(player);
  deadScreen = new DeadScreen();
  new Apple();
  TEWOU.Engine.games.push(game);
  TEWOU.Engine.mainLoop();
});
