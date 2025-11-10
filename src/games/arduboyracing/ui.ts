import * as T from '../../engine/_type'
import System from '../../engine/systems/_system';
import Touch from '../../engine/systems/touch';
import { Bodies } from '../../engine/alacrity/_bodies';
import { Composite } from '../../engine/render/composite';
import {Render} from '../../engine/render/_render';
// import ~Render

export default class UI extends Bodies.Alacrity{
  public static arrowbuttons : Bodies.UIElement[] = [];
  public static dpad         : Composite.Frame;

  constructor(gameframewidth: number){
    super();
    let sixtyfour = (50/270) * gameframewidth;
    UI.arrowbuttons = [
      new Bodies.UIElement(new Composite.Animation([
        new Composite.Snap([new Composite.Image('_assets/arduboy/dpad_element_north.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour})]),
        new Composite.Snap([new Composite.Image('_assets/arduboy/dpad_element_north.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour}),
                           new Composite.Image('_assets/arduboy/dpad_element_north_highlight.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour})
        ])])),
      new Bodies.UIElement(new Composite.Animation([
        new Composite.Snap([new Composite.Image('_assets/arduboy/dpad_element_west.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour})]),
        new Composite.Snap([new Composite.Image('_assets/arduboy/dpad_element_west.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour}),
                            new Composite.Image('_assets/arduboy/dpad_element_west_highlight.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour})
        ])])),
      new Bodies.UIElement(new Composite.Animation([
        new Composite.Snap([new Composite.Image('_assets/arduboy/dpad_element_south.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour})]),
        new Composite.Snap([new Composite.Image('_assets/arduboy/dpad_element_south.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour}),
                            new Composite.Image('_assets/arduboy/dpad_element_south_highlight.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour})
        ])])),
      new Bodies.UIElement(new Composite.Animation([
        new Composite.Snap([new Composite.Image('_assets/arduboy/dpad_element_east.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour})]),
        new Composite.Snap([new Composite.Image('_assets/arduboy/dpad_element_east.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour}),
                            new Composite.Image('_assets/arduboy/dpad_element_east_highlight.png',{x:0,y:0,w:128,h:128},{x:0,y:0,w:sixtyfour,h:sixtyfour})
        ])]))
    ];

    for(let a of UI.arrowbuttons) a.myAnim.pause();

    UI.arrowbuttons[0].pos.x = sixtyfour/2 + (( 5/270)*gameframewidth);
    UI.arrowbuttons[0].pos.y = 0;
    UI.arrowbuttons[1].pos.x = 0;
    UI.arrowbuttons[1].pos.y = sixtyfour/2 + (( 5/270)*gameframewidth);
    UI.arrowbuttons[2].pos.x = sixtyfour/2 + (( 5/270)*gameframewidth);
    UI.arrowbuttons[2].pos.y = sixtyfour   + ((10/270)*gameframewidth);
    UI.arrowbuttons[3].pos.x = sixtyfour   + ((10/270)*gameframewidth);
    UI.arrowbuttons[3].pos.y = sixtyfour/2 + (( 5/270)*gameframewidth);

    UI.dpad = new Composite.Frame(UI.arrowbuttons.map((u)=>u.myAnim));
    UI.dpad.rprops.pos.x = (55/270) * gameframewidth;
    UI.dpad.rprops.pos.y = Render.Info.gl.canvas.height-((340/270) * gameframewidth);

    UI.dpad.compose();

    Touch.addButton('dpadup',UI.arrowbuttons[0].myAnim.frames[0].getclientbounds())
    Touch.addButton('dpadleft',UI.arrowbuttons[1].myAnim.frames[0].getclientbounds())
    Touch.addButton('dpaddown',UI.arrowbuttons[2].myAnim.frames[0].getclientbounds())
    Touch.addButton('dpadright',UI.arrowbuttons[3].myAnim.frames[0].getclientbounds())

    
  }

  public refresh(){
    // console.log(Touch.touches)
    // console.log(UI.padbounds);
    // Touch.touches.forEach((t)=>{
    //   for(let i = 0; i < UI.arrows.length; i++){
    //     if(Touch.inBounds(t.pos.x,t.pos.y,UI.arrows[i])){
    //       UI.directionspressed[i] = true;
    //       // UI.angle = Math.atan2(t.pos.y - UI.padcenter.y, t.pos.x - UI.padcenter.x) * 4;
    //     } else {
    //       UI.directionspressed[i] = false;
    //     }
    //   }
    // })
    
    // for(let i = 0; i < UI.directionspressed.length; i++){
    //   if(UI.directionspressed[i]){
    //     console.log("YO")
    //     UI.arr[i].style.visibility = "visible";
    //   } else UI.arr[i].style.visibility = "hidden";
    // }
  }

}