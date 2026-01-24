var game;


class Bullet extends window.TEWOU.Fauna {
  constructor(posx,posy){
    super(
      game.newRectangle(
        {x:0,y:0,w:4,h:20},
        {r:128,g:128,b:255,a:255}
      )
    )
    this.pos.x = posx;
    this.pos.y = posy;
    game.registerEntity(this);
  }

  update(){
    super.update();
    this.movementvector.y = -1;
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
        // console.log("HALLO)")
      }
    })
  }
}

class Game extends window.TEWOU.ActionGame {
  constructor(canvas){
    super(canvas,200,600);
  }
}

game = new Game(document.getElementById('canvas'))
let player = new Player();
game.registerEntity(player);

// Start the game
window.TEWOU.Engine.start(game).then(()=>{
  window.TEWOU.Engine.games.push(game);
  window.TEWOU.Engine.mainLoop()})