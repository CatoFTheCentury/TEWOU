import { Composite, T, GameObjects, Games, ShaderLoader, Render } from "TEWOU"

export enum FullChar {
  grayguy     = 0,
  graygirl    = 1,
  greenimp    = 2,
  reddemon    = 3,
  greenzombie = 4,
  skull       = 5,
  ghost       = 6,
  redguy      = 7,
  redgirl     = 8,
  blueimp     = 9,
  graydemon   = 10,
  redzombie   = 11,
  redskull    = 12,
  redghost    = 13,
  blueguy     = 14,
  bluegirl    = 15,
  dwarf       = 16,
  bluedemon   = 17,
  bluezombie  = 18,
  yellowskull = 19,
  blueghost   = 20,
  length      = 21
}

export default class GameAnimations {
  public animations :
    {[id:string]:{[id:string]:{[id:string]:Array<Composite.Animation>}}} = {};

  constructor(game:Games.Action){
    let fireballs = new Fireball(game.glContext,game.shadercontext);
    let bats      = new Bat(game.glContext,game.shadercontext);
    let scorpions = new Scorpion(game.glContext,game.shadercontext);
    let chars     = new CharacterAnimations(game.glContext,game.shadercontext);
    this.animations = {
      // animations : {
      fireballs : {
        yellow: {
          idle:[fireballs.full[Fireball.fireballs.yellow][0]],
          walk:[fireballs.full[Fireball.fireballs.yellow][1]],
          dead:[fireballs.full[Fireball.fireballs.yellow][2]],
          },
        red: {
          idle:[fireballs.full[Fireball.fireballs.red][0]],
          walk:[fireballs.full[Fireball.fireballs.red][1]],
          dead:[fireballs.full[Fireball.fireballs.red][2]],
          },
        white: {
          idle:[fireballs.full[Fireball.fireballs.white][0]],
          walk:[fireballs.full[Fireball.fireballs.white][1]],
          dead:[fireballs.full[Fireball.fireballs.white][2]],
          },
        },
      bats : {
        gray: {
          idle  :[bats.full[Bat.bats.gray][0]],
          walk  :[bats.full[Bat.bats.gray][1]],
          attack:[bats.full[Bat.bats.gray][2]],
          dead  :[bats.full[Bat.bats.gray][3]],
          },
        red: {
          idle  :[bats.full[Bat.bats.red][0]],
          walk  :[bats.full[Bat.bats.red][1]],
          attack:[bats.full[Bat.bats.red][2]],
          dead  :[bats.full[Bat.bats.red][3]],
          },
        white: {
          idle  :[bats.full[Bat.bats.white][0]],
          walk  :[bats.full[Bat.bats.white][1]],
          attack:[bats.full[Bat.bats.white][2]],
          dead  :[bats.full[Bat.bats.white][3]],
          },
        },
      scorpions : {
        red: {
          idle  :[scorpions.full[Scorpion.scorpions.red][0]],
          walk  :[scorpions.full[Scorpion.scorpions.red][1]],
          attack:[scorpions.full[Scorpion.scorpions.red][2]],
          jump  :[scorpions.full[Scorpion.scorpions.red][3]],
          dead  :[scorpions.full[Scorpion.scorpions.red][4]],
          },
        black: {
          idle  :[scorpions.full[Scorpion.scorpions.black][0]],
          walk  :[scorpions.full[Scorpion.scorpions.black][1]],
          attack:[scorpions.full[Scorpion.scorpions.black][2]],
          jump  :[scorpions.full[Scorpion.scorpions.black][3]],
          dead  :[scorpions.full[Scorpion.scorpions.black][4]],
          },
        green: {
          idle  :[scorpions.full[Scorpion.scorpions.green][0]],
          walk  :[scorpions.full[Scorpion.scorpions.green][1]],
          attack:[scorpions.full[Scorpion.scorpions.green][2]],
          jump  :[scorpions.full[Scorpion.scorpions.green][3]],
          dead  :[scorpions.full[Scorpion.scorpions.green][4]],
          },
        },
      characters : {
        grayguy     : {
          idle  :[chars.full[CharacterAnimations.characters.grayguy][0]],
          walk  :[chars.full[CharacterAnimations.characters.grayguy][1]],
          climb :[chars.full[CharacterAnimations.characters.grayguy][2]],
          attack:[chars.full[CharacterAnimations.characters.grayguy][3]],
          jump  :[chars.full[CharacterAnimations.characters.grayguy][4]],
          dead  :[chars.full[CharacterAnimations.characters.grayguy][5]],
        },
        graygirl    : {
          idle  :[chars.full[CharacterAnimations.characters.graygirl][0]],
          walk  :[chars.full[CharacterAnimations.characters.graygirl][1]],
          climb :[chars.full[CharacterAnimations.characters.graygirl][2]],
          attack:[chars.full[CharacterAnimations.characters.graygirl][3]],
          jump  :[chars.full[CharacterAnimations.characters.graygirl][4]],
          dead  :[chars.full[CharacterAnimations.characters.graygirl][5]],
        },
        greenimp    : {
          idle  :[chars.full[CharacterAnimations.characters.greenimp][0]],
          walk  :[chars.full[CharacterAnimations.characters.greenimp][1]],
          climb :[chars.full[CharacterAnimations.characters.greenimp][2]],
          attack:[chars.full[CharacterAnimations.characters.greenimp][3]],
          jump  :[chars.full[CharacterAnimations.characters.greenimp][4]],
          dead  :[chars.full[CharacterAnimations.characters.greenimp][5]],
        },
        reddemon    : {
          idle  :[chars.full[CharacterAnimations.characters.reddemon][0]],
          walk  :[chars.full[CharacterAnimations.characters.reddemon][1]],
          climb :[chars.full[CharacterAnimations.characters.reddemon][2]],
          attack:[chars.full[CharacterAnimations.characters.reddemon][3]],
          jump  :[chars.full[CharacterAnimations.characters.reddemon][4]],
          dead  :[chars.full[CharacterAnimations.characters.reddemon][5]],
        },
        greenzombie : {
          idle  :[chars.full[CharacterAnimations.characters.greenzombie][0]],
          walk  :[chars.full[CharacterAnimations.characters.greenzombie][1]],
          climb :[chars.full[CharacterAnimations.characters.greenzombie][2]],
          attack:[chars.full[CharacterAnimations.characters.greenzombie][3]],
          jump  :[chars.full[CharacterAnimations.characters.greenzombie][4]],
          dead  :[chars.full[CharacterAnimations.characters.greenzombie][5]],
        },
        skull       : {
          idle  :[chars.full[CharacterAnimations.characters.skull][0]],
          walk  :[chars.full[CharacterAnimations.characters.skull][1]],
          climb :[chars.full[CharacterAnimations.characters.skull][2]],
          attack:[chars.full[CharacterAnimations.characters.skull][3]],
          jump  :[chars.full[CharacterAnimations.characters.skull][4]],
          dead  :[chars.full[CharacterAnimations.characters.skull][5]],
        },
        ghost       : {
          idle  :[chars.full[CharacterAnimations.characters.ghost][0]],
          walk  :[chars.full[CharacterAnimations.characters.ghost][1]],
          climb :[chars.full[CharacterAnimations.characters.ghost][2]],
          attack:[chars.full[CharacterAnimations.characters.ghost][3]],
          jump  :[chars.full[CharacterAnimations.characters.ghost][4]],
          dead  :[chars.full[CharacterAnimations.characters.ghost][5]],
        },
        redguy      : {
          idle  :[chars.full[CharacterAnimations.characters.redguy][0]],
          walk  :[chars.full[CharacterAnimations.characters.redguy][1]],
          climb :[chars.full[CharacterAnimations.characters.redguy][2]],
          attack:[chars.full[CharacterAnimations.characters.redguy][3]],
          jump  :[chars.full[CharacterAnimations.characters.redguy][4]],
          dead  :[chars.full[CharacterAnimations.characters.redguy][5]],
        },
        redgirl     : {
          idle  :[chars.full[CharacterAnimations.characters.redgirl][0]],
          walk  :[chars.full[CharacterAnimations.characters.redgirl][1]],
          climb :[chars.full[CharacterAnimations.characters.redgirl][2]],
          attack:[chars.full[CharacterAnimations.characters.redgirl][3]],
          jump  :[chars.full[CharacterAnimations.characters.redgirl][4]],
          dead  :[chars.full[CharacterAnimations.characters.redgirl][5]],
        },
        blueimp     : {
          idle  :[chars.full[CharacterAnimations.characters.blueimp][0]],
          walk  :[chars.full[CharacterAnimations.characters.blueimp][1]],
          climb :[chars.full[CharacterAnimations.characters.blueimp][2]],
          attack:[chars.full[CharacterAnimations.characters.blueimp][3]],
          jump  :[chars.full[CharacterAnimations.characters.blueimp][4]],
          dead  :[chars.full[CharacterAnimations.characters.blueimp][5]],
        },
        graydemon   : {
          idle  :[chars.full[CharacterAnimations.characters.graydemon][0]],
          walk  :[chars.full[CharacterAnimations.characters.graydemon][1]],
          climb :[chars.full[CharacterAnimations.characters.graydemon][2]],
          attack:[chars.full[CharacterAnimations.characters.graydemon][3]],
          jump  :[chars.full[CharacterAnimations.characters.graydemon][4]],
          dead  :[chars.full[CharacterAnimations.characters.graydemon][5]],
        },
        redzombie   : {
          idle  :[chars.full[CharacterAnimations.characters.redzombie][0]],
          walk  :[chars.full[CharacterAnimations.characters.redzombie][1]],
          climb :[chars.full[CharacterAnimations.characters.redzombie][2]],
          attack:[chars.full[CharacterAnimations.characters.redzombie][3]],
          jump  :[chars.full[CharacterAnimations.characters.redzombie][4]],
          dead  :[chars.full[CharacterAnimations.characters.redzombie][5]],
        },
        redskull    : {
          idle  :[chars.full[CharacterAnimations.characters.redskull][0]],
          walk  :[chars.full[CharacterAnimations.characters.redskull][1]],
          climb :[chars.full[CharacterAnimations.characters.redskull][2]],
          attack:[chars.full[CharacterAnimations.characters.redskull][3]],
          jump  :[chars.full[CharacterAnimations.characters.redskull][4]],
          dead  :[chars.full[CharacterAnimations.characters.redskull][5]],
        },
        redghost    : {
          idle  :[chars.full[CharacterAnimations.characters.redghost][0]],
          walk  :[chars.full[CharacterAnimations.characters.redghost][1]],
          climb :[chars.full[CharacterAnimations.characters.redghost][2]],
          attack:[chars.full[CharacterAnimations.characters.redghost][3]],
          jump  :[chars.full[CharacterAnimations.characters.redghost][4]],
          dead  :[chars.full[CharacterAnimations.characters.redghost][5]],
        },
        blueguy     : {
          idle  :[chars.full[CharacterAnimations.characters.blueguy][0]],
          walk  :[chars.full[CharacterAnimations.characters.blueguy][1]],
          climb :[chars.full[CharacterAnimations.characters.blueguy][2]],
          attack:[chars.full[CharacterAnimations.characters.blueguy][3]],
          jump  :[chars.full[CharacterAnimations.characters.blueguy][4]],
          dead  :[chars.full[CharacterAnimations.characters.blueguy][5]],
        },
        bluegirl    : {
          idle  :[chars.full[CharacterAnimations.characters.bluegirl][0]],
          walk  :[chars.full[CharacterAnimations.characters.bluegirl][1]],
          climb :[chars.full[CharacterAnimations.characters.bluegirl][2]],
          attack:[chars.full[CharacterAnimations.characters.bluegirl][3]],
          jump  :[chars.full[CharacterAnimations.characters.bluegirl][4]],
          dead  :[chars.full[CharacterAnimations.characters.bluegirl][5]],
        },
        dwarf       : {
          idle  :[chars.full[CharacterAnimations.characters.dwarf][0]],
          walk  :[chars.full[CharacterAnimations.characters.dwarf][1]],
          climb :[chars.full[CharacterAnimations.characters.dwarf][2]],
          attack:[chars.full[CharacterAnimations.characters.dwarf][3]],
          jump  :[chars.full[CharacterAnimations.characters.dwarf][4]],
          dead  :[chars.full[CharacterAnimations.characters.dwarf][5]],
        },
        bluedemon   : {
          idle  :[chars.full[CharacterAnimations.characters.bluedemon][0]],
          walk  :[chars.full[CharacterAnimations.characters.bluedemon][1]],
          climb :[chars.full[CharacterAnimations.characters.bluedemon][2]],
          attack:[chars.full[CharacterAnimations.characters.bluedemon][3]],
          jump  :[chars.full[CharacterAnimations.characters.bluedemon][4]],
          dead  :[chars.full[CharacterAnimations.characters.bluedemon][5]],
        },
        bluezombie  : {
          idle  :[chars.full[CharacterAnimations.characters.bluezombie][0]],
          walk  :[chars.full[CharacterAnimations.characters.bluezombie][1]],
          climb :[chars.full[CharacterAnimations.characters.bluezombie][2]],
          attack:[chars.full[CharacterAnimations.characters.bluezombie][3]],
          jump  :[chars.full[CharacterAnimations.characters.bluezombie][4]],
          dead  :[chars.full[CharacterAnimations.characters.bluezombie][5]],
        },
        yellowskull : {
          idle  :[chars.full[CharacterAnimations.characters.yellowskull][0]],
          walk  :[chars.full[CharacterAnimations.characters.yellowskull][1]],
          climb :[chars.full[CharacterAnimations.characters.yellowskull][2]],
          attack:[chars.full[CharacterAnimations.characters.yellowskull][3]],
          jump  :[chars.full[CharacterAnimations.characters.yellowskull][4]],
          dead  :[chars.full[CharacterAnimations.characters.yellowskull][5]],
        },
        blueghost   : {
          idle  :[chars.full[CharacterAnimations.characters.blueghost][0]],
          walk  :[chars.full[CharacterAnimations.characters.blueghost][1]],
          climb :[chars.full[CharacterAnimations.characters.blueghost][2]],
          attack:[chars.full[CharacterAnimations.characters.blueghost][3]],
          jump  :[chars.full[CharacterAnimations.characters.blueghost][4]],
          dead  :[chars.full[CharacterAnimations.characters.blueghost][5]],
        },
      }
    }
  }
}

