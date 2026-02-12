// import {glContext} from "./_render"
import * as T from "../_type"
// import Assets from "./assets"
import {Composite} from "./composite"
import ShaderTemplate from "./shaders/template"
import Matrix from "./shaders/matrices"


export default abstract class Shader {
  protected fallbackShader : string = 'normal';
  protected shaders        : {[id:string]:ShaderTemplate} = {};
  protected previousShader : string = "";
  protected currShader     : ShaderTemplate;

  protected gl : WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext){
    this.gl = gl;
  }

  public getShader (id: string = '') : ShaderTemplate{
    let shader : ShaderTemplate = this.shaders[id] || this.shaders[this.fallbackShader] || undefined
    if(shader===undefined){
      console.log("Shader "+id+" doesn't exist and couldn't find fallback shader "+ this.fallbackShader)
    }
    return shader;
  }

  protected compileShader(type: number, source: string): WebGLShader | null {
    let shader = this.gl.createShader(type) as WebGLShader
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    let success: boolean = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)
    if (success) return shader
  
    console.debug(this.gl.getShaderInfoLog(shader))
    this.gl.deleteShader(shader)
    return null;
  }

  protected createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    let program = this.gl.createProgram() as WebGLProgram
    this.gl.attachShader(program, vertexShader)
    this.gl.attachShader(program, fragmentShader)
    this.gl.linkProgram(program)
    let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS)
    if (success) return program
  
    console.debug(this.gl.getProgramInfoLog(program))
    this.gl.deleteProgram(program)
    return null;
  }

  
    public passShader(cmp:Composite.Image, plane: T.Bounds, extraarguments: T.ExtraShaderArguments = {}){
      if(cmp.rprops.shaderID!=undefined) this.validateShader(cmp.rprops.shaderID);
      else this.validateShader(this.fallbackShader);

      if(this.currShader != undefined){
        // for(const a in this.currShader.first){
        //   this.currShader.first[a]();
        // }
        
        for(const a of this.currShader.second){
          a();
        }
        
        for(const a of this.currShader.passes){
          a(this.gl, cmp, plane, extraarguments);
        }
      }
    }
  
    private validateShader(shaderID : string){
      if(this.previousShader!==shaderID) {
        this.currShader = this.shaders[shaderID]
        if(this.currShader != undefined) {
          this.initShader(this.currShader);
          this.previousShader = shaderID;
        } else {
          console.log('Using Fallback shader');
          this.currShader = this.shaders[this.fallbackShader] || undefined;
          if(this.currShader != undefined) this.initShader(this.currShader);
          else console.log("Fallback shader undefined")
          this.previousShader = this.fallbackShader;
        }
      }
    }
  
    private initShader(sh : ShaderTemplate){
      this.gl.useProgram(sh.program)
      for(const a of this.currShader.first){
        a(this.gl);
      }
    }
}

