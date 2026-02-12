import Shader from "./_shaders"
import {Assets} from "./assets"
import ShaderTemplate from "./shaders/template"

import {Reverser} from './shaders/reverser'
import {Normal} from './shaders/normal'
import {WhiteTransparent} from './shaders/whitetransparent'

export class ShaderLoader extends Shader {
  private shaderts : Array<ShaderTemplate>;
  private static initialized = false;

  constructor(gl: WebGL2RenderingContext, shaderts : Array<ShaderTemplate> = [new Normal(), new Reverser(), new WhiteTransparent()]){
    super(gl);
    this.shaderts = shaderts;
  }

  public async init() : Promise<void>{
    if(!ShaderLoader.initialized) await this.compileAllShadersFrom("shaders/");
    ShaderLoader.initialized = true;
  }
    
  private async compileAllShadersFrom(folder: string) : Promise<Array<string>>{ 
    let programs : Array<string> = [];

    await Promise.all(await Assets.loadAllExtInFolder(folder, ["frag","vert"]))
      .then((q)=>{
        q.map((val, idx, arr)=>{
          let name = val.split('/')[1].split('.')[0];
          for(let i = idx; i< arr.length; i++){
            if(name == arr[i].split('/')[1].split('.')[0] && !programs.includes(name)){
              programs.push(name);
            }
          }
        });});;

    for(let i = 0; i < programs.length ; i++){
      this.shaders[programs[i]] = (()=>{
        let vertexShader   = this.compileShader(this.gl.VERTEX_SHADER, Assets.getText("shaders/" + programs[i] + ".vert"))
        let fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, Assets.getText("shaders/" + programs[i] + ".frag"))
        let program        = this.createProgram(vertexShader, fragmentShader)
        if(!program){
          console.log("Shader creation unsuccessful:" + this.shaders[programs[i]]);
        }
        for(let j = 0; j < this.shaderts.length; j++){
          if(this.shaderts[j].name == programs[i]){
            if(program!=null) {
              this.shaderts[j].program = program;
              return this.shaderts[j];
            }
          }
        }
        // If unsuccessful, revert to first loaded shader
        // Should return default shader, for now it is first in the list
        // of loaded shaders (shaderts:Array<Shader>)
        return this.shaderts[0];
      })();
    }

    return programs;
  }

}
