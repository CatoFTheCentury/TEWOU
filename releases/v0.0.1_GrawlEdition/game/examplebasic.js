class Global {
  static game;
}

class Player extends window.TEWOU.Player {
  constructor(){
    super(Global.game.buildAni({
      frames:[
        [{file:"_assets/g2k1_tiles.png",srcrect:{x:0,y:0,w:1,h:1},dstrect:{x:0,y:0,w:20,h:10}}],
        [{file:"_assets/g2k1_tiles.png",srcrect:{x:10,y:10,w:1,h:1},dstrect:{x:0,y:0,w:20,h:10}}]
    ]}))

    this.registerkey('w', {
      keypressed : ()=>{
        this.movementvector.y = -1;
      }
    })
    this.registerkey('a', {
      keypressed : ()=>{
        this.movementvector.x = -1;
      }
    })
    this.registerkey('s', {
      keypressed : ()=>{
        this.movementvector.y = 1;
      }
    })
    this.registerkey('d', {
      keypressed : ()=>{
        this.movementvector.x = 1;
      }
    })
  }
}

class Game extends window.TEWOU.ActionGame {
  constructor(canvas){
    super(canvas,200,600);
  }
}

Global.game = new Game(document.getElementById('canvas'))
let player = new Player();
Global.game.alacritypool.push(player);

Global.game.frameGame([
  Global.game.buildAni({
    frames:[
      [{file:"_assets/g2k1_tiles.png",srcrect:{x:24,y:4,w:1,h:1},dstrect:{x:0,y:0,w:200,h:600}}],
    ]}),
    player.myFrame,
    
  ]);

// Start the game
window.TEWOU.Engine.start(Global.game).then(()=>{
  window.TEWOU.Engine.games.push(Global.game);
  window.TEWOU.Engine.mainLoop()})