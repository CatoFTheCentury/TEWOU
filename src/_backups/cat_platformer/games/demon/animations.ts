import { Composite } from "../../engine/render/composite"
import * as T from "../../engine/_type"

export namespace GameAnimations {

  enum AniSt {
    idle   = 0,
    walk   = 1,
    climb  = 2,
    attack = 3,
    jump   = 4,
    dead   = 5,
    length = 6
  }

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

  
  export class ScorpionAnimations {
    public static scorpions = {
      red:0,
      black:1,
      green:2,
      count:3
    }
    public static fullscorpions : Array<Array<Composite.Animation>> = [];

    constructor(){
      if(ScorpionAnimations.fullscorpions.length <= 0){
        for(let i = 0; i < ScorpionAnimations.scorpions.count; i++){
          let pos = {x:(26+6*i)*16,y:10*16};
          ScorpionAnimations.fullscorpions.push([
            // idle
            new Composite.Animation([
          new Composite.Snap([
            new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:pos.x,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])]),
          // walk
          new Composite.Animation([
            new Composite.Snap([
              new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+1 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16}),
            ]),
            new Composite.Snap([
              new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+2 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
            ])]),
          // climb
          new Composite.Animation([
            new Composite.Snap([
              new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+3 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
            ])]),
            // attack
            new Composite.Animation([
              new Composite.Snap([
                new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+2 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
              ]),
            new Composite.Snap([
              new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+4 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
            ])]),
            // jump
            new Composite.Animation([
              new Composite.Snap([
                new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+1 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
              ])]),
              // dead
              new Composite.Animation([
            new Composite.Snap([
              new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:pos.x+5 * 16,y:pos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
            ])]),
          ])
        }
      }
    }
  }
  
  export class CharacterAnimations {
    public static fullCharacters: Array<Array<Composite.Animation>> = [];

    public static buildCharacter(char: FullChar): Array<Composite.Animation>{
      let fcsize: T.Box = {w:3,h:7};

      let charpos: T.Point = {x:(26 + 6 * Math.floor(char / fcsize.h)) * 16, y:(1 + char % fcsize.h) * 16}
      return [
          // idle
          new Composite.Animation([
      new Composite.Snap([
        new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
      ])]),
      // walk
      new Composite.Animation([
        new Composite.Snap([
          new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+1 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16}),
        ]),
        new Composite.Snap([
          new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+2 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
        ])]),
      // climb
      new Composite.Animation([
        new Composite.Snap([
          new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+3 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
        ])]),
        // attack
        new Composite.Animation([
          new Composite.Snap([
            new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+2 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ]),
        new Composite.Snap([
          new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+4 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
        ])]),
        // jump
        new Composite.Animation([
          new Composite.Snap([
            new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+1 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
          ])]),
          // dead
          new Composite.Animation([
        new Composite.Snap([
          new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+5 * 16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
        ])]),
      ]
    }

    constructor(){
      if(CharacterAnimations.fullCharacters.length == 0){

        let fcsize: T.Box = {w:3,h:7};
        
        for(let i = 0; i < fcsize.w; i++){
          for(let j = 0; j < fcsize.h; j++){
            let charpos: T.Point = {x:(26 + 6 * i) * 16, y:(1 + j) * 16}
            CharacterAnimations.fullCharacters.push(
              [
                // idle
                new Composite.Animation([
            new Composite.Snap([
              new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
            ])]),
            // walk
            new Composite.Animation([
              new Composite.Snap([
                new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+1*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16}),
              ]),
              new Composite.Snap([
                new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+2*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
              ])]),
            // climb
            new Composite.Animation([
              new Composite.Snap([
                new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+3*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
              ])]),
              // attack
              new Composite.Animation([
                new Composite.Snap([
                  new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+2*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
                ]),
              new Composite.Snap([
                new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+4*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
              ])]),
              // jump
              new Composite.Animation([
                new Composite.Snap([
                  new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+1*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
                ])]),
                // dead
                new Composite.Animation([
              new Composite.Snap([
                new Composite.Image("_assets/demon/tileset_16x16_5A5268.png",{x:charpos.x+5*16,y:charpos.y,w:16,h:16},{x:0,y:0,w:16,h:16})
              ])]),
            ])
          }
        }
      }
    }
  }
}