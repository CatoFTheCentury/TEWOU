import {Composite} from "../render/composite"
import * as T from "../_type"

type Sprite = {
  file: string,
  srcrect: T.Bounds
}

type Gani = {
  properties: number,
  // sprites: Array<Sprite>,
  next: string,
  animations : Array<Composite.Animation>
};




export default class GaniParser {

  // private 

  public static parse(file: string): Gani{
    let sprites: Array<Sprite> = [];
    let properties: number = 0;
    let next: string = "";
    let anims: Array<Composite.Animation> = [new Composite.Animation([]),new Composite.Animation([]),new Composite.Animation([]),new Composite.Animation([])]
    // let anims: Array<Array<Composite.Snap>>= [[]]
    // let gani: Gani = {
    //   properties : 0,
    //   // sprites : [],
    //   next: "",
    //   animations: 
    // };

    let ani: boolean = false;
    let defaults = {
      HEAD: "",
      BODY: "",
      SWORD:"redlightsabersword.png"
    }

    let lines = file.split('\n').map((l)=>l.trim());

    for(let i = 0; i < lines.length; i++){
      let properties = lines[i].split(' ');
      let firstargument: string = properties.shift()!;
      switch(firstargument){
        case "DEFAULTHEAD":
          defaults.HEAD = properties.join(' ');
        break;
        case "DEFAULTBODY":
          defaults.BODY = properties.join(' ');

      }
    }

    let direction = 0;
    for(let i = 0; i < lines.length; i++){
      if(ani){
        if(lines[i].startsWith("ANIEND")) break;
        if(lines[i].startsWith("PLAYSOUND")) continue;

        let timeout = 300;
        if(lines[i].startsWith("WAIT")){
          timeout = Number(lines[i].split(' ')[1]) * 1000;
          continue;
        }

        let imgs = lines[i].split(',').filter((l)=>l!='');
        if(imgs.length > 0){
          let snap: Composite.Snap = new Composite.Snap([]);

          for(let j = 0; j < imgs.length; j++){
            let attributes: Array<string> = imgs[j].split(' ').filter((l)=>l!='');
            // console.log(attributes)
            if(sprites[Number(attributes[0])].file==="")continue;
            snap.parts.push(
              new Composite.Image(
                sprites[Number(attributes[0])].file, 
                sprites[Number(attributes[0])].srcrect, 
                { x:Number(attributes[1]), y: Number(attributes[2]),
                  w:sprites[Number(attributes[0])].srcrect.w,
                  h:sprites[Number(attributes[0])].srcrect.h,
            }));
          }
          
          // snap.parts = snap.parts.filter()
          anims[direction].frames.push(snap);
          direction = (direction + 1) % 4;
        }
      } else {
        let properties = lines[i].split(' ').filter((l)=>l!='');
        // console.log(properties)
        let firstargument = properties.shift();
        switch(firstargument){
          case "SPRITE":
            sprites[Number(properties[0])] = {
              file: defaults[properties[1]] == undefined? "" : "_assets/" + defaults[properties[1]],
              srcrect: {x:Number(properties[2]),y:Number(properties[3]),w:Number(properties[4]),h:Number(properties[5])}
            }
            // console.log( sprites[Number(properties[0])]);
          break;
          case "ATTACHSPRITE":
          break;
          case "ANI":
            ani = true;
          break;
          case "LOOP":
            // properties |= GaniProperties.LOOP;
          break;
          case "CONTINUOUS":
            // properties |= GaniProperties.CONTINUOUS;
          break;
          case "SETBACKTO":
            next = properties.join(' ');
          break;
          case "SINGLEDIRECTION":
            // properties |= GaniProperties.SINGLEDIRECTION;
          break;

            
        }
      }
    }
    console.log(anims)
    return {
      properties: properties,
      next: next,
      animations: anims
    };
  }
}