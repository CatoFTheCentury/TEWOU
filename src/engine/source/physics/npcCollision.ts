import * as C       from './states'
// import NPC          from '../archetypes/npcs/_npc'
import * as T       from '../_type'
import {Bodies} from '../alacrity/_bodies';

import Collision from "./_collision"
// import Collision from "../collisions/_collision"

export class NPCCollision extends Collision {
  // public self : Bodies.Embodiment;


  constructor(self: Bodies.Embodiment, cwith : C.CollideLayers, types : C.CollideTypes){

    super(cwith, types);
    this.self = self;
    this.padding = {x:8,y:8};

  }

public intersect(bd: Bodies.Embodiment): void {
    const body: T.Bounds = { x: bd.pos.x + bd.hitbox.x, y: bd.pos.y + bd.hitbox.y, w: bd.hitbox.w, h: bd.hitbox.h }
    const collidePoints = this.computeCollidePoints(
        body,
        this.padding
    );

    const npcBounds: T.Bounds = {
        x: this.self.pos.x + this.self.hitbox.x,
        y: this.self.pos.y + this.self.hitbox.y,
        w: this.self.hitbox.w,
        h: this.self.hitbox.h
    };

    let applyEffects: Array<C.CollideTypes> = [
        C.CollideTypes.none,
        C.CollideTypes.none,
        C.CollideTypes.none,
        C.CollideTypes.none
    ];

    if((body.x > npcBounds.x && body.x + this.padding.x < npcBounds.x + npcBounds.w) || (body.x + body.w - this.padding.x > npcBounds.x && body.x + body.w < npcBounds.x + npcBounds.w)){
    // Check top
    applyEffects[0] |= ((npcBounds.y + npcBounds.h) - body.y > 0 && body.y > npcBounds.y)  ? this.type : C.CollideTypes.none;
    // Check below
    applyEffects[2] |= (npcBounds.y - (body.y + body.h) < 0 && body.y + body.h < npcBounds.y + npcBounds.h) ? this.type : C.CollideTypes.none;
    }

    if((body.y > npcBounds.y && body.y + this.padding.y < npcBounds.y + npcBounds.h) || (body.y + body.w - this.padding.y > npcBounds.y && body.y + body.w < npcBounds.y + npcBounds.h)){
      // Check left
      applyEffects[1] |= ((npcBounds.x + npcBounds.w) - body.x > 0 && body.x > npcBounds.x) ? this.type : C.CollideTypes.none;
      // Check right
      // console.log("npcbdx" + npcBounds.x + " rightmost:" + (body.x + body.w) +" lt0:" + (npcBounds.x - body.x + body.w) + " limits:" + (body.x + body.w < npcBounds.x + npcBounds.w))
      applyEffects[3] |= (npcBounds.x - (body.x + body.w) < 0 && body.x + body.w < npcBounds.x + npcBounds.w) ? this.type : C.CollideTypes.none;
    }

    // Apply effects
    for (let i = 0; i < 4; i++) {
        bd.activeeffects[i] |= applyEffects[i];
    }
}

// Helper function to check bounds
static checkBounds(points: Array<Array<number>>, bounds: T.Bounds): boolean {
    return Collision.inBounds(points[0][0], points[1][0], bounds) ||
           Collision.inBounds(points[0][1], points[1][1], bounds);
}
}
