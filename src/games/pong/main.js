var game;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 8;
const INITIAL_BALL_SPEED = 5;
const WINNING_SCORE = 5;

class PongGame extends TEWOU.ActionGame {
  constructor(canvas) {
    super(canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.style.border = "3px solid #ffffff";
    canvas.style.position = "absolute";
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    this.gamename = "pong";
    this.fileextensions = ['png'];
    this.player1Score = 0;
    this.player2Score = 0;
  }

  async load() {
    await super.load();
  }

  updateScore() {
    // Score is tracked in the game object
  }

  updateScoreDisplay() {
    // Scores update automatically through ScoreDisplay.update()
  }

  reset() {
    this.player1Score = 0;
    this.player2Score = 0;
  }
}

class Paddle extends TEWOU.Fauna {
  constructor(isPlayer1) {
    const x = isPlayer1 ? 30 : CANVAS_WIDTH - 30 - PADDLE_WIDTH;
    const y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;

    super(game.newRectangle(
      { x: 0, y: 0, w: PADDLE_WIDTH, h: PADDLE_HEIGHT },
      { r: 255, g: 255, b: 255, a: 255 }
    ));

    this.isPlayer1 = isPlayer1;
    this.pos.x = x;
    this.pos.y = y;
    this.hitbox = { x: 0, y: 0, w: PADDLE_WIDTH, h: PADDLE_HEIGHT };
    this.moveUp = false;
    this.moveDown = false;

    game.addAsCollision(this,
      TEWOU.CollideLayers.npc,
      TEWOU.CollideLayers.npc,
      TEWOU.CollideTypes.none
    );

    game.registerEntity(this);
  }

  update() {
    super.update();

    if (this.moveUp) {
      this.pos.y -= PADDLE_SPEED;
      if (this.pos.y < 0) this.pos.y = 0;
    }
    if (this.moveDown) {
      this.pos.y += PADDLE_SPEED;
      if (this.pos.y > CANVAS_HEIGHT - PADDLE_HEIGHT) {
        this.pos.y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    }
  }
}

class Ball extends TEWOU.Fauna {
  constructor() {
    super(game.newRectangle(
      { x: 0, y: 0, w: BALL_SIZE, h: BALL_SIZE },
      { r: 255, g: 255, b: 255, a: 255 }
    ));

    this.speed = INITIAL_BALL_SPEED;
    this.velocityX = 0;
    this.velocityY = 0;
    this.reset();
    this.hitbox = { x: 0, y: 0, w: BALL_SIZE, h: BALL_SIZE };

    game.addAsCollision(this,
      TEWOU.CollideLayers.npc,
      TEWOU.CollideLayers.npc,
      TEWOU.CollideTypes.none
    );

    game.registerEntity(this);
  }

  reset() {
    this.pos.x = CANVAS_WIDTH / 2 - BALL_SIZE / 2;
    this.pos.y = CANVAS_HEIGHT / 2 - BALL_SIZE / 2;

    const angle = (Math.random() - 0.5) * Math.PI / 3;
    const direction = Math.random() > 0.5 ? 1 : -1;

    this.velocityX = Math.cos(angle) * this.speed * direction;
    this.velocityY = Math.sin(angle) * this.speed;
  }

