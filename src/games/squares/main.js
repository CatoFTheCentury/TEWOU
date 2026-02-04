var game; var deadScreen;
const squaresize = 20;
const boardsize  = 20;
const refreshrate = 300;

class Game extends window.TEWOU.ActionGame {
  fileextensions = [];
  
  constructor(canvas){
    super(canvas,squaresize * boardsize, squaresize * boardsize);
    canvas.style.border   = "3px solid white";
    canvas.style.position = "absolute";
    canvas.style.left     = "10px";
    canvas.style.top      = "10px";
  }
}

class Apple extends window.TEWOU.Fauna {
  static rectangle = undefined;

  constructor(){
    let newpos = {x:Math.floor(Math.random()*boardsize),y:Math.floor(Math.random()*boardsize)};
    let freespot = false;
    while(!freespot){
      freespot = true;
      for(let p of Snake.parts){
        if(newpos.x == p.gridx && newpos.y == p.gridy){
          newpos = {x:Math.floor(Math.random()*boardsize),y:Math.floor(Math.random()*boardsize)};
          freespot = false;
        }
      }
    }

    super(
      Apple.rectangle === undefined ? 
      game.newRectangle({x:0,y:0,w:squaresize,h:squaresize},{r:255,g:0,b:0,a:255}) :
      Apple.rectangle)
    if(Apple.rectangle === undefined){
      Apple.rectangle = game.newRectangle({x:0,y:0,w:squaresize,h:squaresize},{r:255,g:0,b:0,a:255});
    }

    this.pos.x = newpos.x*squaresize;
    this.pos.y = newpos.y*squaresize;

    this.hitbox = {x:0,y:0,w:squaresize,h:squaresize};

    game.addAsCollision(this,
      window.TEWOU.CollideLayers.npc,
      window.TEWOU.CollideLayers.npc,
      window.TEWOU.CollideTypes.none
    )

    game.registerEntity(this);
  }

  react(owner,str,arr){
    owner.ate();
    new Apple();
    this.destroy();
    return true;
  }
}

class Snake extends window.TEWOU.Player {
  static length = 3;
  static startpos = Math.floor(boardsize / 2);
  static rectangle;
  static headpos; 
  static parts = [];
  nextdir = 3;
  lastdir = 1;

  constructor(){
    super(game.newRectangle({x:0,y:0,w:1,h:1},{r:0,g:0,b:0,a:0}))
    Snake.rectangle = game.newRectangle(
      {x:0,y:0,w:squaresize,h:squaresize},
      {r:200,g:200,b:200,a:255}
    )
    this.headpos = {x:Snake.startpos,y:Snake.startpos};

    Snake.parts = [];
    for(let i = 0; i < 3; i++){
      Snake.parts.push(new SnakePart(Snake.startpos-i,Snake.startpos))
    }

    this.addTimeout([refreshrate],{
      triggered : (timeout)=> {
        this.advance();
      }
    })

    this.registerKey('w', {
      keydown : ()=>{
        if(this.lastdir!=2) this.nextdir = 0;
      }
    })
    this.registerKey('a', {
      keydown : ()=>{
        if(this.lastdir!=3) this.nextdir = 1;
      }
    })
    this.registerKey('s', {
      keydown : ()=>{
        if(this.lastdir!=0) this.nextdir = 2;
      }
    })
    this.registerKey('d', {
      keydown : ()=>{
        if(this.lastdir!=1) this.nextdir = 3;
      }
    })
  }

  advance(){
    if(this.nextdir == 0){
      this.headpos.y -= 1;
      this.lastdir = 0;
    }
    if(this.nextdir == 1){
      this.headpos.x -= 1;
      this.lastdir = 1;
    }
    if(this.nextdir == 2){
      this.headpos.y += 1;
      this.lastdir = 2;
    }
    if(this.nextdir == 3){
      this.headpos.x += 1;
      this.lastdir = 3;
    }
    if(this.headpos.x >= boardsize || this.headpos.y >= boardsize || this.headpos.x < 0 || this.headpos.y < 0){
      deadScreen.dies();
      this.destroy();
    }
    Snake.parts.push(new SnakePart(this.headpos.x,this.headpos.y));
    if(Snake.parts.length > Snake.length){
      Snake.parts.shift().destroy();
    }
  }
}

class SnakePart extends window.TEWOU.Fauna {
  gridx; gridy;

  constructor(gridx,gridy){
    super(Snake.rectangle)

    this.myFrame.rprops.layer = 0;

    this.gridx = gridx;
    this.gridy = gridy;

    this.pos.x = gridx*squaresize;
    this.pos.y = gridy*squaresize;

    this.hitbox = {x:0,y:0,w:squaresize,h:squaresize};

    game.addAsCollision(this,
      window.TEWOU.CollideLayers.npc,
      window.TEWOU.CollideLayers.npc,
      window.TEWOU.CollideTypes.none

    )

    game.addCapture({
      collideswith : window.TEWOU.CollideLayers.npc,
      type  : window.TEWOU.CollideTypes.none,
      hitbox: {x:0,y:0,w:squaresize,h:squaresize},
      owner : this,
      oncollision  : (owner,target)=>{
        target.react(owner,"",[]);
      }
    })

    game.registerEntity(this);
  }

  ate(){
    Snake.length += 1;

  }

  react(owner,str,arr){
    if(this!==owner) {
      deadScreen.dies();
    }
  }
  
}

class DeadScreen extends window.TEWOU.Fauna {
  constructor(){
    super(game.newRectangle({x:0,y:0,w:boardsize*squaresize,h:boardsize*squaresize},{r:255,g:40,b:40,a:255}))
    this.myFrame.rprops.hidden = true;
    game.registerEntity(this);
  }

  dies(){
    this.myFrame.rprops.hidden = false;
  }
}

// Start the game
game = new Game(document.getElementById('canvas'))
window.TEWOU.Engine.start(game).then(()=>{
  let player = new Snake();
  game.registerEntity(player);
  deadScreen = new DeadScreen();
  new Apple();
  window.TEWOU.Engine.games.push(game);
  window.TEWOU.Engine.mainLoop()
})


