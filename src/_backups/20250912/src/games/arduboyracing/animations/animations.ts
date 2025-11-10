import { Composite } from "../../../engine/render/composite";


export namespace Animations{
  export class Car {
    public static all: Composite.Snap[] = [];
    public static directions : number = 16;

    constructor(){
      if(Car.all.length <= 0){
        let source = "_assets/arduboy/carsprites.png";

        let north      = new Composite.Snap([new Composite.Image(source,{x:0,y:37,w:13,h:25},{x:5,y:0,w:13,h:25})]);
        let nnortheast = new Composite.Snap([new Composite.Image(source,{x:16,y:37,w:19,h:26},{x:2,y:0,w:19,h:26})]);
        let northeast  = new Composite.Snap([new Composite.Image(source,{x:38,y:39,w:23,h:23},{x:1,y:1,w:23,h:23})]);
        let northeeast = new Composite.Snap([new Composite.Image(source,{x:46,y:0,w:26,h:19},{x:0,y:2,w:26,h:19})]);
        let east       = new Composite.Snap([new Composite.Image(source,{x:36,y:21,w:25,h:13},{x:0,y:7,w:25,h:13})]);


        // flip y
        let south      = new Composite.Snap([new Composite.Image(source,{x:0,y:37,w:13,h:25},{x:5,y:0,w:13,h:25})]);
        let southeast  = new Composite.Snap([new Composite.Image(source,{x:38,y:39,w:23,h:23},{x:1,y:1,w:23,h:23})]);
        let ssoutheast = new Composite.Snap([new Composite.Image(source,{x:16,y:37,w:19,h:26},{x:2,y:0,w:19,h:26})]);
        let southeeast = new Composite.Snap([new Composite.Image(source,{x:46,y:0,w:26,h:19},{x:0,y:2,w:26,h:19})]);
        
        south.rprops.flip.flipy     = true;
        southeast.rprops.flip.flipy = true;
        ssoutheast.rprops.flip.flipy = true;
        southeeast.rprops.flip.flipy = true;
        

        // flip x
        let west       = new Composite.Snap([new Composite.Image(source,{x:36,y:21,w:25,h:13},{x:0,y:7,w:25,h:13})]);
        let northwest  = new Composite.Snap([new Composite.Image(source,{x:38,y:39,w:23,h:23},{x:1,y:1,w:23,h:23})]);
        let nnorthwest = new Composite.Snap([new Composite.Image(source,{x:16,y:37,w:19,h:26},{x:2,y:0,w:19,h:26})]);
        let northwwest = new Composite.Snap([new Composite.Image(source,{x:46,y:0,w:26,h:19},{x:0,y:2,w:26,h:19})]);
        
        northwest.rprops.flip.flipx = true;
        west.rprops.flip.flipx      = true;
        nnorthwest.rprops.flip.flipx = true;
        northwwest.rprops.flip.flipx = true;
        

        //flip x and y
        let southwest  = new Composite.Snap([new Composite.Image(source,{x:38,y:39,w:23,h:23},{x:1,y:1,w:23,h:23})]);
        let ssouthwest = new Composite.Snap([new Composite.Image(source,{x:16,y:37,w:19,h:26},{x:2,y:0,w:19,h:26})]);
        let southwwest = new Composite.Snap([new Composite.Image(source,{x:46,y:0,w:26,h:19},{x:0,y:2,w:26,h:19})]);

        southwest.rprops.flip.flipy = true;
        southwest.rprops.flip.flipx = true;

        ssouthwest.rprops.flip.flipy = true;
        ssouthwest.rprops.flip.flipx = true;

        southwwest.rprops.flip.flipy = true;
        southwwest.rprops.flip.flipx = true;


        Car.all = [
          north,
          nnorthwest,
          northwest,
          northwwest,
          west,
          southwwest,
          southwest,
          ssouthwest,
          south,
          ssoutheast,
          southeast,
          southeeast,
          east,
          northeeast,
          northeast,
          nnortheast
        ]
      }
    }
  }
}