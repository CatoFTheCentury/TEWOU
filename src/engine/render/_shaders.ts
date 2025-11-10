import {Render} from "./_render"
import * as T from "../_type"
import Assets from "./assets"
import {Composite} from "./composite"
import Matrix from "./shaders/matrices"


export default abstract class Shader extends Render.Info {
  public static shaders : {[id:string]:Shader} = {};
  public static fallbackShader: string = 'normal';
  protected static previousShader : string = "";
  protected static currShader     : Shader;

  public abstract name : string;
  public abstract program : WebGLProgram;
  public abstract first  : Array<()=>void>;
  public abstract second : Array<()=>void>;
  public abstract passes : Array<(cmp: Composite.Image, plane: T.Box)=>void>;



  public static getShader (id: string = '') : Shader{
    let shader : Shader = Shader.shaders[id] || Shader.shaders[Shader.fallbackShader] || undefined
    if(shader===undefined){
      console.log("Shader "+id+" doesn't exist and couldn't find fallback shader "+ Shader.fallbackShader)
    }
    return shader;
  }

  public static compileShader(type: number, source: string): WebGLShader | null {
    let shader = Shader.gl.createShader(type) as WebGLShader
    Shader.gl.shaderSource(shader, source)
    Shader.gl.compileShader(shader)
    let success: boolean = Shader.gl.getShaderParameter(shader, Shader.gl.COMPILE_STATUS)
    if (success) return shader
  
    console.debug(Shader.gl.getShaderInfoLog(shader))
    Shader.gl.deleteShader(shader)
    return null;
  }

  public static createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    let program = Shader.gl.createProgram() as WebGLProgram
    Shader.gl.attachShader(program, vertexShader)
    Shader.gl.attachShader(program, fragmentShader)
    Shader.gl.linkProgram(program)
    let success = Shader.gl.getProgramParameter(program, Shader.gl.LINK_STATUS)
    if (success) return program
  
    console.debug(Shader.gl.getProgramInfoLog(program))
    Shader.gl.deleteProgram(program)
    return null;
  }

  
    public static passShader(cmp:Composite.Image, plane: T.Box){
      if(cmp.rprops.shaderID!=undefined) Shader.validateShader(cmp.rprops.shaderID);
      else Shader.validateShader(this.fallbackShader);

      // console.log(Shader.currShader.name)
  
      if(Shader.currShader != undefined){
        // for(const a in Shader.currShader.first){
        //   // console.log("A");
        //   Shader.currShader.first[a]();
        // }
        
        for(const a of Shader.currShader.second){
          a();
        }
        
        for(const a of Shader.currShader.passes){
          a(cmp, plane);
        }
      }
    }
  
    private static validateShader(shaderID : string){
      if(Shader.previousShader!==shaderID) {
        Shader.currShader = Shader.shaders[shaderID]
        if(Shader.currShader != undefined) {
          Shader.initShader(Shader.currShader);
          Shader.previousShader = shaderID;
        } else {
          console.log('Using Fallback shader');
          Shader.currShader = Shader.shaders[this.fallbackShader] || undefined;
          if(Shader.currShader != undefined) Shader.initShader(Shader.currShader);
          else console.log("Fallback shader undefined")
          Shader.previousShader = this.fallbackShader;
        }
      }
    }
  
    private static initShader(sh : Shader){
      Render.Info.gl.useProgram(sh.program)
      for(const a of Shader.currShader.first){
        a();
      }
    }
}

