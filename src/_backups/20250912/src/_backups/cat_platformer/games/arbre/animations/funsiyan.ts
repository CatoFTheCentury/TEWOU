import {Composite} from "../../../engine/render/composite"

// export namespace Anims {
export default class FunSiYan {
  public idle: Array<Composite.Snap>;
  public walkAni: Array<Composite.Animation>;
  public sword : Array<Composite.Animation>;

  constructor(){
    this.idle = [
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:0,y:0,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:0,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
      ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:32,y:0,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:32,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
      ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:64,y:0,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:64,w:32,h:32}, {x:0,y: 0,w:32,h:32}),

      ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:96,y:0,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:96,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
    ])];
  
    this.walkAni = [
      new Composite.Animation([
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:0,y:32,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:0,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:0,y:64,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:0,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:0,y:96,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:0,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:0,y:128,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:0,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:0,y:160,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:0,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
      ]),
      new Composite.Animation([
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:32,y:32,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:32,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:32,y:64,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:32,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:32,y:96,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:32,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:32,y:128,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:32,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:32,y:160,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:32,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
      ]),
      new Composite.Animation([
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:64,y:32,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:64,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:64,y:64,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:64,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:64,y:96,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:64,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:64,y:128,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:64,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:64,y:160,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:64,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
      ]),
      new Composite.Animation([
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:96,y:32,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:96,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:96,y:64,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:96,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:96,y:96,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:96,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:96,y:128,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:96,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
        new Composite.Snap([
            new Composite.Image("_assets/body0.png", {x:96,y:160,w:32,h:32}, {x:0,y:14,w:32,h:32}),
            new Composite.Image("_assets/head0.png", {x: 0,y:96,w:32,h:32}, {x:0,y: 0,w:32,h:32}),
          ]),
    ])];
  }
}