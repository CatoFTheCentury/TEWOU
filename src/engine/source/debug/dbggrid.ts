import * as T from "../_type"
import {CollisionGrid} from "../physics/gridCollision";
import { Composite } from "../render/composite";

export namespace Debug {

  export class Grid {

    public static see(grid: CollisionGrid, where: T.Bounds): Composite.Snap {
      let imgs : Array<Composite.Image> = [];
      let square    : number = 16;
      console.log("Grid resolution")
      for(let y = where.y; y<where.h; y+=grid.resolution){
        for(let x = where.x; x<where.w; x+=grid.resolution){
          if(grid.testWall({x:x,y:y})) imgs.push(new Composite.Image("_assets/_debug/blocking.png",{x:0,y:0,w:16,h:16},{x:x,y:y,w:16,h:16}))
          }
      }
      let snp = new Composite.Snap(imgs);
      console.log("Grid created", snp);
      snp.rprops.layer = 10;
      return snp;
    }
  }
}