  update() {
    super.update();

    this.pos.x += this.velocityX;
    this.pos.y += this.velocityY;

    // Top and bottom wall collision
    if (this.pos.y <= 0 || this.pos.y >= CANVAS_HEIGHT - BALL_SIZE) {
      this.velocityY *= -1;
      if (this.pos.y <= 0) this.pos.y = 0;
      if (this.pos.y >= CANVAS_HEIGHT - BALL_SIZE) {
        this.pos.y = CANVAS_HEIGHT - BALL_SIZE;
      }
    }

    // Check paddle collisions
    const entities = game.alacritypool;
    for (let entity of entities) {
      if (entity instanceof Paddle) {
        if (this.checkCollision(entity)) {
          // Determine which side the ball hit
          const ballCenterX = this.pos.x + BALL_SIZE / 2;
          const paddleCenterX = entity.pos.x + PADDLE_WIDTH / 2;

          // Reverse horizontal direction
          this.velocityX *= -1;

          // Add spin based on where ball hit paddle
          const ballCenterY = this.pos.y + BALL_SIZE / 2;
          const paddleCenterY = entity.pos.y + PADDLE_HEIGHT / 2;
          const relativeIntersectY = (paddleCenterY - ballCenterY) / (PADDLE_HEIGHT / 2);
          const bounceAngle = relativeIntersectY * (Math.PI / 4);

          const direction = entity.isPlayer1 ? 1 : -1;
          this.velocityX = Math.cos(bounceAngle) * this.speed * direction;
          this.velocityY = -Math.sin(bounceAngle) * this.speed;

          // Increase speed slightly
          this.speed *= 1.05;
          if (this.speed > 15) this.speed = 15;

          // Move ball out of paddle
          if (entity.isPlayer1) {
            this.pos.x = entity.pos.x + PADDLE_WIDTH + 1;
          } else {
            this.pos.x = entity.pos.x - BALL_SIZE - 1;
          }
        }
      }
    }

    // Score points
    if (this.pos.x <= 0) {
      game.player2Score++;
      this.checkWin();
    } else if (this.pos.x >= CANVAS_WIDTH - BALL_SIZE) {
      game.player1Score++;
      this.checkWin();
    }
  }

  checkCollision(paddle) {
    return (
      this.pos.x < paddle.pos.x + PADDLE_WIDTH &&
      this.pos.x + BALL_SIZE > paddle.pos.x &&
      this.pos.y < paddle.pos.y + PADDLE_HEIGHT &&
      this.pos.y + BALL_SIZE > paddle.pos.y
    );
  }

  checkWin() {
    if (game.player1Score >= WINNING_SCORE || game.player2Score >= WINNING_SCORE) {
      winScreen.showWinner(game.player1Score >= WINNING_SCORE ? 1 : 2);
      this.destroy();
    } else {
      this.speed = INITIAL_BALL_SPEED;
      this.reset();
      // Update score displays
      game.updateScoreDisplay();
    }
  }
}

class CenterLine extends TEWOU.Fauna {
  constructor() {
    super(game.newRectangle(
      { x: 0, y: 0, w: 4, h: CANVAS_HEIGHT },
      { r: 100, g: 100, b: 100, a: 255 }
    ));

    this.pos.x = CANVAS_WIDTH / 2 - 2;
    this.pos.y = 0;
    game.registerEntity(this);
  }
}

class ScoreDisplay extends TEWOU.Fauna {
  constructor(isPlayer1) {
    let text = game.newText("0", {color:{r:255,g:255,b:255,a:255}, font:"syne mono"});
    super(text);
    this.text = text;
    this.isPlayer1 = isPlayer1;
    this.lastScore = 0;

    this.pos.x = isPlayer1 ? CANVAS_WIDTH / 4 - 20 : (CANVAS_WIDTH * 3) / 4 - 20;
    this.pos.y = 50;

    game.registerEntity(this);
  }

