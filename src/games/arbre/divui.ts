import {T, Incarnations, System} from 'TEWOU'

// import * as T from '../../engine/_type'
// import { Incarnations } from '../../engine/alacrity/_incarnations';
// import System from '../../engine/systems/_system'
// import Character from './character'

export default class divUI extends System{
  private static container: HTMLElement;
  private static view: T.Bounds;
  private static actor: Incarnations.Player;

  private static heartimgsize: T.Box = {w:40,h:48};
  // private static

  constructor(actor: Incarnations.Player){
    super();
    divUI.actor = actor;
    let html = document.getElementsByTagName('html')[0]
    divUI.view = {x:0, y:0, w: html.clientWidth, h: html.clientWidth};

    let div: HTMLDivElement = document.createElement('div');
    div.style.height = "24%";
    div.style.width  = "100%"
    div.style.top = "-12%";
    div.style.position = "relative";
    // div.style.background = "white";
    document.getElementById('ui')!.appendChild(div);
    divUI.container = div;
    // console.log(divUI.container)

    let hearts: HTMLDivElement = document.createElement('div');
    hearts.style.width = divUI.heartimgsize.w * divUI.actor.hp.max + "px";
    hearts.style.height = divUI.heartimgsize.h + "px";
    hearts.style.position = "relative";
    hearts.style.right = "0";
    divUI.container.appendChild(hearts);


    for(let i = 0; i < divUI.actor.hp.max; i++){

      let heartContainer: HTMLDivElement = document.createElement('div');
      heartContainer.style.position = "absolute";
      heartContainer.style.left = i * (divUI.heartimgsize.w + 5)+ "px";
      heartContainer.style.width  = "40px";
      heartContainer.style.height = "48px";
      // heartContainer.style.margin = "10px";
      heartContainer.style.overflow = "hidden";
      
      let img: HTMLImageElement  = document.createElement('img');
      img.style.position = "relative"
      // img.style.left = "-40px";
      img.src = "_assets/arbre/state.png"

      hearts.appendChild(heartContainer);
      heartContainer.appendChild(img);
    }

  }

  // public static update(): void {
    
  // }

  refresh(){}
  
}