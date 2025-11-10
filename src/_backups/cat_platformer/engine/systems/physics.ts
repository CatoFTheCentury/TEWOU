import Collision from "../physics/_collision"
import {Bodies} from "../alacrity/_bodies";
import System from "./_system"
import * as T from "../_type"
import * as C from "../physics/states"

export default class Physics extends System {
  public static collisionpool : Array<Collision> = [];
  // private affectedpool : Array<Bodies.Mobility>  = [];
  constructor(){
    super();
  }

  public refresh(){
    Physics.collisionpool = Physics.collisionpool.filter((a) => (!a.deleteMe));
    
    let all : Array<Collision> = Physics.collisionpool.filter((a) => (a.self!=null) || a.self==null);
    for(let item of all){
      if(item.self) item.self.activeeffects =[C.CollideTypes.none,C.CollideTypes.none,C.CollideTypes.none,C.CollideTypes.none];
    }
    
    all.forEach((element) => {
        let totest: Set<Bodies.Embodiment> = new Set(all.filter((a)=>((a.from & element.to) && a.self)).map((a)=>a.self));
        if(element.self) totest.delete(element.self);

        // if(element.self?.dbgName === "scorpion") {console.log(dupes); console.log(element);}
        element.update(totest);
    });
  }

  public addCollisionTo(self : Bodies.Embodiment | null, collision: Collision, /* bounds : T.Bounds = {x:0,y:0,w:0,h:0}, isGlobal : boolean = false*/) : Collision {

    // collision.offX     = bounds.x;
    // collision.offY     = bounds.y;

    // collision.width    = bounds.w;
    // collision.height   = bounds.h;

    // if(self?.dbgName == "scorpion"){
    //   console.log(self?.dbgName);
    //   console.log(bounds.y * this.zoom);
    //   console.log({x:collision.offX, y: collision.offY, w:collision.width, h:collision.height})
    // }

    Physics.collisionpool.push(collision);
    if(self!=null){
      self.collisions.push(collision);
      collision.self = self;
    }
    return collision;
  }
}