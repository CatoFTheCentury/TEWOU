  
import * as T from "../_type"
import Assets from "../render/assets"

export default class IniParser {
  public static loadCSV(file: string){
    return {tileYX : file.split('\n').filter((a)=>a!='').map(x=>x.split(',').map(y=>Number(y)))};
  }

  public static async loadIni (iniFileName: string) : Promise<T.CellBuild> {

    let tiles       : Array<T.tilesLayer> = [];
    let npcs        : string = "";
    let collisions  : Array<Array<boolean>> = [];
    let tileset     : WebGLTexture;
    let tilesetwidth: number;
    let square      : T.Box;
    let playLayer   : number;

    // const lvlPath = iniFileName.split('.')[0];
    
    const inifile: string = Assets.getText(await Assets.addText(iniFileName));
    // const iniFile = await Assets.getText(iniFileName);

    const iniLines: Array<string> = inifile.split('\n');
    for(let i = 0; i < iniLines.length; i++){
      const currLine : Array<string> = iniLines[i].split(' ');
      switch (currLine[0]){
        case "TILESET":
          const currParams : Array<string> = currLine[1].split(':');
          switch (currParams[0]) {
            case "SQUARE":
              square = {w:Number(currParams[1]), h:Number(currParams[1])};
            break;
            case "FILE":
              tileset = Assets.getTexture(await Assets.addImage(currParams[1]));
              tilesetwidth = Assets.getTextureWidth(currParams[1]);
            break;
          };
        break;
        case "PLAYGROUND":
          playLayer = Number(currLine[1]);
        break;
        case "CSV":
          let props = currLine[1].split(':');
          const tileLayer: string = Assets.getText(await Assets.addText(props[1]));
          tiles[Number(props[0])] = {tileYX : tileLayer.split('\n').filter((a)=>a!='').map(x=>x.split(',').map(y=>Number(y)))};
        break;
        case "NPCS":
          let npcsInfo: string = Assets.getText(await Assets.addText(currLine[1]));
          npcs = npcsInfo/* .replace(/\n(?!\Z)/g,',').split(',') */;
        break;
        case "COLLISION":
          const collisionLn: string = Assets.getText(await Assets.addText(currLine[1]));
          const ln: Array<string> = collisionLn.split('\n');
          let coll: Array<Array<boolean>> = [];
          for(let l of ln){
            coll.push(l.split(',').map((y:String) => Number(y) < 0 ? false : true))
          }

          collisions = coll;
          // console.log(collisions);
        break;
        default:
        break;
      };
    }

    return     {
      tiles       : tiles     ,
      npcs        : npcs      ,
      collisions  : collisions,
      tileset     : tileset!  ,
      tilesetwidth: tilesetwidth!,
      square      : square!   ,
      playLayer   : playLayer!,
      grid        : {w: tiles[0].tileYX[0].length, h:tiles[0].tileYX.length}
    };
  }
}