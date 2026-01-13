import {Composite} from "../render/composite"
import {Render} from "../render/_render"
import Shader from "../render/_shaders"

export class Window {
  public source : Render.GLContext;
  public target : HTMLCanvasElement | null;

  public frm : Composite.Frame;
  private static windows : Array<Window> = [];
  /**
   * source : Render.GLContext
   * target : HTMLCanvasElement (2D canvas or same as source)
   */

  constructor(source:Render.GLContext,target: HTMLCanvasElement = null){
    this.source = source;
    this.target = target;
    // target.addEventListener('mousedown',()=>{
    //   console.log("bob");
    // })
    // target.onclick((e)=>console.log("BOB"));
    Window.windows.push(this);
  }

  public static refresh(){
    Window.windows.forEach((w)=>w.update());
  }
  
  public update(){
    this.frm.compose();
    
    
    if(this.target!=null){
      
    } else {
      var gl = this.source.gl;

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      
      // gl.viewport(windwx, windowy, windowwidht, windowheight);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
      // gl.clearColor(0, 0.5, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      // console.log("C");
      
      gl.bindTexture(gl.TEXTURE_2D, this.frm.texture)
      this.frm.shadercontext.passShader(this.frm, {w:gl.canvas.width,h:gl.canvas.height});
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }
}