import {Render} from "./_render"
import Shader from "./_shaders"
import Assets from "./assets"

import Reverser from './shaders/reverser'
import Normal from './shaders/normal'

export default abstract class ShaderLoader extends Shader {
  public static shaderts : Array<Shader> = [new Normal(), new Reverser()];

  public static async init() : Promise<void>{
    await this.compileAllShadersFrom("shaders/");

  }
    
  private static async compileAllShadersFrom(folder: string) : Promise<Array<string>>{ 
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
      Shader.shaders[programs[i]] = (()=>{
        let vertexShader   = Shader.compileShader(Shader.gl.VERTEX_SHADER, Assets.getText("shaders/" + programs[i] + ".vert"))
        let fragmentShader = Shader.compileShader(Shader.gl.FRAGMENT_SHADER, Assets.getText("shaders/" + programs[i] + ".frag"))
        let program        = Shader.createProgram(vertexShader, fragmentShader)
        if(!program){
          console.log("Shader creation unsuccessful:" + Shader.shaders[programs[i]]);
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
