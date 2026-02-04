import Collision from "../physics/_collision"
import {Bodies} from "../alacrity/_bodies";
import {System} from "./_system"
import * as C from "../physics/states"

export class Physics extends System {
  public collisionpool : Array<Collision> = [];
  private static physicspool  : Physics[] = [];
  
  constructor(){
    super();
    Physics.physicspool.push(this);
  }

  public refresh(){
    for(let phys of Physics.physicspool){

      phys.collisionpool = phys.collisionpool.filter((a) => (!a.deleteMe));
      
      let all : Array<Collision> = phys.collisionpool.filter((a) => (a.self!=null) || a.self==null);
      for(let item of all){
        if(item.self) item.self.activeeffects =[C.CollideTypes.none,C.CollideTypes.none,C.CollideTypes.none,C.CollideTypes.none];
    }
    
    all.forEach((element) => {
        let totest: Set<Bodies.Embodiment> = new Set(all.filter((a)=>((a.from & element.cwith) && a.self)).map((a)=>a.self));
        if(element.self) totest.delete(element.self);

        element.update(totest);
      });
    }
  }

  public addCollisionTo(self : Bodies.Embodiment | null, collision: Collision, /* bounds : T.Bounds = {x:0,y:0,w:0,h:0}, isGlobal : boolean = false*/) : Collision {

    this.collisionpool.push(collision);
    if(self!=null){
      self.collisions.push(collision);
      collision.self = self;
    }
    return collision;
  }
}