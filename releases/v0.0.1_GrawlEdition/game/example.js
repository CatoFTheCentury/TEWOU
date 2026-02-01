var game;
var score;

class Mothership extends window.TEWOU.Fauna {
  constructor(){
    super(
      game.newRectangle(
        {x:0,y:0,w:1,h:1},
        {r:0,g:0,b:0,a:0}
      )
    )
    this.addTimeout([500,300,600],{
      triggered : (timeout)=> {
        game.registerEntity(new Enemy(Math.random()*180))
      }
    })
  }
}

class Score extends window.TEWOU.Fauna {
  text;
  score = 0;

  constructor(){
    let text = game.newText("0",{font:"syne mono"});
    super(text)
    this.text = text;

    this.pos.x = 150 - this.text.size.w / 2;
    this.pos.y = 0;

    game.registerEntity(this)
  }

  increment(i = 1){
    this.score += i;
    this.text.setText(this.score+"")
    this.pos.x = 150 - this.text.size.w / 2;
  }
}

class Enemy extends window.TEWOU.Fauna {
  constructor(posx){
    super(
      game.newRectangle(
        {x:0,y:0,w:20,h:10},
        {r:255,g:255,b:255,a:255}
      )
    )
    this.pos.x = posx;
    this.pos.y = -20;

    this.hitbox = {
      x:0,y:0,w:20,h:10
    }

    game.addAsCollision(this,
      window.TEWOU.CollideLayers.npc,
      window.TEWOU.CollideLayers.npc,
      window.TEWOU.CollideTypes.none
    )
  }

  update(){
    super.update();
    this.movementvector.y = 1;
    if(this.pos.y > 600) this.destroy();
  }

  react(owner,name,params){
    if(name == "hurt"){
      score.increment();
      owner.destroy();
      this.destroy();
      return true;
    }
  }
}


class Bullet extends window.TEWOU.Fauna {
  constructor(posx,posy){
    let laser  = game.newSnap([game.newRectangle({x:0,y:0,w:4,h:20},{r:100,g:100,b:255,a:255})])
    let shine  = game.newRectangle({x:1,y:-10,w:2,h: 20},{r:128,g:128,b:255,a:255});
    let shiner = game.newSnap([shine]);
    let shiner2 = game.newSnap([shine]);

    shiner.rprops.rotcenter = {x:1,y:10};
      shiner.rprops.angle = -.7;
      shiner.rprops.scale = {x:1,y:1};

      shiner2.rprops.rotcenter = {x:1,y:10};
      shiner2.rprops.angle = .7;
      shiner2.rprops.scale = {x:1,y:1};

    super(
      game.newFrame([
        laser,shiner,shiner2])
    )
    this.pos.x = posx;
    this.pos.y = posy;
    game.addCapture({
      cwith : window.TEWOU.CollideLayers.npc,
      type  : window.TEWOU.CollideTypes.none,
      hitbox: {
        x: 0, y: 0, w: 4, h: 10
      },
      owner : this,
      call  : (owner,target)=>{
        target.react(owner,"hurt",[])
      }
    })
    game.registerEntity(this);
  }

  update(){
    super.update();
    this.movementvector.y = -1;
    if(this.pos.y < -20) this.destroy();
  }
}

class Player extends window.TEWOU.Player {
  bullets;

  constructor(){
    super(
      game.newRectangle(
        {x:0,y:0,w:20,h:10},
        {r:128,g:200,b:128,a:255}
      )
    )

    this.pos.x = 90;
    this.pos.y = 580;

    this.registerkey('a', {
      keypressed : ()=>{
        this.movementvector.x = -1;
      }
    })
    this.registerkey('d', {
      keypressed : ()=>{
        this.movementvector.x = 1;
      }
    })

    this.registerkey(' ', {
      keydown : ()=>{
        new Bullet(this.pos.x+8,this.pos.y-20)
      }
    })
  }
}

class Game extends window.TEWOU.ActionGame {
  constructor(canvas){
    super(canvas,200,600);
    canvas.style.border   = "3px solid white";
    canvas.style.position = "absolute";
    canvas.style.left     = "10px";
    canvas.style.top      = "10px";
  }
}


// Start the game
game = new Game(document.getElementById('canvas'))
score = new Score();
window.TEWOU.Engine.start(game).then(()=>{
  let player = new Player();
  game.registerEntity(player);
  game.registerEntity(new Mothership())
  window.TEWOU.Engine.games.push(game);
  window.TEWOU.Engine.mainLoop()}) 