  update() {
    super.update();
    // Only update the score text when it changes
    const score = this.isPlayer1 ? game.player1Score : game.player2Score;
    if (score !== this.lastScore) {
      this.lastScore = score;
      this.text.setText(score.toString());
      // Re-center the text
      this.pos.x = (this.isPlayer1 ? CANVAS_WIDTH / 4 : (CANVAS_WIDTH * 3) / 4) - this.text.size.w / 2;
    }
  }
}

class WinScreen extends TEWOU.Fauna {
  constructor() {
    let winnerText = game.newText("Player Wins!", {color:{r:255,g:255,b:255,a:255}, font:"syne mono"});
    let restartText = game.newText("Press R to play again", {color:{r:200,g:200,b:200,a:255}, font:"syne mono"});

    super([game.newSnap([
      game.newRectangle({ x: 0, y: 0, w: CANVAS_WIDTH, h: CANVAS_HEIGHT }, { r: 0, g: 0, b: 0, a: 200 }),
      restartText
    ]),
    winnerText,
    ]);

    this.winnerText = winnerText;
    this.restartText = restartText;
    this.myFrame.rprops.hidden = true;

    // Position text elements using dstrect
    winnerText.rprops.dstrect.x = CANVAS_WIDTH / 2 - winnerText.size.w / 2;
    winnerText.rprops.dstrect.y = CANVAS_HEIGHT / 2 - 30;
    restartText.rprops.dstrect.x = CANVAS_WIDTH / 2 - restartText.size.w / 2;
    restartText.rprops.dstrect.y = CANVAS_HEIGHT / 2 + 10;

    game.registerEntity(this);
  }

  showWinner(player) {
    this.winnerText.setText(`Player ${player} wins!`);
    this.winnerText.rprops.dstrect.x = CANVAS_WIDTH / 2 - this.winnerText.size.w / 2;
    // this.myFrame.dynamic = true;
    this.myFrame.rprops.hidden = false;
  }

  hide() {
    this.myFrame.rprops.hidden = true;
  }
}

// Player controller
class Player extends TEWOU.Player {
  constructor(paddle1, paddle2) {
    super(game.newRectangle(
      { x: 0, y: 0, w: 1, h: 1 },
      { r: 0, g: 0, b: 0, a: 0 }
    ));

    this.paddle1 = paddle1;
    this.paddle2 = paddle2;

    // Player 1 controls (W/S)
    this.registerkey('w', {
      keydown: () => { this.paddle1.moveUp = true; },
      keyup: () => { this.paddle1.moveUp = false; }
    });
    this.registerkey('s', {
      keydown: () => { this.paddle1.moveDown = true; },
      keyup: () => { this.paddle1.moveDown = false; }
    });

    // Player 2 controls (Arrow Up/Down)
    this.registerkey('ArrowUp', {
      keydown: () => { this.paddle2.moveUp = true; },
      keyup: () => { this.paddle2.moveUp = false; }
    });
    this.registerkey('ArrowDown', {
      keydown: () => { this.paddle2.moveDown = true; },
      keyup: () => { this.paddle2.moveDown = false; }
    });

    // Reset game with R key
    this.registerkey('r', {
      keydown: () => { this.resetGame(); }
    });

    game.registerEntity(this);
  }

  resetGame() {
    game.reset();
    winScreen.hide();

    // Check if a ball exists
    const entities = game.alacritypool;
    let ballExists = false;
    for (let entity of entities) {
      if (entity instanceof Ball) {
        entity.speed = INITIAL_BALL_SPEED;
        entity.reset();
        ballExists = true;
        break;
      }
    }

    // If no ball exists (it was destroyed when someone won), create a new one
    if (!ballExists) {
      new Ball();
    }
  }
}

var winScreen;

// Initialize game
game = new PongGame(document.getElementById('canvas'));
TEWOU.Engine.start(game).then(() => {
  // Create game entities
  const paddle1 = new Paddle(true);
  const paddle2 = new Paddle(false);
  const ball = new Ball();
  const centerLine = new CenterLine();
  const score1 = new ScoreDisplay(true);
  const score2 = new ScoreDisplay(false);
  winScreen = new WinScreen();

  // Create player controller
  const player = new Player(paddle1, paddle2);

  TEWOU.Engine.games.push(game);
  TEWOU.Engine.mainLoop();

  console.log("Pong Game Started!");
  console.log("Player 1: W/S keys");
  console.log("Player 2: Arrow Up/Down keys");
  console.log("Press R to reset");
  console.log(`First to ${WINNING_SCORE} wins!`);
});
