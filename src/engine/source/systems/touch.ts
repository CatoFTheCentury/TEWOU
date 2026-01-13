import {System} from "./_system"
import * as T from '../_type';
import { Time } from "../alacrity/time";
import { Bodies } from '../alacrity/_bodies';

type Clickable = {
  bounds     : T.Bounds,
  name       : string,
  callback   : ()=>void,
  ownertouch : number
  // state    : number
}

type Touches = {
  state : number,
  pos   : T.Point,
  start : T.Point,
  timer : Time.Timeout
  // id   : number
}

export class Touch {

  public  static view       : T.Box;
  public  static ckables    : Array<Clickable> = [];
  public  static clicked    : Array<string> = [];
  public  static touches    : Array<Touches> = [];
  private static init       : boolean = false;
  public  static clickables : {[id:string]:number} = {};
  
  constructor(){
    if(!Touch.init){
      let html = document.getElementById("canvas");
      Touch.view = {w:html!.clientWidth, h:html!.clientHeight}
      for(let i = 0; i < 4; i++){
        Touch.touches.push({
          state : 0,
          pos   : {x:0,y:0},
          start : {x:0,y:0},
          timer : new Time.Timeout([Infinity],"time")
        })
      }
      
      document.addEventListener('touchstart', (event: TouchEvent) => {
        // if()
        for(let i = 0; i < Math.min(event.changedTouches.length,4); i++){
          // console.log(event.changedTouches[i].clientX)
          // console.log(event.changedTouches[i].identifier)
          Touch.touches[event.changedTouches[i].identifier] = {
            state: 1,
            pos   : {x:event.changedTouches[i].clientX,
                    y:event.changedTouches[i].clientY},
            start : {x:event.changedTouches[i].clientX,
                    y:event.changedTouches[i].clientY},
            timer : new Time.Timeout([Infinity],"time")
          }
          // update this
          // for(let c of Touch.clickables){
          //   if(Touch.inBounds(
          //     Touch.touches[event.changedTouches[i].identifier].pos.x,
          //     Touch.touches[event.changedTouches[i].identifier].pos.y,
          //     c.bounds)) c.callback();
            // if(Touch.inBounds(Touch.touchPos.x,Touch.touchPos.y, c.bounds)) Touch.clicked.push(c.name);
          // }
        }
      });
          
      document.addEventListener('touchend', (event: TouchEvent) => {
        event.preventDefault();
        for(let i = 0; i < event.changedTouches.length; i++){
          Touch.touches[event.changedTouches[i].identifier].state = -1;
        }
        Touch.clicked = [];
        // Touch.time.paused = true;
        // Touch.touchstate = -1;
      });
      
      document.addEventListener('touchmove', (event: TouchEvent) => {
        event.preventDefault();
        for(let i = 0; i < event.changedTouches.length; i++){
          Touch.touches[event.changedTouches[i].identifier].pos = 
          {x: event.changedTouches[i].clientX, y: event.changedTouches[i].clientY};
        }
      });
          
          // let ckables = [].slice.call(document.getElementById('clickables')!.getElementsByTagName('*'));
          // for(let c of ckables){
            //   let boundrect = c.getBoundingClientRect();
            //   Touch.clickables.push({name:c.getAttribute('id'),bounds:{x:boundrect.left,y:boundrect.top,w:boundrect.right-boundrect.left,h:boundrect.bottom-boundrect.top}})
            // }
            // let swordclickable = document.getElementById("sword");
            
    }
    Touch.init = true;
  }

  public static refresh(){
    for(let t in Touch.touches){
      Touch.touches[t].state = Touch.touches[t].state  < 0 ? 
        0 : Touch.touches[t].state  > 0 ? 2 : 0;
    }

    for(let c in Touch.clickables){
      Touch.clickables[c] = Touch.clickables[c]  < 0 ? 
        0 : Touch.clickables[c]  > 0 ? 2 : 0;
    }

    for(let i = 0; i < Touch.touches.length; i++){
      let h = Touch.touches[i];
      if(h && h.state == 0){
        for(let j of Touch.ckables){
          if(i==j.ownertouch) {
            Touch.clickables[j.name] = -1;
            j.ownertouch = -1;
          }
        }
      }
      if(h && h.state > 0){
        for(let j of Touch.ckables){
          // if(h==j.ownertouch && h.state)
          if(Touch.inBounds(h.pos.x,h.pos.y,j.bounds)){
            if(Touch.clickables[j.name] <= 0) {
              Touch.clickables[j.name] = 1;
              j.ownertouch = i;
            } 
            j.callback();
          } else if(Touch.clickables[j.name] > 0){
              Touch.clickables[j.name] = -1;
              j.ownertouch = -1;
            }
        }
      }
    }
    
    // for(let k in Keyboard.keys){
    //   Touch.touchstate = Touch.touchstate < 0 ? 
    //     0 : Touch.touchstate > 0 ? 2 : 0;
    // // }
  }

  public static addButton(name: string, bounds: T.Bounds, callback=()=>{}){
    Touch.ckables.push({name:name,bounds:bounds,callback:callback,ownertouch:-1});
    console.log(bounds);
    Touch.clickables[name] = 0;
    // Touch.clickables.push({name:name,bounds:bounds,callback:callback})
  }

  public static registeruielement(name:string, element: Bodies.UIElement){

  }

  public static inBounds(x:number, y:number, bounds : T.Bounds){
    return  x > bounds.x &&
            x < bounds.x + bounds.w &&
            y > bounds.y &&
            y < bounds.y + bounds.h;
  }
}

