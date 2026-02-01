import { Composite } from "../../engine/render/composite"
import * as T from "../../engine/_type"

export namespace GameAnimations {

  type anims = {
    idle:Array<Composite.Animation>,
    walk:Array<Composite.Animation>
  }

  export class PlayerGuy {
    public static fullPlayerGuy : anims;
    constructor(){
      console.log("/)");
      let spacingv = 14;
      let charv = 23;
      let charh = 32;
      PlayerGuy.fullPlayerGuy = {
        idle: [
          //up
          new Composite.Animation([
          new Composite.Snap([
          new Composite.Image("_assets/gfx/character.png",
            {x:0,y:spacingv+(charv+(spacingv*2))*2,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          )])]),
          //left
          new Composite.Animation([
          new Composite.Snap([
          new Composite.Image("_assets/gfx/character.png",
            {x:0,y:spacingv+(charv+(spacingv*2))*3,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          )])]),
          //down
          new Composite.Animation([
          new Composite.Snap([
          new Composite.Image("_assets/gfx/character.png",
            {x:0,y:spacingv+(charv+(spacingv*2))*0,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          )])]),
          //right
          new Composite.Animation([
          new Composite.Snap([
          new Composite.Image("_assets/gfx/character.png",
            {x:0,y:spacingv+(charv+(spacingv*2))*1,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          )])]),

      ],
        walk: [
          //up
          new Composite.Animation([
          new Composite.Snap([
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*1,y:spacingv+(charv+(spacingv*2))*2,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*2,y:spacingv+(charv+(spacingv*2))*2,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*3,y:spacingv+(charv+(spacingv*2))*2,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*2,y:spacingv+(charv+(spacingv*2))*2,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          )
          ])]),
          //left
          new Composite.Animation([
          new Composite.Snap([
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*1,y:spacingv+(charv+(spacingv*2))*3,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*2,y:spacingv+(charv+(spacingv*2))*3,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*3,y:spacingv+(charv+(spacingv*2))*3,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*2,y:spacingv+(charv+(spacingv*2))*3,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          )
          ])]),
          //down
          new Composite.Animation([
          new Composite.Snap([
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*1,y:spacingv+(charv+(spacingv*2))*0,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*2,y:spacingv+(charv+(spacingv*2))*0,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*3,y:spacingv+(charv+(spacingv*2))*0,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*2,y:spacingv+(charv+(spacingv*2))*0,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          )
          ])]),
          //right
          new Composite.Animation([
          new Composite.Snap([
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*1,y:spacingv+(charv+(spacingv*2))*1,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*2,y:spacingv+(charv+(spacingv*2))*1,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*3,y:spacingv+(charv+(spacingv*2))*1,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          ),
          new Composite.Image("_assets/gfx/character.png",
            {x:charh*2,y:spacingv+(charv+(spacingv*2))*1,w:32,h:23},
            {x:0,y:0,w:32,h:23}
          )
        ])])]
      }
    }
  }
}