// export namespace GameAnimations {

  // enum AniSt {
  //   idle   = 0,
  //   walk   = 1,
  //   climb  = 2,
  //   attack = 3,
  //   jump   = 4,
  //   dead   = 5,
  //   length = 6
  // }


  export class Fireball {
    public static fireballs = {
      yellow:0,
      red   :1,
      white :2,
      count :3
    }

    public full : Array<Array<Composite.Animation>> = [];

    constructor(glContext:Render.GLContext,shadercontext:ShaderLoader){
      // if(Fireball.fullfireballs.length <= 0){
        for(let i = 0; i < Fireball.fireballs.count; i++){
          let pos = {x:(26+6*i)*16,y:13*16};
          this.full.push([
            // idle
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])],[Infinity]),
          // walk
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+1 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])],[100,100]),
          // dead
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+3 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
            ])],[Infinity]),
        ])
        }
      }
    }

  // }

  export class Bat {
    public static bats = {
      gray :0,
      red  :1,
      white:2,
      count:3
    }
    public full : Array<Array<Composite.Animation>> = [];
    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader){
      // if(Bat.fullbats.length <= 0){
        for(let i = 0; i < Bat.bats.count; i++){
          // console.log("BatAnimations constructor");
          let pos = {x:(26+6*i)*16,y:8*16};
          this.full.push([
            // idle
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])],[Infinity]),
          // walk
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
            ]),
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+1 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])],[200,200]),
          // climb
          // new Composite.Animation(glContext, shadercontext, []),
            // attack
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])],[Infinity]),
          // jump
          // new Composite.Animation(glContext, shadercontext, []),
          // dead
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+5 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
            ])],[Infinity]),
          ])
        }
      }
    }
  // }
  
  export class Scorpion {
    public static scorpions = {
      red:0,
      black:1,
      green:2,
      count:3
    }
    public full : Array<Array<Composite.Animation>> = [];

    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader){
      // if(Scorpion.full.length <= 0){
        for(let i = 0; i < Scorpion.scorpions.count; i++){
          let pos = {x:(26+6*i)*16,y:10*16};
          this.full.push([
            // idle
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])],[Infinity]),
          // walk
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+1 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16}),
            ]),
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+2 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])],[100,100]),
          // climb
          // new Composite.Animation(glContext, shadercontext, [
          //   new Composite.Snap(glContext, shadercontext, [
          //     new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+3 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          // ])]),
          // attack
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+2 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
            ]),
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+4 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])],[1000, 500]),
          // jump
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+1 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])],[Infinity]),
            // dead
          new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+5 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])],[Infinity]),
        ])
        }
      }
    }
  // }
  
  export class CharacterAnimations {
    public static characters = {
      grayguy     : 0,
      graygirl    : 1,
      greenimp    : 2,
      reddemon    : 3,
      greenzombie : 4,
      skull       : 5,
      ghost       : 6,
      redguy      : 7,
      redgirl     : 8,
      blueimp     : 9,
      graydemon   : 10,
      redzombie   : 11,
      redskull    : 12,
      redghost    : 13,
      blueguy     : 14,
      bluegirl    : 15,
      dwarf       : 16,
      bluedemon   : 17,
      bluezombie  : 18,
      yellowskull : 19,
      blueghost   : 20,
      length      : 21
    }

    public full: Array<Array<Composite.Animation>> = [];

  //   public static buildCharacter(char: FullChar): Array<Composite.Animation>{
  //     let fcsize: T.Box = {w:3,h:7};
  //     let charpos: T.Point = {x:(26 + 6 * Math.floor(char / fcsize.h)) * 16, y:(1 + char % fcsize.h) * 16}

  //     let climbflipped =         new Composite.Snap(glContext, shadercontext, [
  //         new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+3 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
  //       ])
  //     climbflipped.rprops.flip.flipx = true;

  //     return [
  //       // idle
  //       new Composite.Animation(glContext, shadercontext, [
  //         new Composite.Snap(glContext, shadercontext, [
  //           new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
  //         ])],
  //         [Infinity]),
  //         // walk
  //       new Composite.Animation(glContext, shadercontext, [
  //         new Composite.Snap(glContext, shadercontext, [
  //           new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+1 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16}),
  //         ]),
  //         new Composite.Snap(glContext, shadercontext, [
  //           new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+2 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
  //         ])],
  //         [200,200]),
  //       // climb
  //       new Composite.Animation(glContext, shadercontext, [
  //         new Composite.Snap(glContext, shadercontext, [
  //           new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+3 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
  //         ]),
  //         climbflipped],
  //         [200,200]),
  //         // attack
  //       new Composite.Animation(glContext, shadercontext, [
  //         new Composite.Snap(glContext, shadercontext, [
  //           new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+2 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
  //         ]),
  //         new Composite.Snap(glContext, shadercontext, [
  //           new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+4 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
  //         ])],
  //         [200,200]),
  //       // jump
  //       new Composite.Animation(glContext, shadercontext, [
  //         new Composite.Snap(glContext, shadercontext, [
  //           new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+1 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
  //         ])],
  //         [Infinity]),
  //         // dead
  //       new Composite.Animation(glContext, shadercontext, [
  //         new Composite.Snap(glContext, shadercontext, [
  //           new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+5 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
  //         ])],
  //         [Infinity]),
  //       ]
  // }

    constructor(glContext: Render.GLContext, shadercontext: ShaderLoader){
      // if(CharacterAnimations.fullCharacters.length == 0){

        let fcsize: T.Box = {w:3,h:7};
        
        for(let i = 0; i < fcsize.w; i++){
          for(let j = 0; j < fcsize.h; j++){
            let charpos: T.Point = {x:(26 + 6 * i) * 16, y:(1 + j) * 16}
            this.full.push(
              [
                // idle
                new Composite.Animation(glContext, shadercontext, [
            new Composite.Snap(glContext, shadercontext, [
              new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
            ])]),
            // walk
            new Composite.Animation(glContext, shadercontext, [
              new Composite.Snap(glContext, shadercontext, [
                new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+1*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16}),
              ]),
              new Composite.Snap(glContext, shadercontext, [
                new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+2*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
              ])]),
            // climb
            new Composite.Animation(glContext, shadercontext, [
              new Composite.Snap(glContext, shadercontext, [
                new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+3*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
              ])]),
              // attack
              new Composite.Animation(glContext, shadercontext, [
                new Composite.Snap(glContext, shadercontext, [
                  new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+2*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
                ]),
              new Composite.Snap(glContext, shadercontext, [
                new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+4*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
              ])]),
              // jump
              new Composite.Animation(glContext, shadercontext, [
                new Composite.Snap(glContext, shadercontext, [
                  new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+1*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
                ])]),
                // dead
                new Composite.Animation(glContext, shadercontext, [
              new Composite.Snap(glContext, shadercontext, [
                new Composite.Image(glContext, shadercontext, "_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+5*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
              ])]),
            ])
          }
        }
      }
    }
//   }
// }